"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Flag,
  Stars,
  ArrowRight,
  Target,
  Share2,
  Rocket,
  CreditCard,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import Link from 'next/link';

interface Step {
  id: number;
  title: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
  icon: any;
  href?: string;
}

export function MissionBriefing({ empireData }: { empireData: any }) {
  const { connectedPlatforms, isPaid, aiMode } = useEmpire();

  const steps = useMemo<Step[]>(() => {
    const description = empireData?.description || '';
    const hasName = empireData?.title && empireData.title !== 'The First Empire' && empireData.title !== '';
    const hasNiche = description.includes('Empire Niche:') && !description.includes('Empire Niche: .');
    const isIdentityComplete = hasName && hasNiche;
    
    // Step 2: Treasury (For this prototype, we use isPaid as the proxy)
    const isTreasuryComplete = isPaid;

    // Step 3: Platform Bridge
    const isBridgeComplete = connectedPlatforms.length > 0;

    return [
      {
        id: 1,
        title: "Empire Identity",
        description: isIdentityComplete ? "Identity Synchronized." : "Define your niche and business angle.",
        status: isIdentityComplete ? 'complete' : 'current',
        icon: Flag,
        href: !isIdentityComplete ? '#' : undefined
      },
      {
        id: 2,
        title: "Treasury Sync",
        description: isTreasuryComplete ? "Payouts Active." : "Link Stripe for direct-to-bank payouts.",
        status: isIdentityComplete ? (isTreasuryComplete ? 'complete' : 'current') : 'upcoming',
        icon: CreditCard,
        href: isIdentityComplete && !isTreasuryComplete ? '/settings' : undefined
      },
      {
        id: 3,
        title: "Platform Bridge",
        description: isBridgeComplete ? `${connectedPlatforms.length} Links Active.` : "Connect your first social or store outlet.",
        status: isTreasuryComplete ? (isBridgeComplete ? 'complete' : 'current') : 'upcoming',
        icon: Share2,
        href: isTreasuryComplete && !isBridgeComplete ? '/settings' : undefined
      },
      {
        id: 4,
        title: "AI Deep Research",
        description: "Find high-velocity products in your niche.",
        status: isBridgeComplete ? 'current' : 'upcoming',
        icon: BrainCircuit,
        href: isBridgeComplete ? '/empire-center' : undefined
      },
      {
        id: 5,
        title: "Launch Sequence",
        description: "Publish your first AI-generated listing.",
        status: isBridgeComplete ? 'upcoming' : 'upcoming',
        icon: Rocket
      }
    ];
  }, [empireData, connectedPlatforms, isPaid]);

  const currentStep = steps.find(s => s.status === 'current') || steps[0];

  const consultantMessage = useMemo(() => {
    if (currentStep.id === 1) return "\"Owner, I'm currently running on default parameters. To activate my tactical thinking, I need you to synchronize your Empire Identity—Name and Niche. This calibrates my entire neural network.\"";
    if (currentStep.id === 2) return "\"Your identity is secure. Now, we must bridge your Treasury. Linking your bank info ensures that the moment I generate a sale, the funds flow directly to you with total encryption.\"";
    if (currentStep.id === 3) return `"Excellent. Your ${empireData?.niche || 'business'} foundation is ready. Now, pick your first battlefield—Etsy, TikTok, or Gmail. Once linked, I can start executing autonomous growth cycles."`;
    return `"I'm currently scanning ${connectedPlatforms.length} platforms for high-velocity trends. I've identified a scaling opportunity in your niche. Ready to review the research?"`;
  }, [currentStep.id, empireData?.niche, connectedPlatforms.length]);

  return (
    <div className="bg-theme-surface rounded-[32px] md:rounded-[48px] p-6 lg:p-12 text-foreground relative overflow-hidden shadow-2xl border-2 border-theme">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-10 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/40 rounded-full blur-[100px] opacity-10 -ml-32 -mb-32" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <div className="flex-1 space-y-6 lg:space-y-8 w-full">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Target className="w-3 h-3" />
              Active Mission: {currentStep.title}
            </div>
            <h2 className="text-xl lg:text-5xl font-black tracking-tight leading-[0.9]">
              {currentStep.id <= 3 ? "Establish Your" : "Scale Your"} <br />
              <span className="text-primary italic">{currentStep.id <= 3 ? "Foundation." : "Empire."}</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-md text-xs lg:text-base leading-relaxed italic">
              {currentStep.id <= 3 
                ? "I've prepared your initial growth sequence. Complete these steps to hand off full autonomy to the Empire Brain."
                : "Your foundation is solid. I am now optimizing your presence across all linked platforms for maximum revenue velocity."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {steps.map((step) => {
              const isActive = step.status === 'current';
              const isComplete = step.status === 'complete';
              
              const content = (
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-colors",
                    isComplete ? "bg-green-500 text-white" :
                    isActive ? "bg-primary text-white" :
                    "bg-theme-background text-muted-foreground"
                  )}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate uppercase tracking-wide">{step.title}</h4>
                    <p className={cn(
                      "text-[10px] font-medium truncate",
                      isActive ? "text-muted-foreground" : "opacity-60"
                    )}>
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );

              const isLinkable = step.href && (isActive || step.id === 1);

              if (isLinkable) {
                const clickHandler = step.id === 1 && !isComplete 
                  ? (e: any) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('empire:force-intel-sync')); }
                  : undefined;

                return (
                  <Link
                    href={step.href || '#'}
                    key={step.id}
                    onClick={clickHandler}
                    className={cn(
                      "block p-4 rounded-3xl border transition-all bg-theme-background text-foreground border-theme shadow-xl shadow-primary/5 active:scale-[0.98] hover:border-primary/50"
                    )}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <motion.div
                  key={step.id}
                  whileHover={!isComplete ? { x: 4 } : {}}
                  className={cn(
                    "p-4 rounded-3xl border transition-all",
                    isComplete ? "bg-green-500/5 border-green-500/20 text-green-500" :
                    "bg-theme-background/50 border-theme text-muted-foreground"
                  )}
                >
                  {content}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="p-8 rounded-[40px] bg-theme-background/50 border border-theme flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Stars className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Empire Teacher</span>
                <span className="font-bold text-foreground text-sm">Status: Operational</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                {consultantMessage}
              </p>

              <button
                onClick={() => {
                  if (currentStep.id === 1) window.dispatchEvent(new CustomEvent('empire:force-intel-sync'));
                  else if (currentStep.href) window.location.href = currentStep.href;
                }}
                className="block w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all text-center active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                {currentStep.id === 1 ? "Start Neural Sync" : "Execute Protocol"}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-primary/10 border border-primary/20 relative overflow-hidden">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Strategic Insight</span>
             </div>
             <p className="text-[10px] font-bold text-foreground/80 leading-relaxed italic">
               {empireData?.niche 
                ? `I'm analyzing '${empireData.niche}' competitors. I've detected a gap in their SEO strategy that we can exploit immediately once your first store is linked.`
                : "I'm currently idling on standby. Synchronize your niche so I can begin scanning for high-velocity profit opportunities."
               }
             </p>
             <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 blur-xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

