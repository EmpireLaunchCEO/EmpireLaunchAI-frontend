"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle2,
  Search,
  MessageSquare,
  History,
  Globe,
  Zap,
  Clock,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Stars,
  StickyNote,
  Trash2,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';

const duties = [
  { id: 1, title: 'Approve TikTok Script', status: 'pending', platform: 'tiktok', type: 'approval' },
  { id: 2, title: 'Research Summer Trends', status: 'in-progress', platform: 'etsy', type: 'research' },
  { id: 3, title: 'Generate Instagram Assets', status: 'pending', platform: 'instagram', type: 'post-request' },
];

const postHistory = [
  { id: 1, site: 'Etsy', title: 'Digital Journal PDF', date: '2 hours ago', status: 'live' },
  { id: 2, site: 'TikTok', title: 'How to use the Journal', date: '5 hours ago', status: 'live' },
  { id: 3, site: 'Instagram', title: 'New Product Teaser', date: '1 day ago', status: 'live' },
];

const expenses = [
  { id: 1, source: 'GoDaddy', item: 'Domain: YourEmpire.com', cost: 14.99, cycle: 'annual', nextPayment: 'June 12, 2024', status: 'ai-managed' },
  { id: 2, source: 'Kittl', item: 'Pro Design Suite', cost: 0.00, cycle: 'monthly', nextPayment: 'N/A (Free Tier)', status: 'ai-managed' },
  { id: 3, source: 'Canva', item: 'Content Creation', cost: 0.00, cycle: 'monthly', nextPayment: 'N/A (Free Tier)', status: 'ai-managed' },
  { id: 4, source: 'Stripe', item: 'Payment Gateway', cost: 0.00, cycle: 'usage-based', nextPayment: 'Per Transaction', status: 'ai-managed' },
];

import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

