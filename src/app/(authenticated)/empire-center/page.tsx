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
  ShieldCheck,
  BarChart3
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

import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { AIOptimizationHub } from '@/components/Dashboard/AIOptimizationHub';
import { AutonomousCyclesStatus } from '@/components/Dashboard/AutonomousCyclesStatus';
import { IntelligenceCenter } from '@/components/Dashboard/IntelligenceCenter';
import { SocialMediaRadar } from '@/components/Dashboard/SocialMediaRadar';
import { SocialProofApproval } from '@/components/Dashboard/SocialProofApproval';

export default function EmpireCenterPage() {
  const [activeTab, setActiveTab] = useState<'duties' | 'social-media'>('duties');
  const { empireNotes, setEmpireNotes, connectedPlatforms, isAdmin, activeEmpire: empireData } = useEmpire();

  const isPlatformConnected = (platform: string) => {
    return connectedPlatforms.some(p => p.toLowerCase() === platform.toLowerCase());
  };

  const filteredDuties = duties.filter(d => isPlatformConnected(d.platform));
  const filteredHistory = postHistory.filter(h => isPlatformConnected(h.site));
  
  const handleRefresh = async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
        
        {/* 1. Identity Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Neural Link Active</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
            {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE') ? "EmpireLaunch AI" : (empireData?.name || empireData?.title || "EmpireLaunch AI")}
          </h1>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          
          {/* Primary Tabs - Optimized for mobile visibility */}
          <div className="flex flex-wrap bg-theme-background p-1.5 rounded-[24px] w-full border-2 border-theme sticky top-0 z-20 gap-1">
            {[
              { id: 'duties', label: 'Duties', icon: Zap },
              { id: 'social-media', label: 'Social Media', icon: BarChart3 },
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
              <IntelligenceCenter />
              <SocialProofApproval />
              <AIOptimizationHub />
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

                {activeTab === 'social-media' && (
                  <motion.div
                    key="social-media"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-theme-surface border-2 border-theme rounded-[40px] p-6 md:p-8 space-y-6"
                  >
                    <SocialMediaRadar />
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

          {/* Version Verification */}
          <div className="flex justify-center pb-20">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.0.2 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
