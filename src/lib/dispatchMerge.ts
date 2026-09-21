// Canonical dedupe for the Neural Dispatch Center / Operations queue.
//
// The Operations grid merges FOUR sources that can each describe the same video:
//   1. `/api/approval/pending`      → item.id = approval-row uuid; the underlying
//                                     media row id lives in payload.assetId
//   2. `/api/studio/assets`         → item.id = creation id (and video-projects row
//                                     id for the scene projects it already embeds)
//   3. `/api/studio/video-projects` → item.id = video_projects.id
//   4. localStorage fast path       → item.id = video_projects.id
//
// The historical merge deduped only by item.id, so the same video appeared once
// as its approval card AND once as its asset/project card (different id
// namespaces) — the owner's "2 popped up each time I made a video" (4 cards for
// 2 videos). Completed-video GHOST approvals (payload.assetId resolving to a
// deleted/re-created generation, e.g. the stale scene receipts whose r2Key points
// at a project id that no longer exists) rendered as dead extra cards on top.
//
// This module merges all four sources into ONE card per unique media row,
// keyed by the CANONICAL media id (payload.assetId/projectId or the row id),
// keeps the richest available card fields, preserves the approval-row id on a
// merged card (Save/Feedback/Delete all target the approval uuid), and drops
// ghost approvals — fail-open if no live media universe could be loaded.

export interface DispatchCard {
  id: string;
  type?: string;
  status?: string;
  payload?: Record<string, any>;
  /** internal tag of the highest-precedence source that supplied this card */
  _source?: 'asset' | 'project' | 'local' | 'approval';
  [k: string]: any;
}

const VIDEO_LIKE_TYPES = new Set([
  'video',
  'enhanced_video',
  'neural_twin',
  'scene',
  'faceless',
]);

/** A card is a video card if its type is video-like OR its payload declares a
 *  scene/faceless mode or a video-ish category (approvals carry type 'video'). */
export const isVideoLike = (card: any): boolean => {
  const t = String(card?.type || card?.payload?.type || '').toLowerCase();
  if (VIDEO_LIKE_TYPES.has(t)) return true;
  const mode = String(card?.payload?.mode || '').toLowerCase();
  if (mode === 'scene' || mode === 'faceless') return true;
  return String(card?.payload?.category || '').toLowerCase().includes('video');
};

const isCompleted = (card: any): boolean =>
  card?.status === 'completed' || card?.payload?.status === 'completed';

/** Canonical id of the underlying media row for ANY source card. Approvals store
 *  it in payload.assetId (fall back to payload.projectId then the row id);
 *  asset/project/local cards use their own id. */
export const canonicalMediaId = (card: any): string =>
  String(card?.payload?.assetId || card?.payload?.projectId || card?.id || '');

/** A card's media is "usable" only when its video URL points at a real http(s)
 *  URL. Legacy local paths (e.g. "/app/public/assets/cinema/sora/...mp4" —
 *  creation 2c94144a) look truthy but the file no longer exists: counting them
 *  as media enabled Save/Download on a dead card whose download would error.
 *  Bare/relative paths count as NO media so dead cards get the failed-card
 *  treatment (note + disabled actions) while Delete stays enabled. */
/** Resolve the Operations QUEUE a card belongs to (video | edit | faceless |
 *  design), from the RICHEST classification signal available on the merged
 *  card — NOT just the top-level `type`.
 *
 *  Why it can't rely on `item.type`: `mergeApproval` spreads the media card
 *  last, so a card that is semantically FACELESS (approval type 'faceless',
 *  payload.category 'faceless-video') can carry top-level type 'video' after
 *  it merges onto the video-project/media row it points at (owner's live
 *  Faceless test, Sep 21 — the video landed in the general Videos box instead
 *  of the Faceless box for exactly this reason).
 *
 *  Priority: payload.category → payload.mode → top-level type. Neural Twin is
 *  classified as 'faceless' (owner Sep 18: Twin = faceless engine, GPT Image 2
 *  + FFmpeg pan/zoom — same product family; the Faceless box count already
 *  falls back to the twin count). Scene-based videos stay 'video' (the Videos
 *  box is where scene/variant renders live). */
