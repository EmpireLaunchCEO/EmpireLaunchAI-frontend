"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  Check, 
  X,
  Bot as BotIcon,
  Zap
} from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFloating, offset, flip, shift, arrow, autoUpdate } from '@floating-ui/react-dom';

const onboardingSteps = [
  {
    field: "Empire Name",
    selector: "#empire-name",
    instruction: "Give your empire a strong, memorable name. This will appear on all your invoices and social profiles."
  },
  {
    field: "Niche",
    selector: "#empire-niche",
    instruction: "What's the high-level category? (e.g., 'Digital Art', 'Skincare'). This helps me calibrate trend research."
  },
  {
    field: "Business Angle",
    selector: "#empire-angle",
    instruction: "What's your unique spin? 'Better than ChatGPT' thinking starts here. Tell me your specific strategy."
  },
  {
    field: "Automation Mode",
    selector: "#automation-empire-mode",
    instruction: "Select Auto-Pilot to start. THIS allows me to scan and link the accounts on your phone (Gmail, Etsy, TikTok) to retrieve your API keys and secure tokens automatically."
  }
];

const platformMap: Record<string, any[]> = {
  'onboarding': onboardingSteps
};

export function SetupAssistant() {
  const { activeSetupPlatform, finishSetup, isInitialized } = useEmpire();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Determine if we should show based on state
  const shouldShow = isInitialized && (activeSetupPlatform || pathname === '/onboarding');
  
  const steps = activeSetupPlatform ? (platformMap[activeSetupPlatform.toLowerCase()] || []) : 
               (pathname === '/onboarding' ? onboardingSteps : null);

  const step = (steps && currentStep >= 0 && currentStep < steps.length) ? steps[currentStep] : null;

  const { x, y, strategy, refs, middlewareData, placement } = useFloating({
    elements: {
      reference: targetElement,
    },
    placement: 'right',
    whileElementsMounted: (reference, floating, update) => {
      if (!reference || !floating) return;
      return autoUpdate(reference, floating, update);
    },
    middleware: [
      offset(20),
      flip(),
      shift({ padding: 10 }),
      arrow({ element: arrowRef }),
    ],
  });

  useEffect(() => {
    if (!shouldShow || !step?.selector) {
      setTargetElement(null);
      return;
    }

    const timer = setTimeout(() => {
      const el = document.querySelector(step.selector) as HTMLElement;
      if (el && el.isConnected) {
        setTargetElement(el);
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
      } else {
        setTargetElement(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [step, pathname, shouldShow]);

  const handleCopy = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const next = () => {
    if (steps && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCopied(false);
    } else if (activeSetupPlatform) {
      finishSetup();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCopied(false);
    }
  };

  if (!shouldShow || !step || !targetElement) return null;

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]] || 'left';

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        <motion.div
          key={`${pathname}-${activeSetupPlatform}-${currentStep}`}
          ref={refs.setFloating}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className="pointer-events-auto"
        >
          {/* Arrow */}
          <div
            ref={arrowRef}
            style={{
              position: 'absolute',
              left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
              top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
              [staticSide]: '-8px',
            }}
            className="w-4 h-4 rotate-45 bg-blue-600"
          />

          <div className="w-[320px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BotIcon className="w-4 h-4 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  Empire Teacher
                </span>
              </div>
              <button 
                onClick={() => activeSetupPlatform ? finishSetup() : setCurrentStep(-1)} 
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Step {currentStep + 1} of {steps?.length}
                </span>
                <h4 className="text-white font-bold tracking-tight">{(step as any).field}</h4>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                {(step as any).instruction}
              </p>

              {(step as any).value && (
                <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between gap-3 border border-white/5">
                  <code className="text-xs text-blue-300 font-mono truncate">{(step as any).value}</code>
                  <button 
                    onClick={() => handleCopy((step as any).value)}
                    className="shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={prev}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors disabled:opacity-0"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <button
                  onClick={next}
                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                  {currentStep === (steps?.length || 0) - 1 ? 'Got it' : 'Next'} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
