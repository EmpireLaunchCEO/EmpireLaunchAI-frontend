"use client";

/**
 * /rep — the sales-rep panel.
 *
 * Identity is the real session: every request here carries the Bearer token the
 * backend issued (authFetch), never a typed id. A rep sees their own link and
 * their own numbers from GET /api/rep/me; the owner additionally gets
 * GET /api/rep/summary and the two owner-only controls (mark as paid, make a
 * rep). Nothing on this page moves money — "Mark as paid" only records that the
 * owner has sent it.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, DollarSign, Link2, ShieldCheck, UserPlus, Users } from "lucide-react";
import { API_URL } from "@/lib/config";
import { authFetch } from "@/lib/authToken";
import { BrandedGlobe } from "@/components/BrandedGlobe";

type RepStats = {
  repUserId: string;
  code: string | null;
  link: string | null;
  signups: number;
  payingClients: number;
  owedCents: number;
  paidCents: number;
  name?: string | null;
  email?: string | null;
};

type RepSummary = {
  reps: RepStats[];
  totals: { reps: number; signups: number; payingClients: number; owedCents: number; paidCents: number };
};

const money = (cents: number | undefined) => `$${(Number(cents ?? 0) / 100).toFixed(2)}`;

/** The UTC calendar month the backend stamps on a commission: `YYYY-MM`. */
const currentPeriod = () => new Date().toISOString().slice(0, 7);

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-[92px]">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className={accent ? "text-xl font-black text-primary" : "text-xl font-black text-foreground"}>{value}</p>
    </div>
  );
}

