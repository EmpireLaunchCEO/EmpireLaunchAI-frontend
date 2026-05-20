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

export function SetupAssistant() {
  const { activeSetupPlatform, finishSetup } = useEmpire();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!activeSetupPlatform) return null;

  const steps = activeSetupPlatform.toLowerCase() === 'etsy' ? etsySteps : [];
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
    <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-end p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        className="pointer-events-auto relative max-w-sm w-full"
      >
        {/* The Pointy Bubble */}
        <div className="bg-slate-900 rounded-[32px] shadow-2xl border-2 border-blue-500 overflow-hidden relative">
          {/* Triangle Point on the Left */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-slate-900 border-l-2 border-b-2 border-blue-500 rotate-45" />
          
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white relative z-10">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-widest">Empire Teacher</span>
            </div>
            <button onClick={finishSetup} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Step {currentStep + 1} of {steps.length}
              </span>
              <h3 className="text-xl font-black text-white italic">
                {step.field}
              </h3>
            </div>

            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              “{step.instruction}”
            </p>

            {step.value && (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">What to provide:</div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-xs font-mono text-blue-300 break-all">
                    {step.value}
                  </code>
                  <button 
                    onClick={() => handleCopy(step.value)}
                    className={`shrink-0 p-3 rounded-xl transition-all ${
                      copied ? 'bg-green-600 text-white' : 'bg-white text-slate-900 hover:scale-105'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={prev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white disabled:opacity-0 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={next}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Swipe Hint for Mobile */}
        <div className="mt-4 text-center md:hidden">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
            Swipe right to dismiss setup
          </p>
        </div>
      </motion.div>
    </div>
  );
}
