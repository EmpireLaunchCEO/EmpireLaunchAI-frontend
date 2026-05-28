"use client";

import React, { useState } from 'react';
import { 
  BarChart3, 
  Zap, 
  Settings2, 
  Activity,
  ChevronRight,
  TrendingUp,
  Mail,
  ShieldCheck,
  Stars,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GrowthTracker } from '@/components/Dashboard/SuccessHub/GrowthTracker';
import { VideoPerformance } from '@/components/Dashboard/SuccessHub/VideoPerformance';
import { TrendRadar } from '@/components/Analytics/TrendRadar';
import { AutomationCenter } from '@/components/Automation/AutomationCenter';
import { EmpireLedger } from '@/components/Analytics/EmpireLedger';

const tabs = [
  { id: 'growth', name: 'Growth & Trends', icon: TrendingUp },
  { id: 'automation', name: 'Automation Hub', icon: Mail },
  { id: 'finance', name: 'Empire Analytics', icon: BarChart3 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('growth');

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto space-y-8 md:space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Intelligence Command</h1>
          <p className="text-theme-background0 text-sm md:text-base font-medium italic">High-intelligence performance tracking and automated growth.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-[20px] md:rounded-[24px] overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-[16px] md:rounded-[20px] text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-theme-surface text-foreground shadow-sm" 
                  : "text-theme-background0 hover:text-slate-700 hover:bg-theme-surface/50"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5 md:w-4 h-4", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
              {tab.name}
            </button>
          ))}
        </div>
      </header>

      <main className="space-y-12">
        {activeTab === 'growth' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GrowthTracker />
              <VideoPerformance />
            </div>
            <div className="pt-6">
              <TrendRadar />
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AutomationCenter />
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-theme-surface p-8 rounded-[40px] border border-theme shadow-sm space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Empire Revenue</p>
                <h3 className="text-4xl font-black text-foreground">$12,450.00</h3>
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  +18.4% this month
                </div>
              </div>
              
              <div className="md:col-span-2 bg-theme-surface p-8 rounded-[40px] border border-theme shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="font-bold text-foreground">Revenue Trends</h4>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empire 1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empire 2</span>
                      </div>
                   </div>
                </div>
                <div className="h-24 flex items-end gap-1 px-2">
                  {[30, 45, 35, 60, 55, 80, 70, 95, 85, 100, 90, 110].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-slate-100 rounded-t-sm relative group cursor-pointer hover:bg-primary/20 transition-colors" 
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${h * 10}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <EmpireLedger />
          </div>
        )}
      </main>

      {/* Persistent AI Intelligence Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-4 shadow-2xl flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl animate-pulse">
            <Stars className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-bold">AI Intelligence Online</p>
            <p className="text-white/50 text-[10px]">Analyzing trends and securing dues in real-time...</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-theme-surface/10 hover:bg-theme-surface/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">
              Strategy Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