export default function EmpireCenterPage() {
  const [activeTab, setActiveTab] = useState<'duties' | 'history' | 'expenses' | 'ai-config'>('duties');
  const { empireNotes, setEmpireNotes, connectedPlatforms } = useEmpire();

  const isPlatformConnected = (platform: string) => {
    return connectedPlatforms.some(p => p.toLowerCase() === platform.toLowerCase());
  };

  const filteredDuties = duties.filter(d => isPlatformConnected(d.platform));
  const filteredHistory = postHistory.filter(h => isPlatformConnected(h.site));
  
  const filteredExpenses = expenses.filter(e => {
    if (e.source === 'Stripe') return isPlatformConnected('Stripe');
    if (e.source === 'Canva' || e.source === 'Kittl' || e.source === 'GoDaddy') {
       return connectedPlatforms.length > 0;
    }
    return isPlatformConnected(e.source);
  });

  const handleRefresh = async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="p-3 md:p-8 pb-40 max-w-full md:max-w-7xl mx-auto space-y-6 md:space-y-12">
      {/* Page Context Header */}
      <div className="bg-theme-surface/30 p-5 rounded-[24px] border border-theme flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
            <ClipboardList className="w-3 h-3" />
            Operations Hub
          </div>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium italic">
            Manage duties, approvals, and AI execution roadmap.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
           <Stars className="w-3 h-3" />
           Empire Mode Active
        </div>
      </div>

      {/* Empire Reach Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-theme-surface border-2 border-theme rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(var(--surface-border-rgb),0.15)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -z-10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Customers</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground bg-gradient-to-r from-[rgb(var(--primary-rgb))] to-[rgb(var(--secondary-rgb))] bg-clip-text text-transparent">
                {connectedPlatforms.length > 0 ? "847" : "—"}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">
            {connectedPlatforms.length > 0 ? "Synced from Etsy & Stripe" : "Link platforms to populate"}
          </p>
        </div>

        <div className="bg-theme-surface border-2 border-theme rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(var(--surface-border-rgb),0.15)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Stars className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Subscribers</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {connectedPlatforms.length > 0 ? "342" : "—"}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Recurring revenue subscribers</p>
        </div>

        <div className="bg-theme-surface border-2 border-theme rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(var(--surface-border-rgb),0.15)] transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] -z-10" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Reach</p>
              <p className="text-2xl sm:text-3xl font-black text-foreground bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {connectedPlatforms.length > 0 ? "12.4K" : "—"}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">TikTok & Instagram followers</p>
        </div>
      </div>

      {/* Primary Tabs - Optimized for mobile visibility */}
      <div className="flex flex-wrap bg-theme-background p-1.5 rounded-[24px] w-full border-2 border-theme sticky top-0 z-20 gap-1">
        {[
          { id: 'duties', label: 'Duties', icon: Zap },
          { id: 'history', label: 'Posts', icon: History },
          { id: 'expenses', label: 'Costs', icon: CreditCard },
          { id: 'ai-config', label: 'Rules', icon: Stars },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 min-w-[80px] sm:min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[18px] font-black text-[9px] sm:text-[10px] uppercase tracking-tighter transition-all",
              activeTab === tab.id
                ? "bg-theme-surface text-foreground shadow-sm border border-theme"
                : "text-slate-400 hover:text-foreground hover:bg-theme-surface/50"
            )}
          >
            <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "")} />
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'duties' && (
              <motion.div
                key="duties"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Approvals Section */}
                <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground pr-2">Pending Approvals</h3>
                    {filteredDuties.filter(d => d.type === 'approval').length > 0 && (
                      <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        {filteredDuties.filter(d => d.type === 'approval').length} Action Required
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {filteredDuties.filter(d => d.type === 'approval').length > 0 ? (
                      filteredDuties.filter(d => d.type === 'approval').map(duty => (
                        <div key={duty.id} className="p-6 bg-theme-background rounded-3xl flex items-center justify-between gap-4 border border-transparent hover:border-blue-200 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-theme-surface rounded-2xl flex items-center justify-center shadow-sm">
                              <Clock className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{duty.title}</p>
                              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{duty.platform}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-3 bg-theme-surface hover:bg-red-50 text-red-500 rounded-xl transition-colors shadow-sm">
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-200">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center space-y-4 bg-theme-background rounded-3xl border-2 border-dashed border-theme">
                        <div className="w-16 h-16 bg-theme-surface rounded-full flex items-center justify-center mx-auto">
                          <ShieldCheck className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-foreground uppercase italic">All Clear</p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {connectedPlatforms.length === 0 
                              ? "Link your platforms to see pending duties." 
                              : "No actions required at this time."}
                          </p>
                        </div>
                        {connectedPlatforms.length === 0 && (
                          <Link href="/link-center" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                            Go to Link Center
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Work/Research Feed */}
                <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
                   <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground pr-2">AI Active Research</h3>
                    <button className="text-xs font-black text-blue-600 uppercase tracking-widest">New Request +</button>
                  </div>

                  <div className="space-y-4">
                    {connectedPlatforms.length > 0 ? (
                      <div className="p-6 border-2 border-dashed border-theme rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                          <Stars className="w-5 h-5 text-primary" />
                          <p className="font-bold text-foreground italic text-sm">"Analyzing top 50 best-sellers in 'Digital Planners'..."</p>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "65%" }}
                            className="bg-primary h-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Phase: Data Synthesis</span>
                          <span>65% Complete</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground font-medium text-xs italic">
                        Link a marketplace to initialize research protocols.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-foreground">Posting Tracker</h3>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">All Platforms</button>
                  </div>
                </div>

                <div className="overflow-hidden">
                  {filteredHistory.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-theme">
                          <th className="pb-4">Site</th>
                          <th className="pb-4">Asset</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredHistory.map((post) => (
                          <tr key={post.id} className="group">
                            <td className="py-6">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full overflow-hidden">
                                  <img src="/branded-globe.png" alt="Platform" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-black text-xs text-foreground uppercase tracking-tighter">{post.site}</span>
                              </div>
                            </td>
                            <td className="py-6">
                              <span className="font-bold text-slate-700">{post.title}</span>
                            </td>
                            <td className="py-6">
                              <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase">
                                <CheckCircle2 className="w-3 h-3" /> {post.status}
                              </div>
                            </td>
                            <td className="py-6">
                              <a 
                                href={`/p/${post.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-black uppercase"
                              >
                                View Live <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center space-y-4">
                      <History className="w-12 h-12 text-slate-200 mx-auto" />
                      <p className="text-sm font-bold text-slate-400">No posts have been established yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground">Expense Ledger</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">AI Managed Subscriptions & Fees</p>
                  </div>
                  <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                    <span className="text-primary font-black text-xs uppercase tracking-tighter">Automatic Mode: Active</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <div key={expense.id} className="p-6 bg-theme-background rounded-[32px] border border-theme hover:border-primary/30 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-theme-surface flex items-center justify-center border border-theme group-hover:border-primary/20">
                              <Globe className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{expense.source}</h4>
                              <p className="text-sm font-bold text-slate-500">{expense.item}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                            <div className="text-left md:text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</p>
                              <p className="text-lg font-black text-foreground">${expense.cost.toFixed(2)}</p>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Payout</p>
                              <p className="text-sm font-black text-slate-600 uppercase">{expense.nextPayment}</p>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                               <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100">
                                 <ShieldCheck className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">AI Secured</span>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center space-y-4 bg-theme-background rounded-3xl border-2 border-dashed border-theme">
                      <CreditCard className="w-12 h-12 text-slate-200 mx-auto" />
                      <p className="text-sm font-bold text-slate-400">No active operational costs detected.</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-900 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                         <Stars className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-bold italic text-slate-300">"I am monitoring all monthly cycles to ensure zero service interruptions."</p>
                   </div>
                   <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shrink-0">
                      Audit All Sources
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai-config' && (
              <motion.div
                key="ai-config"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900 rounded-[40px] p-10 text-white space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">AI Directives.</h3>
                  <p className="text-slate-400 font-medium">Tell the Brain what to prioritize for your empire.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Current Objective</label>
                    <textarea
                      placeholder="e.g. Focus on maximizing Etsy visibility for the new Summer Journal collection."
                      className="w-full bg-theme-surface/5 border-2 border-white/10 rounded-3xl p-6 text-sm font-medium outline-none focus:border-blue-600 transition-all min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 bg-theme-surface/5 border border-white/10 rounded-[32px] text-left hover:bg-theme-surface/10 transition-all">
                      <Search className="w-6 h-6 text-blue-500 mb-4" />
                      <p className="font-bold text-sm">Market Research</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black mt-1">Status: {connectedPlatforms.length > 0 ? "Active" : "Waiting for Link"}</p>
                    </button>
                    <button className="p-6 bg-theme-surface/5 border border-white/10 rounded-[32px] text-left hover:bg-theme-surface/10 transition-all">
                      <ExternalLink className="w-6 h-6 text-purple-500 mb-4" />
                      <p className="font-bold text-sm">Auto-Posting</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black mt-1">Status: Paused</p>
                    </button>
                  </div>

                  <button className="w-full py-5 bg-blue-600 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40">
                    Update Directives
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
           {/* Empire Notes Section */}
           <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-foreground text-sm pr-2">Empire Notes</h4>
                </div>
                <button
                  onClick={() => setEmpireNotes('')}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={empireNotes}
                onChange={(e) => setEmpireNotes(e.target.value)}
                placeholder="Press the mic and say 'Notes...' to dictate your thoughts here."
                className="w-full bg-cyan-500/5 border-2 border-transparent rounded-3xl p-6 text-sm font-medium outline-none focus:border-cyan-400/30 transition-all min-h-[200px] text-slate-700 placeholder:text-cyan-400/30"
              />

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400/50">
                <Stars className="w-3 h-3" />
                AI Sync: Real-time
              </div>
           </div>

           <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-black text-foreground text-sm">Feedback Channel</h4>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Send feedback to the AI regarding past posts or research quality.
              </p>
              <input
                type="text"
                placeholder="Type your feedback..."
                className="w-full bg-theme-background border-2 border-transparent rounded-2xl p-4 text-xs font-bold focus:border-blue-600 transition-all outline-none"
              />
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white space-y-4">
              <h4 className="text-lg font-black leading-tight">Next 24 Hours.</h4>
              {connectedPlatforms.length > 0 ? (
                <ul className="space-y-4">
                  {isPlatformConnected('TikTok') && (
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                      <p className="text-xs font-medium text-indigo-100">Post 'Product Showcase' to TikTok (Pending Approval)</p>
                    </li>
                  )}
                  {isPlatformConnected('Gmail') && (
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                      <p className="text-xs font-medium text-indigo-100">Finalize 'Email Sequence' for new subscribers</p>
                    </li>
                  )}
                  {!isPlatformConnected('TikTok') && !isPlatformConnected('Gmail') && (
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                      <p className="text-xs font-medium text-indigo-100">Scanning connected platforms for growth opportunities...</p>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-xs font-black uppercase tracking-widest text-blue-200">Waiting for platform linkage...</p>
              )}
           </div>
        </div>
      </div>
    </div>
  </PullToRefresh>
  );
}
