"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Stars, 
  Rocket, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  Bot
} from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  highlight?: string;
  icon: any;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to your Empire Command Center",
    description: "I've built this space for non-tech founders. You don't need to know how to code; you just need to know how to lead. I'll handle the heavy lifting while you make the decisions.",
    icon: Rocket
  },
  {
    title: "Your Daily Mission Briefing",
    description: "This is your checklist for growth. I've prepared a sequence of tasks to establish your brand. Follow these steps to unlock full AI autonomy.",
    highlight: "Mission Briefing",
    icon: Target
  },
  {
    title: "The Financial Ledger",
    description: "Track your real-time profit here. Note: To keep our interests aligned, there is a flat $30 service fee for every $1,000 you earn. We only win when you win!",
    highlight: "Financial Growth",
    icon: TrendingUp
  },
  {
    title: "AI Brain & Autonomous Cycles",
    description: "This shows my current 'thought process'. I'm constantly researching trends and creating content. Nothing goes live without your final approval in the Review Queue.",
    highlight: "Autonomous Cycles",
    icon: Bot
  },
  {
    title: "Empire Expansion & Subscription",
    description: "Your monthly subscription covers all AI processing and tool costs. We automatically secure these dues from your business earnings so you never have to worry about manual payments. If your empire hasn't generated profit yet, dues will be charged to your primary payment method until you're in the green.",
    highlight: "Billing Policy",
    icon: Zap
  },
  {
    title: "Unlimited Potential",
    description: "Our goal is to give you unlimited potential to succeed. Whether you're making $100 or $100,000 a month, the system scales with you. Let's start building your legacy!",
    icon: ShieldCheck
  }
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the tour if it hasn't been seen yet
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('hasSeenDashboardTour', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[48px] shadow-2xl max-w-lg w-full overflow-hidden border-2 border-blue-600"
      >
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Stars className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <button onClick={handleComplete} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-8 relative z-10">
            <h2 className="text-3xl font-black leading-tight italic">
              {step.title}
            </h2>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            {step.highlight && (
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                Focus: {step.highlight}
              </span>
            )}
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex gap-1.5">
              {tourSteps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-100'}`} 
                />
              ))}
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={prevStep}
                  className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
              >
                {currentStep === tourSteps.length - 1 ? 'Start Empire' : 'Next Step'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
