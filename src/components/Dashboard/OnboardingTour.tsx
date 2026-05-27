"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Stars, 
  Rocket, 
  Bot,
  ArrowDown,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings as SettingsIcon,
  Zap
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface TourStep {
  title: string;
  description: string;
  target?: string;
  icon: any;
  action?: () => void;
  page?: string;
}

export function OnboardingTour() {
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
      target: "nav-home",
      icon: LayoutDashboard,
      page: "/dashboard"
    },
    {
      title: "Empire Center (EC)",
      description: "The Empire Center is where we manage your actual business operations—listings, orders, and fulfillment tracking.",
      target: "nav-ec",
      icon: ClipboardList,
      page: "/empire-center"
    },
    {
      title: "Link Center (LC)",
      description: "This is where you connect new platforms. The more outlets we link, the faster your empire scales.",
      target: "nav-lc",
      icon: PlusCircle,
      page: "/link-center"
    },
    {
      title: "Settings & Configuration",
      description: "Here you manage your account, bank info for payouts, and most importantly, my AI intelligence levels.",
      target: "nav-settings",
      icon: SettingsIcon,
      page: "/settings"
    },
    {
      title: "Link Center (Settings)",
      description: "Within Settings, the Link Center tab lets you perform the deep API handshakes with Etsy, TikTok, and more.",
      target: "tab-link-center",
      icon: PlusCircle,
      page: "/settings"
    },
    {
      title: "AI Intelligence",
      description: "This is the brain of the operation. You can toggle between Co-Pilot (I ask for approval) and Auto-Pilot (I handle it all).",
      target: "tab-ai-intelligence",
      icon: Zap,
      page: "/settings"
    },
    {
      title: "That's the Tour!",
      description: "When you're ready to link your apps so I can work and scale your business with your direction, go to the AI Intelligence Tab under Settings, and Put me on Auto-Pilot! You can put me back to Co-Pilot any time after we get you Linked!",
      icon: Stars,
      page: "/settings"
    }
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenEmpireTourV4');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('hasSeenEmpireTourV4', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    const nextIdx = currentStep + 1;
    if (nextIdx < tourSteps.length) {
      const nextStepData = tourSteps[nextIdx];
      if (nextStepData.page && pathname !== nextStepData.page) {
        router.push(nextStepData.page);
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

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden border-4 border-slate-900 relative"
        >
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <Icon className="w-8 h-8" />
              </div>
              <button onClick={handleComplete} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-900 leading-tight italic">
                {step.title}
              </h2>
              <p className="text-slate-500 font-bold leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-1.5">
                {tourSteps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-100'}`} 
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button 
                    onClick={prevStep}
                    className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Highlighting Pointer for Bottom Nav (Mobile/Bottom) */}
      {step.target?.startsWith('nav-') && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 flex flex-col items-center gap-2"
        >
          <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            Look Here
          </div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="w-8 h-8 text-slate-900" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
