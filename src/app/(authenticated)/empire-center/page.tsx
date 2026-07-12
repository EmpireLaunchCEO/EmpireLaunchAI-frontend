"use client";

import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Video,
  Palette,
  FileText
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
import { SocialMediaRadar } from '@/components/Dashboard/SocialMediaRadar';
import { SocialProofApproval } from '@/components/Dashboard/SocialProofApproval';
import { OmniApprovalHub as PendingApprovals } from '@/components/OmniApprovalHub';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { EmpireAIChatBox } from '@/components/Dashboard/EmpireAIChatBox';

import { NicheCalibrationBox } from '@/components/Dashboard/SuccessHub/NicheCalibrationBox';
import { AutoPilotStatusBadge } from '@/components/Dashboard/GlobalDnaPoolPanel';
import { NeuralDispatchCenter } from '@/components/Dashboard/NeuralDispatchCenter';

export default function EmpireCenterPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'intel'>('pending');
  const { empireNotes, setEmpireNotes, connectedPlatforms, isAdmin, activeEmpire: empireData, registerRefreshHandler } = useEmpire();
  const [createdAssets, setCreatedAssets] = useState<any[]>([]);

  // Fetch created content from Empire Studio
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('empireUserId') : null;
        if (!userId) return;
        const res = await fetch(`/api/studio/assets`, {
          headers: {
            'Authorization': 'Bearer mock-mobile-token',
            'x-user-id': userId
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCreatedAssets(Array.isArray(data) ? data : data.assets || []);
        }
      } catch (err) {
        console.warn('Failed to fetch created assets:', err);
      }
    };
    fetchAssets();
  }, []);

  const isPlatformConnected = (platform: string) => {
    return connectedPlatforms.some(p => p.toLowerCase() === platform.toLowerCase());
  };

  const handleRefresh = React.useCallback(async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  }, []);

  React.useEffect(() => {
    return registerRefreshHandler(handleRefresh);
  }, [registerRefreshHandler, handleRefresh]);

  return (
      <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
        
        {/* 1. Identity Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Link Center Active</span>
            <AutoPilotStatusBadge />
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
            {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE' || empireData?.name === 'Business 1' || !empireData?.name) ? "EmpireLaunch AI" : (empireData?.name || empireData?.title)}
          </h1>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000" style={{ contentVisibility: 'auto' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <EmpireAIChatBox className="max-w-6xl mx-auto" />
          </motion.div>

          {/* Primary Tabs - Optimized for mobile visibility */}
          <div className="flex flex-wrap bg-theme-background p-1.5 rounded-[24px] w-full border !border-white/10 sticky top-0 z-20 gap-1">
            {[
              { id: 'pending', label: 'Pending', icon: Zap },
              { id: 'intel', label: 'Intel', icon: BarChart3 },
              ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[18px] font-black text-[9px] sm:text-[10px] uppercase tracking-tighter transition-all",
                  activeTab === tab.id
                    ? "bg-theme-surface text-foreground shadow-sm border !border-white/20"
                    : "text-slate-400 hover:text-foreground hover:bg-theme-surface/50"
                )}
              >
                <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "")} />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'pending' && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12 w-full"
              >
                {/* Full Width Pending Approvals */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-normal italic pr-8">Action Required</h3>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full">Neural Sync Active</span>
                    </div>

                    <NeuralDispatchCenter />
                </section>
              </motion.div>
            )}

            {activeTab === 'intel' && (
              <motion.div
                key="intel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              >
                {/* Main Feed - Empire Intel */}
                <div className="lg:col-span-2 space-y-12">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <NicheCalibrationBox 
                      isOperationsBase={true}
                      archetype={empireData?.archetype}
                      niche={empireData?.niche || (isAdmin ? "All in One Business Runner" : empireData?.description?.match(/Empire Niche:\s*(.*?)(?:\.|$)/)?.[1])} 
                      angle={empireData?.angle || (isAdmin ? "High-intelligence autonomous research and trend-driven asset generation." : empireData?.description?.match(/Angle:\s*(.*?)(?:\.|$)/)?.[1])}
                    />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <SocialMediaRadar />
                  </motion.div>

                  {/* Recent Creations from Empire Studio */}
                  {createdAssets.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                              <History className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Recent Creations</h3>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {createdAssets.slice(0, 5).map((asset: any, i: number) => (
                            <div key={asset.id || i} className="flex items-center gap-3 p-3 rounded-2xl bg-theme-background border border-theme">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                {asset.type === 'video' ? <Video className="w-4 h-4 text-primary" /> : 
                                 asset.type === 'design' ? <Palette className="w-4 h-4 text-primary" /> : 
                                 <FileText className="w-4 h-4 text-primary" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-foreground truncate">{asset.title || asset.name || `Creation ${i + 1}`}</p>
                                <p className="text-[9px] font-medium text-muted-foreground">
                                  {asset.platform || 'Studio'} · {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : 'Recently'}
                                </p>
                              </div>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                asset.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                asset.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-slate-500/10 text-slate-500'
                              )}>
                                {asset.status || 'created'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}
                </div>

                {/* Sidebar Context */}
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white space-y-4"
                  >
                    <h4 className="text-lg font-black leading-tight">Next 24 Hours.</h4>
                    {connectedPlatforms.length > 0 ? (
                      <ul className="space-y-4">
                        {isPlatformConnected('TikTok') && (
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                            <p className="text-xs font-medium text-indigo-100">Post 'Product Showcase' to TikTok (Scheduled)</p>
                          </li>
                        )}
                        {isPlatformConnected('Gmail') && (
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                            <p className="text-xs font-medium text-indigo-100">AI 'Email Sequence' firing for new subscribers</p>
                          </li>
                        )}
                        {!isPlatformConnected('TikTok') && !isPlatformConnected('Gmail') && (
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                            <p className="text-xs font-medium text-indigo-100">Autonomous growth cycles active...</p>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs font-black uppercase tracking-widest text-blue-200">Waiting for platform linkage...</p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FeedbackBox />
          </motion.div>
          {/* Version Verification */}
          <div className="flex justify-center pb-20">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.0.2 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
  );
}
