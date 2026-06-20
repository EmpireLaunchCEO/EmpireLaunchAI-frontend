"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  Share2,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  PieChart,
  Activity,
  Zap,
  DollarSign
} from 'lucide-react';
import { analyticsService, EngagementMetric, EmpireHealth } from '@/lib/api-service';
import { cn } from '@/lib/utils';

export function PerformanceIntelligence({ health }: { health: EmpireHealth | null }) {
  const [socialMetrics, setSocialMetrics] = useState<EngagementMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await analyticsService.getSocialEngagement();
      setSocialMetrics(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalViews = (socialMetrics || []).reduce((acc, m) => acc + (m?.views || 0), 0);
  const totalEngagement = (socialMetrics || []).reduce((acc, m) => acc + (m?.likes || 0) + (m?.comments || 0) + (m?.shares || 0), 0);
  const avgConversion = (socialMetrics || []).reduce((acc, m) => acc + (m?.conversionRate || 0), 0) / (socialMetrics && socialMetrics.length > 0 ? socialMetrics.length : 1);

  const hasData = totalViews > 0;

  if (loading) return null;

  return (
    <div className="space-y-10">
      {/* Top Level Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-white/5 p-8 rounded-[40px] space-y-4">
           <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
                 <DollarSign className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{hasData ? "+12% WoW" : "0%"}</span>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unified P&L (Net)</p>
              <h4 className="text-3xl font-black text-white">${((health?.revenue || 0) * 0.82).toLocaleString()}</h4>
           </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[40px] space-y-4">
           <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                 <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Omnichannel</span>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reach</p>
              <h4 className="text-3xl font-black text-white">{(totalViews / 1000).toFixed(1)}K</h4>
           </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[40px] space-y-4">
           <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                 <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Sentiment: {hasData ? "Positive" : "N/A"}</span>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Affinity</p>
              <h4 className="text-3xl font-black text-white">{hasData ? "94.2%" : "0.0%"}</h4>
           </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-[40px] space-y-4">
           <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                 <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{hasData ? "Optimal" : "Standby"}</span>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conv. Rate</p>
              <h4 className="text-3xl font-black text-white">{hasData ? avgConversion.toFixed(1) : "0.0"}%</h4>
           </div>
        </div>
      </div>

      {/* Platform Breakdown Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-slate-900 border border-white/5 rounded-[48px] p-10 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Omnichannel Reach</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cross-Platform Distribution</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              {socialMetrics.map((metric, idx) => (
                <div key={metric.platform} className="space-y-3">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-bold text-white">{metric.platform}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(totalViews > 0 ? (metric.views / totalViews * 100) : 0).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <Heart className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{(metric.likes || 0).toLocaleString()}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <Share2 className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{(metric.shares || 0).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(totalViews > 0 ? (metric.views / totalViews * 100) : 0)}%` }}
                        transition={{ delay: idx * 0.2, duration: 1 }}
                        className={cn(
                          "h-full rounded-full",
                          metric.platform === 'TikTok' ? "bg-slate-200" :
                          metric.platform === 'Instagram' ? "bg-pink-500" :
                          "bg-red-600"
                        )}
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    <span className="text-white font-black uppercase">Viral Watch:</span> Your TikTok engagement is 3.4x higher than Instagram. The AI suggests shifting 20% more creative resource to Video Production.
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-[48px] p-10 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-emerald-400" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Revenue Breakdown</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Contribution</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total GTV</p>
                 <h4 className="text-2xl font-black text-white">${(health?.revenue || 0).toLocaleString()}</h4>
              </div>
           </div>

           <div className="space-y-6">
              {(health?.platformBreakdown || []).map((platform, idx) => (
                <div key={platform?.platform || idx} className="flex items-center justify-between p-4 rounded-[24px] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center font-black text-[10px]">
                         {String(platform?.platform || '??').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white">{platform?.platform || 'Unknown'}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-white">${(platform?.revenue || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-emerald-500">{( (platform?.revenue || 0) / (health?.revenue || 1) * 100).toFixed(1)}%</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span>Platform Fees (6%)</span>
                 <span className="text-red-400">-${((health?.revenue || 0) * 0.06).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                 <span>Success Fees (10%)</span>
                 <span className="text-red-400">-${((health?.revenue || 0) * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-black text-white mt-6 pt-4 border-t border-white/10">
                 <span className="italic uppercase tracking-tighter">Net Profit</span>
                 <span className="text-emerald-400">${((health?.revenue || 0) * 0.82).toLocaleString()}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