export const cardQueueType = (card: any): string => {
  const payload = card?.payload || {};
  const category = String(payload.category || '').toLowerCase();
  const mode = String(payload.mode || '').toLowerCase();
  const type = String(card?.type || payload.type || '').toLowerCase();
  // Faceless: category 'faceless-video', mode 'faceless', or type faceless.
  if (category.includes('faceless') || mode === 'faceless' || type === 'faceless') return 'faceless';
  // Neural Twin → Faceless box (faceless engine family, per locked cost model).
  if (type === 'neural_twin' || type === 'twin') return 'faceless';
  // Edits: category or type edit-ish.
  if (category.includes('edit') || type === 'edit' || type === 'video_edit' || type === 'raw_video') return 'edit';
  // Designs.
  if (category.includes('design') || type === 'design') return 'design';
  // Everything else video-like (scene, enhanced_video, generic video).
  return 'video';
};
export const isUsableMediaUrl = (url: unknown): boolean =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

/** Merge an asset card and a project card that describe the SAME media row.
 *  The video-projects card is the source of truth (freshly regenerated R2
 *  signed URL) so its payload wins; the asset card fills any missing fields. */
const mergeMediaCards = (asset: any, project: any): DispatchCard => ({
  ...asset,
  ...project,
  payload: { ...(asset.payload || {}), ...(project.payload || {}) },
});

/** Merge an approval onto the media card it references. The approval's OWN uuid
 *  must remain the card id — Save (`approvalId`), Feedback and Delete all
 *  address the approval row. The media row id stays in payload.assetId so
 *  download/delete resolve the actual creation/project row. Media payload wins
 *  on conflicts (fresh URL/status); approval payload fills the gaps (saved,
 *  qc, description, mode, …). */
const mergeApproval = (media: any, approval: any): DispatchCard => {
  const mediaId = String(media?.id || media?.payload?.assetId || '');
  return {
    ...approval,
    ...media,
    // The approval uuid is what Save/Feedback/Delete address — keep it as the
    // card id even though the media card's other fields win.
    id: String(approval?.id || media?.id || ''),
    _source: 'approval',
    payload: {
      // approval payload fills gaps (saved, qc, description, mode, …); the media
      // card's payload wins on conflicts (fresh URL, live status).
      ...(approval.payload || {}),
      ...(media.payload || {}),
      assetId: mediaId || approval?.payload?.assetId || String(approval?.id || ''),
    },
  };
};

/** Merge the four Operations card sources into ONE card per unique media row. */
export function mergeDispatchCards(
  approvals: any[],
  assetItems: any[],
  projectItems: any[],
  localItems: any[],
): DispatchCard[] {
  const byMedia = new Map<string, DispatchCard>();
  const liveIds = new Set<string>();

  // 1) Assets — creations (+ the scene projects /assets already embeds).
  for (const a of assetItems) {
    if (!a?.id) continue;
    const k = String(a.id);
    liveIds.add(k);
    byMedia.set(k, { ...a, _source: 'asset' });
  }

  // 2) Projects — video-projects is the source of truth for the same row id.
  for (const p of projectItems) {
    if (!p?.id) continue;
    const k = String(p.id);
    liveIds.add(k);
    const existing = byMedia.get(k);
    byMedia.set(
      k,
      existing
        ? mergeMediaCards(existing, { ...p, _source: 'project' })
        : { ...p, _source: 'project' },
    );
  }

  // 3) localStorage fast path — only when the backend had no row for the id
  //    (a stale signed URL must never shadow the freshly regenerated one).
  for (const l of localItems) {
    if (!l?.id) continue;
    const k = String(l.id);
    liveIds.add(k);
    if (!byMedia.has(k)) byMedia.set(k, { ...l, _source: 'local' });
  }

  // Ghost approvals carry a payload.assetId that resolves to NO live creation or
  // project row (their media generation was deleted / re-created). They render as
  // dead cards whose download/delete would 404. Drop completed-Video ghosts only.
  // Fail open when the live universe never loaded (both media fetches failed) so
  // a network error can never wipe the queue by mis-classifying every approval.
  const liveLoaded = assetItems.length > 0 || projectItems.length > 0;

  // 4) Approvals — link back to their media row via canonical payload id.
  for (let i = 0; i < approvals.length; i++) {
    const ap = approvals[i];
    // An approval always has an id from the API; fall back to a stable index key
    // only so a malformed item can never collide on an empty string key.
    const key = canonicalMediaId(ap) || `approval-index-${i}`;
    const existing = byMedia.get(key);
    if (existing) {
      byMedia.set(key, mergeApproval(existing, ap));
      continue;
    }
    const hasLink = !!(ap?.payload?.assetId || ap?.payload?.projectId);
    if (liveLoaded && hasLink && isVideoLike(ap) && isCompleted(ap)) {
      // Stale completed-video approval with no live backing row → drop.
      continue;
    }
    byMedia.set(key, { ...ap, _source: 'approval' });
  }

  return [...byMedia.values()];
}