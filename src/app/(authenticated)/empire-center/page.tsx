"use client";

import React, { useState } from 'react';
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
  Trash2
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

export default function EmpireCenterPage() {
  const [activeTab, setActiveTab] = useState<'duties' | 'history' | 'ai-config'>('duties');
  const { empireNotes, setEmpireNotes } = useEmpire();

  const handleRefresh = async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <ClipboardList className="w-3 h-3" />
            Empire Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Operations Hub.
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Manage duties, approvals, and AI execution roadmap.
          </p>
        </div>
      </header>

      {/* Primary Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[24px] w-fit">
        {[
          { id: 'duties', label: 'Active Duties', icon: Zap },
          { id: 'history', label: 'Post History', icon: History },
          { id: 'ai-config', label: 'AI Directives', icon: Stars },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-[20px] font-bold text-sm transition-all",
              activeTab === tab.id 
                ? "bg-theme-surface text-foreground shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-600" : "")} />
            {tab.label}
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
                <div className="bg-theme-surface border-2 border-slate-50 rounded-[40px] p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground">Pending Approvals</h3>
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">2 Action Required</span>
                  </div>
                  
                  <div className="space-y-4">
                    {duties.filter(d => d.type === 'approval').map(duty => (
                      <div key={duty.id} className="p-6 bg-theme-background rounded-3xl flex items-center justify-between gap-4 border border-transparent hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-theme-surface rounded-2xl flex items-center justify-center shadow-sm">
                            <Clock className="w-6 h-6 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{duty.title}</p>
                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">{duty.platform}</p>
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
                    ))}
                  </div>
                </div>

                {/* AI Work/Research Feed */}
                <div className="bg-theme-surface border-2 border-slate-50 rounded-[40px] p-8 space-y-6">
                   <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground">AI Active Research</h3>
                    <button className="text-xs font-black text-blue-600 uppercase tracking-widest">New Request +</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-theme rounded-3xl space-y-4">
                      <div className="flex items-center gap-3">
                        <Stars className="w-5 h-5 text-blue-600" />
                        <p className="font-bold text-foreground italic text-sm">"Analyzing top 50 best-sellers in 'Digital Planners'..."</p>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "65%" }}
                          className="bg-blue-600 h-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Phase: Data Synthesis</span>
                        <span>65% Complete</span>
                      </div>
                    </div>
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
                className="bg-theme-surface border-2 border-slate-50 rounded-[40px] p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-foreground">Posting Tracker</h3>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">All Platforms</button>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                        <th className="pb-4">Site</th>
                        <th className="pb-4">Asset</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {postHistory.map((post) => (
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
                            <span className="text-slate-400 text-sm">{post.date}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                      <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Status: Active</p>
                    </button>
                    <button className="p-6 bg-theme-surface/5 border border-white/10 rounded-[32px] text-left hover:bg-theme-surface/10 transition-all">
                      <ExternalLink className="w-6 h-6 text-purple-500 mb-4" />
                      <p className="font-bold text-sm">Auto-Posting</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Status: Paused</p>
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
           <div className="bg-theme-surface border-2 border-slate-50 rounded-[40px] p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-foreground text-sm">Empire Notes</h4>
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
                className="w-full bg-amber-50/30 border-2 border-transparent rounded-3xl p-6 text-sm font-medium outline-none focus:border-amber-200 transition-all min-h-[200px] text-slate-700 placeholder:text-amber-600/30"
              />
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600/50">
                <Stars className="w-3 h-3" />
                AI Sync: Real-time
              </div>
           </div>

           <div className="bg-theme-surface border-2 border-slate-50 rounded-[40px] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-black text-foreground text-sm">Feedback Channel</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
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
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                  <p className="text-xs font-medium text-indigo-100">Post 'Product Showcase' to TikTok (Pending Approval)</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                  <p className="text-xs font-medium text-indigo-100">Finalize 'Email Sequence' for new subscribers</p>
                </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
    </PullToRefresh>
  );
}
