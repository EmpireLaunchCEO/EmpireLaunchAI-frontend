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
  FileText,
  Zap,
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
  totalRevenue = 0,
  totalFees = 0,
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
      `Expansion Fees: ${(businessSlots - 1) * 40}/month`,
      '',
      'Revenue Summary:',
      `Total Revenue: ${totalRevenue.toLocaleString()}.00`,
      `Success-Share Rate: 4% ($40 per $1,000)`,
      `Total Success-Shares Accrued: ${totalFees.toLocaleString()}.00`,
      `Net Revenue After Shares: ${(totalRevenue - totalFees).toLocaleString()}.00`,
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
      'bg-theme-surface rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -ml-24 -mb-24 pointer-events-none" />

      <div className="p-6 md:p-10 space-y-8 relative z-10">
        {/* Header — Unified Title */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 shrink-0">
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
              <><CheckCircle2 className="w-3 h-3" /> Approved</>
            ) : (
              <><AlertCircle className="w-3 h-3" /> Pending</>
            )}
          </div>
        </div>

        {/* Subscription Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Subscription Box */}
          <div className="p-6 bg-theme-background border border-theme rounded-[24px] space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Subscription</span>
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black text-foreground">$40.00<span className="text-xs text-muted-foreground font-bold italic">/mo</span></h4>
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">All workstations + Global DNA harvesting active.</p>
            </div>
          </div>

          {/* Expansion Subscription Box */}
          <div className="p-6 bg-theme-background border border-theme rounded-[24px] space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expansion Slots</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{businessSlots - 1} Slot{businessSlots - 1 !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black text-foreground">${((businessSlots - 1) * 40).toFixed(2)}<span className="text-xs text-muted-foreground font-bold italic">/mo</span></h4>
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">$40 one-time unlock + $40/mo per additional empire.</p>
            </div>
            {businessSlots < 3 && (
               <button 
                onClick={async () => {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/checkout/expansion`, {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        'x-user-id': localStorage.getItem('empire_user_id') || ''
                      },
                      body: JSON.stringify({ returnUrl: window.location.origin + '/financial-command' })
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch (e) {
                    console.error('Expansion checkout failed', e);
                  }
                }}
                className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all"
               >
                 Unlock New Slot ($40)
               </button>
            )}
          </div>
        </div>

        {/* Total Monthly Subscription Section */}
        <div className="p-6 bg-theme-background border-2 border-primary/20 rounded-[24px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Monthly Subscription</p>
                <h4 className="text-xl font-black text-foreground">${(businessSlots * 40).toFixed(2)}<span className="text-xs text-muted-foreground font-bold italic">/mo</span></h4>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-primary uppercase tracking-widest italic">Partner Rate Locked</p>
          </div>
        </div>

        {/* Summary section - shows after acceptance */}
        {isProtocolAccepted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-theme-background border-2 border-emerald-500/20 rounded-[24px] space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Approved — $40/$1k Rate Locked</span>
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
                ? 'bg-theme-surface text-primary/40 cursor-not-allowed'
                : 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]'
            )}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
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

        {/* Protocol Disclosure Section — shown at the very bottom */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className={cn("w-4 h-4", isProtocolAccepted ? "text-emerald-400" : "text-amber-400")} />
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Partner Protocol Agreement</p>
          </div>
          
          <div className="p-5 rounded-2xl bg-theme-background/50 border border-theme/30">
            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
              "A simple $40 Success-Share is applied for every $1,000 you earn solely from the videos, posts, and designs created through this app. Additionally, choosing Auto-Pilot authorizes the Empire AI to sync with existing store and social accounts to create and deploy content on your behalf."
            </p>
            
            {!isProtocolAccepted && (
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <DollarSign className="w-3 h-3 text-amber-400" />
                  <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">$40 / $1k Milestone Protocol</span>
                </div>
                <button
                  onClick={onAcceptProtocol}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/10"
                >
                  I Accept Terms
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
