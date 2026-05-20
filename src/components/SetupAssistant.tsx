"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';

const etsySteps = [
  {
    field: "Application Name",
    value: "EmpireLaunch AI - Staci",
    instruction: "Type this exactly into the first box on Etsy."
  },
  {
    field: "Description",
    value: "AI assistant for managing my business.",
    instruction: "This tells Etsy what our smart app does."
  },
  {
    field: "Application Website",
    value: "https://empire-launch-ai.vercel.app",
    instruction: "Copy this short URL into the Website field."
  },
  {
    field: "Type of Application",
    value: "Seller Tools",
    instruction: "Select this option so I can help you with listings."
  },
  {
    field: "Who will use it?",
    value: "Myself or people I work with",
    instruction: "Select this to keep the connection private to you."
  },
  {
    field: "Commercial purposes?",
    value: "Yes",
    instruction: "Since we are building an empire, select Yes!"
  },
  {
    field: "Callback URL",
    value: "https://empire-launch-ai.vercel.app/auth/callback/etsy",
    instruction: "IMPORTANT: Copy this long URL into the Callback field."
  }
];

const tiktokSteps = [
  {
    field: "App Name",
    value: "EmpireLaunch Marketing",
    instruction: "Enter this as the public name of your integration."
  },
  {
    field: "Industry",
    value: "Business Services",
    instruction: "Select the industry that best fits your niche."
  },
  {
    field: "Redirect URI",
    value: "https://empire-launch-ai.vercel.app/auth/callback/tiktok",
    instruction: "Copy this URL into the 'Redirect URI' box on TikTok."
  }
];

const metaSteps = [
  {
    field: "App Type",
    value: "Business",
    instruction: "Select 'Business' to allow Instagram and Facebook management."
  },
  {
    field: "Display Name",
    value: "EmpireLaunch Social",
    instruction: "This is how the app will appear in your Meta dashboard."
  },
  {
    field: "Valid OAuth Redirect URIs",
    value: "https://empire-launch-ai.vercel.app/auth/callback/meta",
    instruction: "Copy this URL into the OAuth settings on Meta."
  }
];

const gmailSteps = [
  {
    field: "Application Name",
    value: "EmpireLaunch Support",
    instruction: "Name your Google Cloud project this for easier tracking."
  },
  {
    field: "Authorized Redirect URIs",
    value: "https://empire-launch-ai.vercel.app/auth/callback/gmail",
    instruction: "Paste this into your Google Cloud Console Credentials."
  }
];

const platformMap: Record<string, any[]> = {
  etsy: etsySteps,
  tiktok: tiktokSteps,
  meta: metaSteps,
  instagram: metaSteps,
  facebook: metaSteps,
  gmail: gmailSteps,
  google: gmailSteps
};

export function SetupAssistant() {
  const { activeSetupPlatform, finishSetup } = useEmpire();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!activeSetupPlatform) return null;

  const steps = platformMap[activeSetupPlatform.toLowerCase()] || [
    {
      field: "General Setup",
      value: `https://empire-launch-ai.vercel.app/auth/callback/${activeSetupPlatform.toLowerCase()}`,
      instruction: `I'm ready to link ${activeSetupPlatform}! Use this Redirect URL if the platform asks for one.`
    }
  ];
  const step = steps[currentStep];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
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
    <div className="fixed bottom-[120px] right-6 left-6 md:left-auto md:right-12 z-[500] pointer-events-none flex justify-center md:justify-end">
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="pointer-events-auto w-full max-w-[340px]"
      >
        <div className="bg-slate-900 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-blue-500 overflow-hidden ring-4 ring-blue-500/20">
          <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-white fill-current" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Empire Teacher Active</span>
            </div>
            <button onClick={finishSetup} className="text-white/60 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Setup Field {currentStep + 1} of {steps.length}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  {step.field}
                </h3>
                <p className="text-[12px] font-bold text-slate-300 leading-tight mt-1 italic">
                  "{step.instruction}"
                </p>
              </div>

              {step.value && (
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
