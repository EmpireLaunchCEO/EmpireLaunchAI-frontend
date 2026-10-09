/**
 * Unit tests for mergeDispatchCards ghost-card dropping (part B of the
 * ghost-delete fix, backend PR #107). The regression: the owner deleted ALL
 * her faceless videos → the live universe (assets + projects) was EMPTY →
 * old `liveLoaded = assetItems.length>0 || projectItems.length>0` was false →
 * fail-open → every stale approval rendered as a resurrected ghost card
 * (16 ghosts from 4 deletions). The fix adds a `liveConfirmed` flag from the
 * caller, set ONLY when a live fetch actually returned HTTP ok; ghost-dropping
 * then runs even on an empty-but-confirmed universe, while network errors
 * (fetch threw / non-ok) still fail open and never wipe the queue.
 *
 * Run with the backend's tsx (frontend has no runner installed):
 *   cd /home/team/shared/EmpireLaunchAI-backend && npx tsx --test \
 *     /home/team/shared/EmpireLaunchAI-frontend/src/lib/dispatchMerge.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeDispatchCards } from './dispatchMerge';

// ── fixtures (mirror prod shapes) ────────────────────────────────────────────
const ghostApproval = {
  id: 'ap-ghost-1',
  type: 'faceless',
  status: 'completed',
  payload: {
    assetId: 'deleted-row-1', // resolves to NO live creation/project row
    projectId: 'deleted-project-1',
    category: 'faceless-video',
    status: 'completed',
  },
};
const liveApproval = {
  id: 'ap-live-1',
  type: 'faceless',
  status: 'completed',
  payload: {
    assetId: 'creation-1',
    category: 'faceless-video',
    status: 'completed',
  },
};
const liveAsset = {
  id: 'creation-1',
  type: 'faceless',
  status: 'completed',
  payload: {
    title: 'Live Faceless Video',
    videoUrl: 'https://media.example/final.mp4',
    assetId: 'creation-1',
    status: 'completed',
  },
};
const liveProject = {
  id: 'proj-1',
  type: 'video',
  status: 'completed',
  payload: {
    title: 'Scene Project',
    videoUrl: 'https://media.example/scene.mp4',
    assetId: 'proj-1',
    status: 'completed',
    mode: 'scene',
  },
};

const ids = (cards: any[]) => cards.map((c) => String(c.id));

test('non-empty confirmed live + stale approval → stale dropped', () => {
  const cards = mergeDispatchCards(
    [ghostApproval, liveApproval],
    [liveAsset],
    [],
    [],
    true,
  );
  assert.ok(!ids(cards).includes('ap-ghost-1'), 'ghost approval must be dropped');
  assert.ok(ids(cards).includes('ap-live-1'), 'live-linked approval must survive');
});

test('empty-but-confirmed live + stale approval → stale dropped (THE FIX)', () => {
  // Owner deleted ALL videos: both live fetches succeeded (ok) but returned
  // zero items. liveConfirmed=true must still drop the stale ghost.
  const cards = mergeDispatchCards([ghostApproval], [], [], [], true);
  assert.deepEqual(ids(cards), [], 'empty confirmed universe must NOT resurrect ghosts');
});

test('network-error live + stale approval → fail-open, stale kept', () => {
  // Both live fetches threw (offline/timeout): caller cannot distinguish a
  // stale approval from a fresh one — keep it so the queue is never wiped.
  const cards = mergeDispatchCards([ghostApproval], [], [], [], false);
  assert.ok(ids(cards).includes('ap-ghost-1'), 'fail-open must keep the approval');
});

test('network-error legacy call (no flag) + stale approval → fail-open, stale kept', () => {
  const cards = mergeDispatchCards([ghostApproval], [], [], []);
  assert.ok(ids(cards).includes('ap-ghost-1'), 'legacy fail-open must keep the approval');
});

test('empty confirmed live + no approvals → empty state', () => {
  const cards = mergeDispatchCards([], [], [], [], true);
  assert.deepEqual(cards, [], 'genuinely empty universe yields no cards');
});

test('empty unconfirmed live + no approvals → empty state', () => {
  const cards = mergeDispatchCards([], [], [], [], false);
  assert.deepEqual(cards, [], 'empty + unconfirmed + no approvals yields nothing');
});

test('legacy caller with non-empty live arrays still drops stale approval', () => {
  // Old 4-arg call: non-empty arrays imply liveness — same drop as before.
  const cards = mergeDispatchCards([ghostApproval], [liveAsset], [], []);
  assert.ok(!ids(cards).includes('ap-ghost-1'), 'ghost dropped via length heuristic');
});

test('live approval merges onto its asset card (one card, approval id wins)', () => {
  const cards = mergeDispatchCards([liveApproval], [liveAsset], [], [], true);
  assert.equal(cards.length, 1, 'live asset + its approval = ONE card');
  assert.equal(cards[0].id, 'ap-live-1', 'approval uuid stays the card id (Save/Delete)');
  assert.equal(cards[0].payload.assetId, 'creation-1', 'media row id preserved');
  assert.equal(cards[0]._source, 'approval');
});

test('project routing preserved: live project + its approval merge with mode intact', () => {
  const apForProj = {
    ...liveApproval,
    id: 'ap-proj-1',
    payload: { ...liveApproval.payload, assetId: 'proj-1', projectId: 'proj-1' },
  };
  const cards = mergeDispatchCards([apForProj], [liveAsset], [liveProject], [], true);
  const projCard = cards.find((c) => c.id === 'ap-proj-1');
  assert.ok(projCard, 'project-linked approval survives');
  assert.equal(projCard.payload.mode, 'scene', 'faceless/scene routing data intact');
  assert.equal(projCard.payload.videoUrl, 'https://media.example/scene.mp4', 'fresh URL wins');
});