function LinkBox({ link }: { link: string | null }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!link) {
    return (
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
        No link yet
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="flex items-center gap-2 text-xs font-bold text-foreground break-all">
        <Link2 className="w-4 h-4 text-primary shrink-0" />
        {link}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-xl border border-white/10 transition-all hover:border-primary/50 hover:bg-black"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function RepPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<RepStats | null>(null);
  const [meNotice, setMeNotice] = useState<string | null>(null);
  const [summary, setSummary] = useState<RepSummary | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmPaidFor, setConfirmPaidFor] = useState<string | null>(null);

  const period = useMemo(currentPeriod, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await authFetch(`${API_URL}/api/rep/me`);
      if (meRes.ok) {
        setMe((await meRes.json()) as RepStats);
        setMeNotice(null);
      } else {
        setMe(null);
        setMeNotice(
          meRes.status === 403
            ? "This account is not a sales rep. Ask the owner for a rep link."
            : "Could not read your rep panel just now."
        );
      }

      // Owner-only. A 403 is expected for a rep or a client and simply hides
      // the owner section — the server, not the page, decides who the owner is.
      const sumRes = await authFetch(`${API_URL}/api/rep/summary`);
      setSummary(sumRes.ok ? ((await sumRes.json()) as RepSummary) : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markPaid = async (rep: RepStats) => {
    setBusy(`paid:${rep.repUserId}`);
    setNotice(null);
    try {
      const res = await authFetch(`${API_URL}/api/rep/mark-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repUserId: rep.repUserId, upToPeriod: period }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice(body?.error || "Could not record that payment.");
      } else if (!body?.updated) {
        setNotice(`Nothing unpaid for ${rep.name || rep.email || "that rep"} up to ${period}.`);
      } else {
        setNotice(`Recorded ${money(body.amountCents)} paid for ${rep.name || rep.email || "that rep"} (${period}).`);
      }
      await load();
    } finally {
      setBusy(null);
      setConfirmPaidFor(null);
    }
  };

  const makeRep = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setBusy("assign");
    setNotice(null);
    try {
      // The endpoint keys on the account id; the page is given an email, so a
      // known rep's id is resolved from the summary and both are sent.
      const known = summary?.reps.find(
        (rep) => String(rep.email || "").toLowerCase() === value.toLowerCase()
      );
      const res = await authFetch(`${API_URL}/api/rep/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(known ? { userId: known.repUserId } : {}),
          email: value,
          role: "sales_rep",
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice(body?.error || "Could not make that account a rep.");
      } else {
        setNotice(`${value} is now a sales rep.`);
        setEmail("");
        await load();
      }
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <BrandedGlobe size="lg" spinning />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Reading rep numbers
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="bg-theme-surface rounded-[40px] border border-theme overflow-hidden">
        <div className="p-8 border-b border-theme flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground italic uppercase tracking-tight">Sales Reps</h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
              $1 per paying client, per month · period {period}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Reps" value={String(summary?.totals.reps ?? (me ? 1 : 0))} />
            <Stat label="Signups" value={String(summary?.totals.signups ?? me?.signups ?? 0)} />
            <Stat
              label="Paying clients"
              value={String(summary?.totals.payingClients ?? me?.payingClients ?? 0)}
            />
            <Stat
              label="Owed"
              value={money(summary?.totals.owedCents ?? me?.owedCents)}
              accent
            />
            <Stat label="Paid" value={money(summary?.totals.paidCents ?? me?.paidCents)} />
          </div>
        </div>

        {notice && (
          <p className="px-8 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-theme">
            {notice}
          </p>
        )}

        {!summary && !me && (
          <p className="p-8 text-sm text-muted-foreground">{meNotice || "Nothing to show yet."}</p>
        )}

        {/* A rep's own panel */}
        {!summary && me && (
          <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Your link</p>
                <p className="text-sm font-bold text-foreground">{me.name || me.email || "Your account"}</p>
              </div>
              <div className="flex items-center gap-6">
                <Stat label="Signups" value={String(me.signups)} />
                <Stat label="Paying clients" value={String(me.payingClients)} />
                <Stat label="Owed" value={money(me.owedCents)} accent />
                <Stat label="Paid" value={money(me.paidCents)} />
              </div>
            </div>
            <LinkBox link={me.link} />
          </div>
        )}

        {/* Owner view */}
        {summary && (
          <div className="divide-y divide-white/5">
            <form onSubmit={makeRep} className="p-8 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 block">
                  Make a rep — by email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="rep@example.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
              </div>
              <button
                type="submit"
                disabled={busy === "assign"}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 rounded-2xl border border-white/10 transition-all hover:border-primary/50 hover:bg-black disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 text-primary" />
                {busy === "assign" ? "Saving" : "Make a rep"}
              </button>
            </form>

            {summary.reps.length === 0 && (
              <p className="p-8 text-sm text-muted-foreground">
                No sales reps yet. Add one by email above — their link appears here.
              </p>
            )}

            {summary.reps.map((rep) => (
              <div key={rep.repUserId} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 min-w-0">
                  <div>
                    <p className="text-sm font-bold text-foreground">{rep.name || "Unnamed rep"}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {rep.email || "no email on file"}
                    </p>
                  </div>
                  <LinkBox link={rep.link} />
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <Stat label="Signups" value={String(rep.signups)} />
                  <Stat label="Paying clients" value={String(rep.payingClients)} />
                  <Stat label="Owed" value={money(rep.owedCents)} accent />
                  <Stat label="Paid" value={money(rep.paidCents)} />

                  {confirmPaidFor === rep.repUserId ? (
                    <button
                      type="button"
                      onClick={() => void markPaid(rep)}
                      disabled={busy === `paid:${rep.repUserId}`}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-5 py-3 rounded-2xl border border-white/10 transition-all hover:border-primary/50 hover:bg-black disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      Confirm {money(rep.owedCents)}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmPaidFor(rep.repUserId)}
                      disabled={rep.owedCents <= 0}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-5 py-3 rounded-2xl border border-white/10 transition-all hover:border-primary/50 hover:bg-black disabled:opacity-40"
                    >
                      <DollarSign className="w-4 h-4 text-primary" />
                      Mark as paid
                    </button>
                  )}
                </div>
              </div>
            ))}

            <p className="p-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Marking as paid only records that you sent it — no money moves here.
            </p>
          </div>
        )}
      </div>

      {!summary && me && (
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Share your link — a signup is counted the moment they join.
        </p>
      )}
    </div>
  );
}
