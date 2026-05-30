"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Stars,
  Bot,
  ArrowDown,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings as SettingsIcon,
  Zap,
  Bell
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface TourStep {
  title: string;
  description: string;
  target?: string;
  icon: any;
  page?: string;
}

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [pointerY, setPointerY] = useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

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
      page: "/settings?tab=link-center"
    },
    {
      title: "AI Intelligence",
      description: "This is the brain of the operation. Here you decide how much control I have.",
      target: "tab-ai-intelligence",
      icon: Zap,
      page: "/settings?tab=ai-intelligence"
    },
    {
      title: "Co-Pilot Mode",
      description: "In Co-Pilot, I'll do the heavy lifting but I'll always ask for your final approval before taking action.",
      target: "mode-copilot",
      icon: Bot,
      page: "/settings?tab=ai-intelligence"
    },
    {
      title: "Auto-Pilot Mode",
      description: "Switch to Auto-Pilot for maximum growth. I'll execute strategies and manage your empire autonomously 24/7.",
      target: "mode-autopilot",
      icon: Zap,
      page: "/settings?tab=ai-intelligence"
    },
    {
      title: "Notification Center",
      description: "Configure your alerts here. We can notify you of new sales or when the AI has content ready for your final look.",
      target: "tab-notifications",
      icon: SettingsIcon,
      page: "/settings?tab=notifications"
    },
    {
      title: "Real-Time Alerts",
      description: "Keep an eye on this bell! It will pulse when you have new sales or when I need your approval on a new strategy.",
      target: "notification-bell",
      icon: Bell,
      page: "/dashboard"
    },
    {
      title: "That's the Tour!",
      description: "When you're ready to link your apps so I can work and scale your business with your direction, go to the AI Intelligence Tab under Settings, and Put me on Auto-Pilot! You can put me back to Co-Pilot any time after we get you Linked!",
      icon: Stars,
      page: "/settings"
    }
  ];

  useEffect(() => {
    const updatePointer = () => {
      const step = tourSteps[currentStep];
      if (step?.target) {
        setTimeout(() => {
          const el = document.getElementById(step.target!);
          if (el) {
            const rect = el.getBoundingClientRect();
            setPointerX(rect.left + rect.width / 2);

            // SIGNIFICANT OFFSET: Keep the pointer high above the bottom bar
            if (step.target?.startsWith('nav-')) {
              // Points to bottom nav, place bubble well above and arrow pointing down
              setPointerY(rect.top - 40);
            } else if (step.target?.startsWith('tab-') || step.target?.startsWith('mode-')) {
              // Points to settings tabs or modes (usually top or middle), place arrow pointing up
              setPointerY(rect.bottom + 20);
            } else if (step.target === 'notification-bell') {
              // Points to notification bell (top right), place arrow pointing up
              setPointerY(rect.bottom + 20);
            } else {
              // Fallback
              setPointerY(rect.bottom + 20);
            }
          }
        }, 300); // Increased delay for stability
      } else {
        setPointerX(null);
        setPointerY(null);
      }
    };

    updatePointer();
    window.addEventListener('resize', updatePointer);
    return () => window.removeEventListener('resize', updatePointer);
  }, [currentStep, pathname, searchParams]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('empire_tour_v419');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('empire_tour_v419', 'true');
    setIsVisible(false);
  };

  const nextStep = () => {
    const nextIdx = currentStep + 1;
    if (nextIdx < tourSteps.length) {
      const nextStepData = tourSteps[nextIdx];
      
      // If the step has a specific page, go there
      if (nextStepData.page) {
        const [basePath, query] = nextStepData.page.split('?');
        if (pathname !== basePath) {
          router.push(nextStepData.page);
        } else if (query) {
          // If we are already on the page but need to switch a tab
          const tabMatch = query.match(/tab=([^&]+)/);
          if (tabMatch) {
            window.dispatchEvent(new CustomEvent('empire:switch-tab', { detail: tabMatch[1] }));
          }
        }
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
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 bg-slate-900/60 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-teal-500 rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden border-4 border-white relative pointer-events-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 opacity-90" />
          
          <div className="relative p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                <Icon className="w-8 h-8" />
              </div>
              <button onClick={handleComplete} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white leading-tight italic drop-shadow-sm">
                {step.title}
              </h2>
              <p className="text-white font-bold leading-relaxed drop-shadow-sm">
                {step.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-1.5">
                {tourSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="p-3 rounded-xl bg-slate-900/40 text-white hover:bg-slate-900/60 border border-white/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-primary text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* DYNAMIC POINTER WITH ABSOLUTE Z-INDEX ADVANTAGE */}
      {pointerX !== null && pointerY !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, left: pointerX, top: pointerY }}
          className="fixed z-[10001] flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ transition: 'left 0.3s ease, top 0.3s ease' }}
        >
          {step.target?.startsWith('nav-') ? (
            <>
              <div className="bg-teal-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl border-2 border-white whitespace-nowrap animate-pulse shadow-teal-500/50">
                Look Here
              </div>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowDown className="w-10 h-10 text-teal-500 drop-shadow-xl fill-teal-500 stroke-white stroke-[1px]" />
              </motion.div>
            </>
          ) : (
            <div className="flex flex-col-reverse items-center gap-1 translate-y-[100%]">
              <div className="bg-teal-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl border-2 border-white whitespace-nowrap animate-pulse shadow-teal-500/50">
                Look Here
              </div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowDown className="w-10 h-10 text-teal-500 drop-shadow-xl fill-teal-500 stroke-white stroke-[1px] rotate-180" />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
