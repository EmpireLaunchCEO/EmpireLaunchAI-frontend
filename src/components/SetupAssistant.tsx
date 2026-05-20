"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  MessageCircle,
  Lightbulb,
  ShieldCheck,
  Zap,
  Rocket,
  Target
} from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const etsySteps = [
  {
    field: "Application Name",
    value: "EmpireLaunchAI_Bridge",
    instruction: "Give your Etsy app a name. This is for your internal use."
  },
  {
    field: "Application Mode",
    value: "Development",
    instruction: "Choose 'Development' mode unless you've already applied for commercial access."
  },
  {
    field: "Callback URL",
    value: "https://empire-launch-ai.vercel.app/api/auth/callback/etsy",
    instruction: "CRITICAL: Copy this exactly into the 'Callback URL' field in Etsy Developer Settings."
  },
  {
    field: "Inventory Management",
    value: "Read/Write",
    instruction: "Ensure you grant both 'Read' and 'Write' permissions so I can manage your shop."
  }
];

const tiktokSteps = [
  {
    field: "App Type",
    value: "Marketing API",
    instruction: "Select 'Marketing API' to allow autonomous video scheduling."
  },
  {
    field: "Redirect URI",
    value: "https://empire-launch-ai.vercel.app/api/auth/callback/tiktok",
    instruction: "Copy this into the 'Redirect URI' field in your TikTok Dev Portal."
  }
];

const platformMap: Record<string, any[]> = {
  'etsy': etsySteps,
  'tiktok': tiktokSteps
};

const pageGuidance: Record<string, { title: string; instruction: string; icon: any }> = {
  '/dashboard': {
    title: "Empire Command",
    instruction: "Welcome back, CEO. I'm monitoring your active cycles. Complete the Mission Briefing steps below to unlock full AI autonomy.",
    icon: Zap
  },
  '/settings': {
    title: "Platform Bridge",
    instruction: "Connect your social outlets and stores here. Once linked, I can start researching trends and drafting content for you automatically.",
    icon: ExternalLink
  },
  '/review': {
    title: "Control Gate",
    instruction: "Nothing goes live without your approval. Review my drafts here. Swipe right to deploy to your connected platforms.",
    icon: ShieldCheck
  },
  '/analytics': {
    title: "Profit Ledger",
    instruction: "I'm tracking your real-time growth. Remember, our interests are aligned: we only succeed when your revenue hits its targets.",
    icon: Lightbulb
  },
  '/': {
    title: "The Beginning",
    instruction: "I'm ready to build your empire. Click 'Get Started' to define your business angle and social outlets.",
    icon: Rocket
  },
  '/onboarding': {
    title: "Empire Calibration",
    instruction: "Tell me about your vision. I'll use this data to set up your custom AI growth algorithms.",
    icon: Target
  }
};

export function SetupAssistant() {
  const { activeSetupPlatform, finishSetup } = useEmpire();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  // Reset step when platform changes
  useEffect(() => {
    setCurrentStep(0);
    setCopied(false);
  }, [activeSetupPlatform]);

  // Auto-minimize after a few seconds of inactivity on the same page
  useEffect(() => {
    if (!activeSetupPlatform) {
      setHasNotified(true);
      const timer = setTimeout(() => setIsMinimized(true), 8000);
      return () => clearTimeout(timer);
    } else {
      setIsMinimized(false);
    }
  }, [pathname, activeSetupPlatform]);

  const steps = activeSetupPlatform ? (platformMap[activeSetupPlatform.toLowerCase()] || [
    {
      field: "General Setup",
      value: `https://empire-launch-ai.vercel.app/api/auth/callback/${activeSetupPlatform.toLowerCase()}`,
      instruction: `I'm ready to link ${activeSetupPlatform}! Use this Redirect URL if the platform asks for one.`
    }
  ]) : null;

  const guidance = pageGuidance[pathname] || {
    title: "Empire Assistant",
    instruction: "I'm here to help you scale. Navigate through the tabs to manage your autonomous business operations.",
    icon: Bot
  };

  const step = steps ? steps[currentStep] : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const next = () => {
    if (steps && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCopied(false);
    } else {
      finishSetup();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCopied(false);
    }
  };

  return (
    <div className="fixed bottom-[140px] right-6 left-6 md:left-auto md:right-12 z-[500] pointer-events-none flex justify-center md:justify-end">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="pointer-events-auto w-14 h-14 bg-slate-900 border-2 border-blue-500 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-blue-500/20 group"
          >
            <Bot className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            {activeSetupPlatform && (
              <motion.div 
                layoutId="pulse"
                className="absolute inset-0 rounded-2xl bg-blue-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ) : (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="pointer-events-auto w-full max-w-[340px]"
          >
            <div className="bg-slate-900 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-blue-500 overflow-hidden ring-4 ring-blue-500/20">
              <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    {activeSetupPlatform ? 'Empire Teacher' : 'AI Assistant'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsMinimized(true)} className="text-white/60 hover:text-white transition-colors p-1">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeSetupPlatform && (
                    <button onClick={finishSetup} className="text-white/60 hover:text-white transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-4">
                {steps ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                        Setup Field {currentStep + 1} of {steps.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">
                          {step?.field}
                        </h3>
                        <p className="text-[12px] font-bold text-slate-300 leading-tight mt-1 italic">
                          "{step?.instruction}"
                        </p>
                      </div>

                      {step?.value && (
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10 group shadow-inner">
                          <code className="flex-1 text-[12px] font-mono text-blue-300 truncate font-bold">
                            {step.value}
                          </code>
                          <button 
                            onClick={() => handleCopy(step.value)}
                            className={cn(
                              "p-3 rounded-xl transition-all shadow-lg",
                              copied ? "bg-green-600 text-white scale-110" : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                            )}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {currentStep > 0 && (
                        <button 
                          onClick={prev}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button 
                        onClick={next}
                        className="flex-[2] bg-white text-slate-900 px-4 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-[0.98]"
                      >
                        {currentStep === steps.length - 1 ? 'Finish & Save' : 'Next Step'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                        <guidance.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">{guidance.title}</h3>
                    </div>
                    <p className="text-[13px] font-medium text-slate-300 leading-relaxed italic">
                      "{guidance.instruction}"
                    </p>
                    <button 
                      onClick={() => setIsMinimized(true)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
