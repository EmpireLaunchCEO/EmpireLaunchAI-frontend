"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp, Calendar, CreditCard, AppWindow, Shield, Cpu, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
}

export function FinancialCommand({ 
  withholdableEarnings = 0, 
  securedDues = 0, 
  growthScore = 0,
  businessId = "1"
}: Partial<FinancialCommandProps>) {
  const { isLinkingComplete } = useEmpire();
  
  // Calculate dynamic "Due in 30 days" date for Platform Fee
  const getPlatformDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Calculate dynamic "Dues" based on earnings: $40 per $1,000 earned
  const platformDuesAmount = Math.floor(withholdableEarnings / 100000) * 4000;

  const subscriptions = isLinkingComplete ? [
    { name: "Canva Pro", amount: 1299, date: "June 12, 2024", type: "business" },
    { name: "ChatGPT Plus", amount: 2000, date: "June 15, 2024", type: "business" },
    { name: "EmpireLaunch AI Subscription", amount: 4000, date: getPlatformDueDate(), type: "app" },
    { name: "EmpireLaunch AI Dues ($40/$1k)", amount: platformDuesAmount, date: "Calculated from Earnings", type: "app" },
  ] : [];

  const infrastructure = isLinkingComplete ? [
    { name: "Railway Hosting", amount: 540, status: "Live", icon: Activity },
    { name: "OpenAI Usage", amount: 1250, status: "Live", icon: Cpu },
    { name: "Gemini / Google AI", amount: 0, status: "Free Tier", icon: Zap },
  ] : [];

  const dues = isLinkingComplete ? [
    { name: "Etsy Listing Fees", amount: 0, date: "Syncing" },
    { name: "Fiverr Commission", amount: 0, date: "Syncing" },
  ] : [];

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 text-foreground relative overflow-hidden shadow-2xl border-2 border-theme">
      <div className="relative z-10 space-y-10">
        
        {/* Top Header: Bucket Visuals */}
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-theme/30 pb-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100/10" strokeWidth="12" />
              <motion.circle
                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-primary" strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - 0.75) }}
                strokeLinecap="round"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
              <span className="text-xl font-black">{growthScore}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-primary italic">Financial Command</h3>
            <p className="text-slate-400 text-xs font-medium italic">Monitoring capital velocity and upcoming obligations.</p>
            <div className="flex gap-4 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[10px] font-black text-primary uppercase">Available: {formatCurrency(withholdableEarnings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {!isLinkingComplete ? (
            <div className="md:col-span-2 py-20 bg-theme-background/50 rounded-[32px] border-2 border-dashed border-theme flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-slate-600" />
               </div>
               <div>
                  <h4 className="text-lg font-black uppercase tracking-tight italic">Financial Vault Locked</h4>
                  <p className="text-xs text-muted-foreground font-medium max-w-[280px] mx-auto mt-1">
                    Connect your Etsy, Fiverr, or Bank account to synchronize transaction history and active subscriptions.
                  </p>
               </div>
            </div>
          ) : (
            <>
              {/* Subscriptions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                  <CreditCard className="w-3 h-3" />
                  Active Subscriptions
                </div>
                <div className="space-y-3">
                  {subscriptions.map((sub, i) => (
                    <div key={i} className={cn(
                      "p-4 rounded-2xl border flex items-center justify-between transition-all",
                      sub.type === 'app' ? "bg-primary/5 border-primary/30" : "bg-theme-background border-theme"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sub.type === 'app' ? "bg-primary text-slate-950" : "bg-slate-800 text-slate-400")}>
                          {sub.type === 'app' ? <AppWindow className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase italic">{sub.name}</p>
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                            <Calendar className="w-2.5 h-2.5" /> {sub.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black italic">{formatCurrency(sub.amount)}</p>
                        {sub.type === 'app' && <span className="text-[8px] font-black text-primary uppercase">Platform Due</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-cyan-500 font-black text-[10px] uppercase tracking-widest">
                  <Activity className="w-3 h-3" />
                  Infrastructure & Intelligence
                </div>
                <div className="space-y-3">
                  {infrastructure.map((item, i) => (
                    <div key={i} className="p-4 bg-theme-background border border-theme rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-500">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase italic">{item.name}</p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{item.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black italic">{formatCurrency(item.amount)}</p>
                        <span className="text-[8px] font-black text-cyan-500 uppercase">Usage Cost</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dues Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Marketplace Dues
                </div>
                <div className="space-y-3">
                  {dues.map((due, i) => (
                    <div key={i} className="p-4 bg-theme-background border border-theme rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-500">
                          <Bucket className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase italic">{due.name}</p>
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                            <Calendar className="w-2.5 h-2.5" /> {due.date}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-black italic text-amber-500">{formatCurrency(due.amount)}</p>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-4 border-t border-theme/30">
                    <button className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Settle All Dues
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
}
