"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Flag, 
  Sparkles, 
  ArrowRight,
  Target,
  Share2,
  Rocket,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

import Link from 'next/link';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
  icon: any;
  href?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Empire Identity",
    description: "Define your niche and business angle.",
    status: 'complete',
    icon: Flag
  },
  {
    id: 2,
    title: "Treasury Sync",
    description: "Link Stripe for direct-to-bank payouts.",
    status: 'complete',
    icon: CreditCard
  },
  {
    id: 3,
    title: "Platform Bridge",
    description: "Connect your first social or store outlet.",
    status: 'current',
    icon: Share2,
    href: '/settings'
  },
  {
    id: 4,
    title: "AI Deep Research",
    description: "Find high-velocity products in your niche.",
    status: 'upcoming',
    icon: Sparkles
  },
  {
    id: 5,
    title: "Launch Sequence",
    description: "Publish your first AI-generated listing.",
    status: 'upcoming',
    icon: Rocket
  }
];

export function MissionBriefing() {
  return (
    <div className="bg-slate-900 rounded-[48px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -ml-32 -mb-32" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8 w-full">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">
              <Target className="w-3 h-3" />
              Active Mission: Expansion Phase I
            </div>
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-[0.9]">
              Establish Your <br />
              <span className="text-blue-500 italic">Foundation.</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-md text-sm lg:text-base leading-relaxed">
              I've prepared your initial growth sequence. Complete these steps to hand off full autonomy to the Empire Brain.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {steps.map((step) => {
              const content = (
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                    step.status === 'complete' ? "bg-blue-600 text-white" :
                    step.status === 'current' ? "bg-blue-600 text-white" :
                    "bg-slate-700 text-slate-500"
                  )}>
                    {step.status === 'complete' ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate uppercase tracking-wide">{step.title}</h4>
                    <p className={cn(
                      "text-[10px] font-medium truncate",
                      step.status === 'current' ? "text-slate-500" : "opacity-60"
                    )}>
                      {step.description}
                    </p>
                  </div>
                  {step.status === 'current' && (
                    <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );

              if (step.href && step.status === 'current') {
                return (
                  <Link 
                    href={step.href}
                    key={step.id}
                    className={cn(
                      "block p-4 rounded-3xl border transition-all bg-white text-slate-900 border-white shadow-xl shadow-blue-900/20 active:scale-[0.98]"
                    )}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <motion.div 
                  key={step.id}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "p-4 rounded-3xl border transition-all",
                    step.status === 'complete' ? "bg-blue-600/10 border-blue-600/20 text-blue-400" :
                    "bg-slate-800/50 border-slate-700/50 text-slate-500"
                  )}
                >
                  {content}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="p-8 rounded-[40px] bg-slate-800/50 border border-slate-700 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI Consultant</span>
                <span className="font-bold text-white text-sm">Status: Operational</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                "Owner, I'm currently waiting for a platform link to begin scraping market trends. I recommend connecting **TikTok** or **Etsy** first to establish a data feed."
              </p>
              
              <Link 
                href="/settings"
                className="block w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-colors text-center active:scale-[0.98]"
              >
                Connect First App
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-blue-600/10 border border-blue-600/20">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Suggestion</span>
             </div>
             <p className="text-[10px] font-bold text-blue-300 leading-relaxed">
               I see you're interested in 'Digital Planners'. I've detected a spike in 'Fitness Trackers' for June. Want me to pivot?
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
