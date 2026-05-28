"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stars, 
  X, 
  ArrowRight, 
  MessageSquare,
  Bot,
  Info,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface TourStep {
  title: string;
  content: string;
  targetId?: string;
  path?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Home",
    content: "Your central command. Monitor your business slots, active goals, and the latest high-intelligence suggestions from your AI partner.",
    targetId: "desktop-nav-home",
    path: "/dashboard"
  },
  {
    title: "EC (Empire Center)",
    content: "Operational headquarters. This is where we research trends, design content blueprints, and organize the execution path for your business.",
    targetId: "desktop-nav-ec",
    path: "/empire-center"
  },
  {
    title: "LC (Link Center)",
    content: "Neural connectivity. Bridge your Etsy, TikTok, Instagram, and YouTube accounts here to allow the AI full autonomous execution.",
    targetId: "desktop-nav-lc",
    path: "/link-center"
  },
  {
    title: "Settings",
    content: "Configure your preferences, safety thresholds, and system theme. You stay in control of how much access the AI has.",
    targetId: "desktop-nav-settings",
    path: "/settings"
  }
];

export const SetupAssistant = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [showTour, setShowTour] = useState(false);
  
  // Ref for the bot bubble
  const botRef = useRef<HTMLDivElement>(null);

  // Check if we should show the tour automatically
  useEffect(() => {
    const tourKey = 'empire_tour_v418';
    const hasSeenTour = localStorage.getItem(tourKey);
    if (!hasSeenTour && pathname === '/dashboard') {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Update coordinates of the target element
  useEffect(() => {
    if (!showTour || !isOpen) return;

    const updateCoords = () => {
      const step = TOUR_STEPS[currentStep];
      if (step?.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          setCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
          
          // If the step requires a path change, we don't force it here, 
          // we just update coords for the current page's elements.
        }
      }
    };

    updateCoords();
    const interval = setInterval(updateCoords, 1000); // Poll for layout shifts
    window.addEventListener('resize', updateCoords);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateCoords);
    };
  }, [currentStep, showTour, isOpen, pathname]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStep = TOUR_STEPS[currentStep + 1];
      if (nextStep.path && pathname !== nextStep.path) {
        router.push(nextStep.path);
      }
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = TOUR_STEPS[currentStep - 1];
       if (prevStep.path && pathname !== prevStep.path) {
        router.push(prevStep.path);
      }
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowTour(false);
    setIsOpen(false);
    localStorage.setItem('empire_tour_v418', 'true');
  };

  return (
    <>
      {/* Target Highlighter Overlay */}
      <AnimatePresence>
        {showTour && isOpen && coords.width > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at ' + (coords.left + coords.width/2) + 'px ' + (coords.top + coords.height/2) + 'px, transparent ' + (coords.width) + 'px, rgba(0,0,0,0.5) ' + (coords.width + 20) + 'px)'
            }}
          >
             <motion.div 
               animate={{ 
                 top: coords.top - 8, 
                 left: coords.left - 8, 
                 width: coords.width + 16, 
                 height: coords.height + 16 
               }}
               className="absolute border-2 border-primary rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)]"
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Bot UI */}
      <div className="fixed bottom-24 right-8 z-[110] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-theme-surface border border-theme rounded-[32px] shadow-2xl p-6 w-80 md:w-96 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-2 rounded-xl">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-foreground">Empire Assistant</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-theme-background rounded-full transition-all">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {showTour ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black italic text-primary uppercase tracking-tighter">
                      {TOUR_STEPS[currentStep].title}
                    </h3>
                    <p className="text-foreground/80 text-sm font-medium leading-relaxed">
                      {TOUR_STEPS[currentStep].content}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-theme">
                    <div className="flex gap-1">
                      {TOUR_STEPS.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentStep ? 'bg-primary w-4' : 'bg-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <button 
                          onClick={handlePrev}
                          className="p-2 bg-theme-background border border-theme rounded-xl hover:bg-theme-background transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={handleNext}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-lg shadow-blue-200"
                      >
                        {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-foreground/80 text-sm font-medium">
                    Hello! I'm your Empire Assistant. I'm currently monitoring 24 global trends. How can I help you scale today?
                  </p>
                  <button 
                    onClick={() => {
                      setCurrentStep(0);
                      setShowTour(true);
                      router.push('/dashboard');
                    }}
                    className="w-full py-3 bg-theme-background border border-theme rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-theme-background transition-all flex items-center justify-center gap-2"
                  >
                    Start Platform Tour
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all ${isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-primary text-white shadow-blue-200'}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-8 h-8" />}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
      </div>
    </>
  );
};
