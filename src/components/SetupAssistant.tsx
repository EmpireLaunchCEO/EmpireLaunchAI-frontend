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
  Stars,
  Zap,
  Target,
  ExternalLink,
  ShieldCheck,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFloating, offset, flip, shift, arrow, autoUpdate } from '@floating-ui/react-dom';

const etsySteps = [
  {
    field: "API Key",
    selector: "#etsy-api-key",
    value: "75x9v2k4m1n8",
    instruction: "Enter your Etsy Keystring here to allow the AI to sync with your shop."
  },
  {
    field: "Shared Secret",
    selector: "#etsy-shared-secret",
    value: "v92k4m1n8x75",
    instruction: "The Shared Secret ensures a secure encrypted tunnel for your payment data."
  }
];

const tiktokSteps = [
  {
    field: "Marketing API",
    selector: "#tiktok-marketing-api",
    value: "Marketing API",
    instruction: "Select 'Marketing API' to allow autonomous video scheduling."
  },
  {
    field: "Redirect URI",
    selector: "#tiktok-redirect-uri",
    value: "https://empire-launch-ai-frontend.vercel.app/api/auth/callback/tiktok",
    instruction: "Copy this into the 'Redirect URI' field in your TikTok Dev Portal."
  }
];

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
  'etsy': etsySteps,
  'tiktok': tiktokSteps,
  'onboarding': onboardingSteps
};

export function SetupAssistant() {
  const { activeSetupPlatform, finishSetup } = useEmpire();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const steps = activeSetupPlatform ? (platformMap[activeSetupPlatform.toLowerCase()] || []) : 
               (pathname === '/onboarding' ? onboardingSteps : null);

  const step = (steps && currentStep >= 0 && currentStep < (steps as any[]).length) ? (steps as any[])[currentStep] : null;

  const { x, y, strategy, refs, middlewareData, placement } = useFloating({
    elements: {
      reference: targetElement,
    },
    placement: 'right',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(20),
      flip(),
      shift({ padding: 10 }),
      arrow({ element: arrowRef }),
    ],
  });

  useEffect(() => {
    if (step && step.selector) {
      const el = document.querySelector(step.selector) as HTMLElement;
      if (el) {
        setTargetElement(el);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetElement(null);
      }
    } else {
      setTargetElement(null);
    }
  }, [step, pathname]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const next = () => {
    if (steps && currentStep < (steps as any[]).length - 1) {
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

  if (!step || !targetElement || !steps) return null;

  const typedSteps = steps as any[];

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]] as string;

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
            className="w-4 h-4 rotate-45 bg-primary"
            />

            <div className="w-[320px] bg-slate-900 border border-primary/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-slate-950" />
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">
                  Empire Teacher
                </span>
              </div>
              <button
                onClick={() => activeSetupPlatform ? finishSetup() : setCurrentStep(-1)}
                className="text-slate-950/60 hover:text-slate-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  Step {currentStep + 1} of {typedSteps.length}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  {step.field}
                </h3>
                <p className="text-[12px] font-bold text-slate-300 leading-tight italic">
                  "{step.instruction}"
                </p>

                {step.value && (
                  <div className="bg-theme-surface/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
                    <code className="flex-1 text-[11px] font-mono text-primary truncate">
                      {step.value}
                    </code>
                    <button
                      onClick={() => handleCopy(step.value)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        copied ? "bg-green-600 text-white" : "bg-primary text-slate-950 hover:bg-amber-400"
                      )}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {currentStep > 0 && (
                  <button
                    onClick={prev}
                    className="flex-1 px-4 py-3 rounded-xl bg-theme-surface/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-theme-surface/10"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex-[2] bg-primary text-slate-950 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                >
                  {currentStep === typedSteps.length - 1 ? 'Finish & Save' : 'Next Step'}
                </button>
              </div>
            </div>
            </div>

      </AnimatePresence>

      {/* Spotlight effect */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        style={{
          clipPath: targetElement ? `polygon(0% 0%, 0% 100%, ${targetElement.offsetLeft}px 100%, ${targetElement.offsetLeft}px ${targetElement.offsetTop}px, ${targetElement.offsetLeft + targetElement.offsetWidth}px ${targetElement.offsetTop}px, ${targetElement.offsetLeft + targetElement.offsetWidth}px ${targetElement.offsetTop + targetElement.offsetHeight}px, ${targetElement.offsetLeft}px ${targetElement.offsetTop + targetElement.offsetHeight}px, ${targetElement.offsetLeft}px 100%, 100% 100%, 100% 0%)` : 'none'
        }}
      />
    </div>
  );
}
