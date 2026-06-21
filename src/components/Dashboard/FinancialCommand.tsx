"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp, Calendar, CreditCard, AppWindow, Cpu, Zap, Activity, Minus, Maximize2, Stars } from 'lucide-react';
import { cn } from '@/lib/utils';
import { infrastructureService, InfrastructureBalance } from '@/lib/api-service';
import { useEmpire } from '@/lib/EmpireContext';

import { SubscriptionSuccessShareBox } from './SubscriptionSuccessShareBox';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
  onActivateGrowthProtocol?: (name: string) => void;
  isProtocolAccepted?: boolean;
  onAcceptProtocol?: () => void;
  businessSlots?: number;
  userEmpires?: any[];
  onCancelSubscription?: (empireId: string) => void;
}

export function FinancialCommand({ 
  withholdableEarnings = 0, 
  securedDues = 0, 
  growthScore = 0,
  businessId = "1",
  onActivateGrowthProtocol,
  isProtocolAccepted = false,
  onAcceptProtocol,
  businessSlots = 1,
  userEmpires = [],
  onCancelSubscription
}: Partial<FinancialCommandProps>) {
  const [infraBalances, setInfraBalances] = useState<InfrastructureBalance[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    setMounted(true);

    const loadInfra = async () => {
      const bals = await infrastructureService.getBalances();
      setInfraBalances(bals);
    };
    loadInfra();
  }, []);

  const handleDownloadAudit = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const revenueCents = withholdableEarnings;
      const shareCents = Math.floor(revenueCents * 0.04);
      
      const auditContent = `EMPIRELAUNCH AI - SUCCESS-SHARE AUDIT\nGenerated: ${new Date().toLocaleString()}\n\nBusiness Tracking:\n- Content Generated: 0 Assets\n- Marketing Campaigns: 0\n- Revenue Attributed to AI: ${(revenueCents / 100).toFixed(2)}\n- Success-Share Rate: 4% (40/1k)\n- Success-Share Due: ${(shareCents / 100).toFixed(2)}\n\nAll tracking verified via Neural Sync.`;
      const blob = new Blob([auditContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Empire_Success_Audit_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsDownloading(false);
    }, 1000);
  };

  if (!mounted) return null;

  const formatCurrency = (cents: number) => {
    return `${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const { connectedPlatforms } = useEmpire();

  const subscriptions = [
    { name: "Empire Subscription", amount: 4000, date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), type: "app" },
    { name: "Success-Shares (40/1k Protocol)", amount: 0, date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), type: "app", successShare: "40/1k" },
  ];

  const dues: any[] = [];
  
  if (connectedPlatforms.includes('Etsy')) {
    dues.push({ 
      name: "Etsy Listing Fees", 
      amount: securedDues || 0, 
      date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) 
    });
  }

  return (
    <div className="bg-theme-surface rounded-[20px] p-3 md:p-4 text-foreground relative overflow-hidden shadow-xl border-2 border-theme max-w-4xl mx-auto">
      {/* Name at the Top */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
          <CreditCard className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic leading-tight">Empire Finances</h3>
      </div>

      <div className="relative z-10 space-y-3">
        
        {/* Top Header: Bucket Visuals - COMPACTED */}
        <div className="flex gap-3 items-center border-b border-theme/30 pb-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100/10" strokeWidth="15" />
              <motion.circle
                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-primary" strokeWidth="15"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - 0.75) }}
                strokeLinecap="round"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black">{growthScore}%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-2">
              <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[8px] font-black text-primary uppercase">Revenue: {formatCurrency(withholdableEarnings)}</span>
              </div>
              <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-[8px] font-black text-emerald-500 uppercase">Efficiency: High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Monitor */}
        {infraBalances.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
              <Cpu className="w-3 h-3" />
              System Infrastructure Balances
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {infraBalances.map((item, i) => (
                <div key={i} className="p-3 bg-theme-background border border-theme rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] font-black uppercase text-muted-foreground">{item.platform}</span>
                    {item.status === 'low' && <Zap className="w-3 h-3 text-amber-500 animate-pulse" />}
                  </div>
                  <p className={cn(
                    "text-base font-black tracking-tighter italic",
                    item.status === 'low' ? "text-amber-500" : "text-foreground"
                  )}>
                    ${item.balance.toFixed(2)}
                  </p>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", item.status === 'low' ? "bg-amber-500" : "bg-primary")} 
                      style={{ width: `${Math.min(100, (item.balance / 50) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown Sections */}
        <div className="flex flex-col gap-8">
          
          {/* Subscriptions Section - Using Dedicated Subscription Component */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
              <CreditCard className="w-3 h-3" />
              Active Partner Subscriptions
            </div>
            <SubscriptionSuccessShareBox
              isProtocolAccepted={isProtocolAccepted}
              onAcceptProtocol={onAcceptProtocol}
              totalRevenue={withholdableEarnings}
              totalFees={securedDues}
              businessSlots={businessSlots}
              userEmpires={userEmpires}
              onCancelSubscription={onCancelSubscription}
              className="border-2 border-primary/20 shadow-none !rounded-[24px]"
            />
          </div>

          {/* Dues Section */}
          {dues.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-black text-[9px] uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Marketplace Dues
              </div>
              <div className="space-y-2">
                {dues.map((due, i) => (
                  <div key={i} className="p-5 bg-theme-background border border-theme rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500">
                        <Bucket className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase italic leading-tight">{due.name}</p>
                        <div className="flex items-center gap-1 text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">
                          <Calendar className="w-2 h-2" /> {due.date}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-black italic text-amber-500">{formatCurrency(due.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
}
