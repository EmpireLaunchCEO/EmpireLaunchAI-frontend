"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Diamond,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
  Zap,
  Trash2,
  AlertTriangle,
  X,
  ChevronRight
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
  /** List of user empires for cancellation selection */
  userEmpires?: any[];
  /** Callback for cancellation */
  onCancelSubscription?: (empireId: string) => void;
  className?: string;
}

export function SubscriptionSuccessShareBox({
  isProtocolAccepted,
  onAcceptProtocol,
  totalRevenue = 0,
  totalFees = 0,
  businessSlots = 1,
  userEmpires = [],
  onCancelSubscription,
  className,
}: SubscriptionSuccessShareBoxProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelClick = (empireId: string) => {
    if (confirm(`Are you sure you want to cancel the subscription for this business? You will lose access to all workstations and autonomous features for this slot at the end of the billing period.`)) {
      setIsCancelling(true);
      if (onCancelSubscription) {
        onCancelSubscription(empireId);
      }
      // Mock completion
      setTimeout(() => {
        setIsCancelling(false);
        setShowCancelModal(false);
      }, 1000);
    }
  };

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
              <h4 className="text-2xl font-black text-foreground">$40.00<span className="text-xs text-muted-foreground font-bold italic">/mo</span></h4>
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">$40 one-time unlock + $40/mo per additional empire.</p>
            </div>
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

        {/* Cancel Subscription Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full py-4 text-red-500/60 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all border-2 border-theme hover:border-red-500/30 rounded-2xl flex items-center justify-center gap-2 group"
          >
            <Trash2 className="w-4 h-4 group-hover:animate-pulse" />
            Cancel Empire Subscription
          </button>
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

      {/* Cancellation Selection Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-theme-surface border-2 border-red-500/20 rounded-[40px] p-8 shadow-2xl space-y-8"
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight uppercase italic">Cancel Subscription</h3>
                  <p className="text-sm text-muted-foreground font-medium">Select the business subscription you wish to terminate.</p>
                </div>
              </div>

              <div className="space-y-4">
                {(userEmpires.length > 0 ? userEmpires : [{ id: '1', name: 'Home Base (Business 1)' }]).map((empire, i) => (
                  <button
                    key={empire.id}
                    onClick={() => handleCancelClick(empire.id)}
                    disabled={isCancelling}
                    className="w-full p-6 bg-theme-background border-2 border-theme hover:border-red-500/40 rounded-3xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-red-500/20 group-hover:text-red-500">
                        {i + 1}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-foreground uppercase tracking-tight group-hover:text-red-500 transition-colors">{empire.name || `Business ${i + 1}`}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{i === 0 ? 'Base Subscription' : 'Expansion Slot'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                <p className="text-[10px] text-red-400/80 italic leading-relaxed font-medium">
                  Note: Cancellation stops future billing for the selected slot. You will maintain access until the end of your current period. Unsaved data or AI models may be purged after expiration.
                </p>
              </div>

              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
