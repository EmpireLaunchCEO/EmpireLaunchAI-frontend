"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp, Calendar, CreditCard, AppWindow, Cpu, Zap, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { infrastructureService, InfrastructureBalance } from '@/lib/api-service';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
  onActivateGrowthProtocol?: (name: string) => void;
}

export function FinancialCommand({ 
  withholdableEarnings = 0, 
  securedDues = 0, 
  growthScore = 0,
  businessId = "1",
  onActivateGrowthProtocol
}: Partial<FinancialCommandProps>) {
  const [infraBalances, setInfraBalances] = useState<InfrastructureBalance[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  const loadInfra = async () => {
      const bals = await infrastructureService.getBalances();
      setInfraBalances(bals);
    };
    loadInfra();
  }, []);

  if (!mounted) return null;

  const formatCurrency = (cents: number) => {
    return `${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const { connectedPlatforms } = useEmpire();

  const subscriptions = [
    { name: "Empire Subscription", amount: 4000, date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), type: "app" },
  ];

  // Connected subscription platform costs — only shows if user has platform linked
  const platformSubscriptions: Record<string, { name: string; cost: number }> = {
    canva: { name: 'Canva Pro', cost: 1299 },
    kittl: { name: 'Kittl Pro', cost: 1500 },
    capcut: { name: 'CapCut Pro', cost: 799 },
    figma: { name: 'Figma Professional', cost: 1200 },
    shopify: { name: 'Shopify Basic', cost: 2900 },
    squarespace: { name: 'Squarespace Personal', cost: 1600 },
    wix: { name: 'Wix Combo', cost: 1600 },
    godaddy: { name: 'GoDaddy Business', cost: 1499 },
    systeme_io: { name: 'Systeme.io Starter', cost: 2700 },
    substack: { name: 'Substack Pro', cost: 1000 },
    linkedin: { name: 'LinkedIn Premium', cost: 2999 },
    patreon: { name: 'Patreon Creator', cost: 599 },
    shipstation: { name: 'ShipStation Starter', cost: 999 },
    spocket: { name: 'Spocket Starter', cost: 2499 },
    zendrop: { name: 'Zendrop Pro', cost: 1999 },
    autods: { name: 'AutoDS Starter', cost: 1990 },
    bannerbear: { name: 'Bannerbear Pro', cost: 900 },
    amazon: { name: 'Amazon Seller', cost: 3999 },
    ebay: { name: 'eBay Store', cost: 2199 },
    gumroad: { name: 'Gumroad Premium', cost: 999 },
    printful: { name: 'Printful Growth', cost: 999 },
    printify: { name: 'Printify Premium', cost: 2499 },
  };

  if (connectedPlatforms) {
    Object.entries(platformSubscriptions).forEach(([id, info]) => {
      if (connectedPlatforms.includes(id)) {
        subscriptions.push({
          name: info.name,
          amount: info.cost,
          date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
          type: "app"
        });
      }
    });
  }

  const dues: any[] = [];
  
  if (connectedPlatforms.includes('Etsy')) {
    dues.push({ 
      name: "Etsy Listing Fees", 
      amount: securedDues || 0, 
      date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) 
    });
  }

  return (
    <div className="bg-theme-surface rounded-[32px] p-6 text-foreground relative overflow-hidden shadow-2xl border-2 border-theme">
      {/* Name at the Top */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
          <CreditCard className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-primary italic">Empire Finances</h3>
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Top Header: Bucket Visuals */}
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-theme/30 pb-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100/10" strokeWidth="12" />
              <motion.circle
                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-primary" strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - growthScore / 100) }}
                strokeLinecap="round"
                transition={{ duration: 0, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
              <span className="text-xl font-black">{growthScore}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 pr-12">
            <p className="text-slate-400 text-xs font-medium italic">Monitoring capital velocity and upcoming obligations.</p>
            <div className="flex gap-4 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[10px] font-black text-primary uppercase">Available: {formatCurrency(withholdableEarnings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Monitor */}
        {infraBalances.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
              <Cpu className="w-3 h-3" />
              System Infrastructure Balances
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {infraBalances.map((item, i) => (
                <div key={i} className="p-4 bg-theme-background border border-theme rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase text-muted-foreground">{item.platform}</span>
                    {item.status === 'low' && <Zap className="w-3 h-3 text-amber-500 animate-pulse" />}
                  </div>
                  <p className={cn(
                    "text-lg font-black tracking-tighter italic",
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
        <div className="flex flex-col gap-12">
          
          {/* Subscriptions Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
              <CreditCard className="w-3 h-3" />
              Active Subscriptions
            </div>
            <div className="space-y-3">
              <div className="p-6 rounded-[32px] border-2 border-primary/30 bg-primary/5 space-y-6 transition-all">
                {/* 1. Empire Subscription */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-950">
                      <AppWindow className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase italic">Empire Subscription</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                        <Calendar className="w-2.5 h-2.5" /> {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black italic">{formatCurrency(4000)}</p>
                    <span className="text-[8px] font-black text-primary uppercase">Platform Due</span>
                  </div>
                </div>

                {/* 2. Dues Section */}
          {dues.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Marketplace Dues
              </div>
              <div className="space-y-3">
                {dues.map((due, i) => (
                  <div key={i} className="p-6 bg-theme-background border border-theme rounded-[24px] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500">
                        <Bucket className="w-5 h-5" />
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
              </div>
            </div>
          )}

        </div>

      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
}
