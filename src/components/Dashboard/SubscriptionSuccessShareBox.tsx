"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Diamond,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  TrendingUp,
  ChevronRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionSuccessShareBoxProps {
  /** Whether the protocol has been accepted */
  isProtocolAccepted: boolean;
  /** Callback to accept the protocol */
  onAcceptProtocol?: () => void;
  /** Total revenue to display (optional) */
  totalRevenue?: number;
  /** Total success-share fees accrued (optional) */
  totalFees?: number;
  /** Number of business slots (optional) */
  businessSlots?: number;
  className?: string;
}

export function SubscriptionSuccessShareBox({
  isProtocolAccepted,
  onAcceptProtocol,
  totalRevenue = 12450,
  totalFees = 498,
  businessSlots = 1,
  className,
}: SubscriptionSuccessShareBoxProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAudit = async () => {
    setIsDownloading(true);
    // Simulate generating and downloading an audit report
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock CSV/audit content
    const auditContent = [
      'EmpireLaunch AI - Success-Share Audit Report',
      `Generated: ${new Date().toLocaleDateString()}`,
      '========================================',
      '',
      'Base Subscription: $40/month',
      `Business Slots Active: ${businessSlots}`,
      `Expansion Fees: $${(businessSlots - 1) * 40}/month`,
      '',
      'Revenue Summary:',
      `Total Revenue: $${totalRevenue.toLocaleString()}.00`,
      `Success-Share Rate: 4% ($40 per $1,000)`,
      `Total Success-Shares Accrued: $${totalFees.toLocaleString()}.00`,
      `Net Revenue After Shares: $${(totalRevenue - totalFees).toLocaleString()}.00`,
      '',
      'Transaction History:',
      '----------------------------------------',
      'Date | Amount | Type | Status',
      `${new Date().toLocaleDateString()} | $40.00 | Base Subscription | Active`,
    ].join('\n');

    const blob = new Blob([auditContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `empire-success-shares-audit-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  return (
    <div className={cn(
      'bg-primary/5 border-2 border-primary/30 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -ml-24 -mb-24 pointer-events-none" />

      <div className="p-6 md:p-10 space-y-8 relative z-10">
        {/* Header — Unified Title */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center border border-primary/20 shrink-0">
            <Diamond className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight italic">
              Empire Subscription & Success-Shares
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Unified partnership model — transparent fees, automatic growth.
            </p>
          </div>
          {/* Protocol Status Badge */}
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest shrink-0',
            isProtocolAccepted
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          )}>
            {isProtocolAccepted ? (
              <><CheckCircle2 className="w-3 h-3" /> Protocol Active</>
            ) : (
              <><AlertCircle className="w-3 h-3" /> Awaiting Acceptance</>
            )}
          </div>
        </div>

        {/* Protocol Agreement Section — shown if not accepted */}
        {!isProtocolAccepted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-[24px] space-y-4"
          >
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "To keep Empire AI accessible from day one, we use a <span className="text-primary font-bold">Success-Share model</span>. 
              A simple <span className="text-foreground font-bold">$40 fee</span> applies for every <span className="text-foreground font-bold">$1,000</span> 
              you earn from content created through this app. Accept the protocol below to unlock platform linking and autonomous operations."
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20 w-fit">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">$40 / $1k Milestone Protocol</span>
            </div>
            <button
              onClick={onAcceptProtocol}
              className="px-8 py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              I Accept These Terms
            </button>
          </motion.div>
        )}

        {/* Subscription & Success-Share Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Subscription */}
          <div className="p-5 md:p-6 rounded-[24px] bg-theme-background border border-theme space-y-3 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Diamond className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Base Subscription</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-foreground">$40<span className="text-sm font-bold text-muted-foreground">/mo</span></p>
            <p className="text-[10px] text-muted-foreground font-medium">Full access to AI-driven business scaling, automations, and multi-tenant infrastructure.</p>
          </div>

          {/* Expansion Slots */}
          <div className="p-5 md:p-6 rounded-[24px] bg-theme-background border border-theme space-y-3 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-purple-400">Expansion Slots</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-foreground">$40<span className="text-sm font-bold text-muted-foreground"> + $40/mo</span></p>
            <p className="text-[10px] text-muted-foreground font-medium">Per additional business slot. One-time unlock + monthly recurring per slot.</p>
          </div>

          {/* Success-Share Fee */}
          <div className="p-5 md:p-6 rounded-[24px] bg-theme-background border border-theme space-y-3 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Success-Share</p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-foreground">4%<span className="text-sm font-bold text-muted-foreground"> / revenue</span></p>
            <p className="text-[10px] text-muted-foreground font-medium">$40 per $1,000 earned. Only on revenue generated through EmpireLaunch AI content.</p>
          </div>
        </div>

        {/* Summary section - shows after acceptance */}
        {isProtocolAccepted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-theme-background border border-theme rounded-[24px] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Protocol Active — $40/$1k Rate Locked</span>
              </div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted-foreground">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {businessSlots} slot{businessSlots !== 1 ? 's' : ''} active
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue Tracked</p>
                <p className="text-2xl font-black text-foreground">${totalRevenue.toLocaleString()}.00</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Success-Shares Accrued</p>
                <p className="text-2xl font-black text-primary">${totalFees.toLocaleString()}.00</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Download Shares Audit Button */}
        <div className="pt-2">
          <button
            onClick={handleDownloadAudit}
            disabled={isDownloading}
            className={cn(
              'w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg',
              isDownloading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-primary text-slate-950 hover:bg-white active:scale-[0.98]'
            )}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                Generating Audit Report...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Download Shares Audit
                <Download className="w-4 h-4 opacity-70" />
              </>
            )}
          </button>
          <p className="text-[8px] text-center text-muted-foreground/60 font-bold uppercase tracking-widest mt-2">
            Detailed success-share transaction log for your records
          </p>
        </div>
      </div>
    </div>
  );
}