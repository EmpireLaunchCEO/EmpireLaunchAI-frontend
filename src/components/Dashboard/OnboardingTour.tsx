"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Stars, 
  Bot,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings as SettingsIcon, 
  Zap,
  Bell
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEmpire } from '@/lib/EmpireContext';

interface TourStep {
  title: string;
  description: string;
  icon: any;
  page?: string;
}

export function OnboardingTour() {
  const { isInitialized } = useEmpire();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const tourSteps: TourStep[] = [
    {
      title: "Welcome to EmpireLaunch AI",
      description: "I am your AI partner. I've built this command center to help you scale your business with zero technical knowledge required. Let me show you around!",
      icon: Bot
    },
    {
      title: "Your Dashboard",
      description: "This is your Home. Here you can see your real-time profit, active AI missions, and overall empire growth at a glance.",
      icon: LayoutDashboard,
      page: "/dashboard"
    },
    {
      title: "Empire Center (EC)",
      description: "The Empire Center is where we manage your actual business operations—listings, orders, and fulfillment tracking.",
      icon: ClipboardList,
      page: "/empire-center"
    },
    {
      title: "Link Center (LC)",
      description: "This is where you connect new platforms. The more outlets we link, the faster your empire scales.",
      icon: PlusCircle,
      page: "/link-center"
    },
    {
      title: "Settings & Configuration",
      description: "Here you manage your account, bank info for payouts, and most importantly, my AI intelligence levels.",
      icon: SettingsIcon,
      page: "/settings"
    },
    {
      title: "AI Intelligence",
      description: "This is the brain of the operation. Here you decide how much control I have. Switch to Auto-Pilot for maximum growth!",
      icon: Zap,
      page: "/settings"
    },
    {
      title: "Real-Time Alerts",
      description: "Keep an eye on the notification bell! It will pulse when you have new sales or when I need your approval.",
      icon: Bell,
      page: "/dashboard"
    },
    {
      title: "Ready to Launch?",
      description: "Go to Settings > AI Intelligence and put me on Auto-Pilot! I'm ready to start building your empire.",
      icon: Stars,
      page: "/settings"
    }
  ];

  useEffect(() => {
    if (!isInitialized) return;
    
    const hasSeenTour = localStorage.getItem('hasSeenEmpireTourV8');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const handleComplete = () => {
    localStorage.setItem('hasSeenEmpireTourV8', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    const nextIdx = currentStep + 1;
    if (nextIdx < tourSteps.length) {
      const nextStepData = tourSteps[nextIdx];
      if (nextStepData.page && pathname !== nextStepData.page) {
        // Use a safe navigation pattern
        setTimeout(() => {
          router.push(nextStepData.page!);
        }, 10);
      }
      setCurrentStep(nextIdx);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Only render if initialized and visible
  if (!isInitialized || !isVisible) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-white rounded-[48px] shadow-2xl max-w-lg w-full overflow-hidden border-8 border-slate-900 relative"
        >
          <div className="p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Icon className="w-10 h-10" />
              </div>
              <button 
                onClick={handleComplete} 
                className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">
                {step.title}
              </h2>
              <p className="text-lg text-slate-500 font-bold leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="flex gap-2">
                {tourSteps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-slate-900' : 'w-2 bg-slate-100'}`} 
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button 
                    onClick={prevStep}
                    className="p-4 rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl active:scale-95"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next Phase'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
