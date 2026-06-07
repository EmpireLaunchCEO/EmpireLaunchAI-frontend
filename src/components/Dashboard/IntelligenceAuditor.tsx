"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, X, ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { empireService } from '@/lib/api-service';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function IntelligenceAuditor() {
  const { activeEmpireId, isInitialized } = useEmpire();
  const [isVisible, setIsVisible] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [intelLevel, setIntelLevel] = useState(0);
  
  // Interactive State
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [collectedData, setData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const auditIntelligence = useCallback(async () => {
    // Only audit if we're not on onboarding
    if (pathname.includes('onboarding')) {
      setIsVisible(false);
      return;
    }

    if (!activeEmpireId) return;
    
    // Check if dismissed recently (last 4 hours)
    const lastDismissed = localStorage.getItem('intel_audit_dismissed');
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < 1000 * 60 * 60 * 4) {
      return;
    }

    try {
      const empire = await empireService.getEmpire(activeEmpireId);
      if (empire) {
        const missing = [];
        const isDefaultName = !empire.title || empire.title === 'The First Empire' || empire.title === '';
        if (isDefaultName) missing.push('Name');
        
        const description = empire.description || '';
        const hasNiche = description.includes('Empire Niche:') && !description.includes('Empire Niche: .') && !description.includes('Niche: Niche Pending');
        const hasAngle = description.includes('Angle:') && !description.includes('Angle: .') && !description.includes('Angle: Strategy Pending');

        if (!hasNiche) missing.push('Niche');
        if (!hasAngle) missing.push('Angle');

        // Force visibility if critical data is missing, even if tour isn't finished
        const isCriticalMissing = isDefaultName || !hasNiche;
        const hasSeenTour = localStorage.getItem('empire_tour_v419') === 'true';
        
        if (missing.length > 0 && (hasSeenTour || isCriticalMissing)) {
          setMissingFields(missing);
          setIntelLevel(Math.max(0, 3 - missing.length));
          if (!isInteractive) {
            // Immediate popup for critical, short delay for others
            const delay = isCriticalMissing ? 500 : 3000;
            setTimeout(() => setIsVisible(true), delay);
          }
        } else {
          setIsVisible(false);
          setIsInteractive(false);
        }
      }
    } catch (err) {
      console.error('Audit failed', err);
    }
  }, [activeEmpireId, pathname, isInteractive]);

  useEffect(() => {
    const handleForceSync = () => {
      setIsInteractive(true);
      setIsVisible(true);
      // Reset current field to start from the beginning of missing fields
      setCurrentFieldIdx(0);
    };

    window.addEventListener('empire:force-intel-sync', handleForceSync);
    return () => window.removeEventListener('empire:force-intel-sync', handleForceSync);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      auditIntelligence();
    }
  }, [isInitialized, auditIntelligence, pathname]);

  const getQuestion = (field: string) => {
    if (field === 'Name') return "Establishing secure identity... What shall we name your Empire?";
    if (field === 'Niche') return "Defining operational parameters... What is your primary business Niche? (e.g. Digital Planners)";
    if (field === 'Angle') return "Calibrating unique value proposition... What is your Brand Angle? (What makes you unique?)";
    return "";
  };

  const initialMessage = isCriticalMissing 
    ? `System Alert: Empire identity incomplete. I cannot execute autonomous strategies without a Name and Niche. Shall we synchronize your vision now?`
    : `Analyzing neural pathways... I've detected a critical data gap. Your Empire ${missingFields.join(', ')} is currently undefined. Shall we calibrate your identity now?`;

  const currentMessage = isInteractive ? getQuestion(missingFields[currentFieldIdx]) : initialMessage;

  useEffect(() => {
    if (isVisible) {
      setIsTyping(true);
      setDisplayedMessage('');
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedMessage(currentMessage.slice(0, i));
        if (i >= currentMessage.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [isVisible, currentMessage]);

  const handleNext = async () => {
    if (!inputValue.trim()) return;

    const field = missingFields[currentFieldIdx];
    const newData = { ...collectedData, [field]: inputValue };
    setData(newData);
    setInputValue('');

    if (currentFieldIdx < missingFields.length - 1) {
      setCurrentFieldIdx(prev => prev + 1);
    } else {
      // Save everything
      setIsSaving(true);
      try {
        const empire = await empireService.getEmpire(activeEmpireId);
        const title = newData['Name'] || empire.title;
        const niche = newData['Niche'] || empire.description?.match(/Empire Niche: (.*?)\./)?.[1] || '';
        const angle = newData['Angle'] || empire.description?.match(/Angle: (.*?)\./)?.[1] || '';

        const description = `Empire Niche: ${niche}. Angle: ${angle}. Mode: co-pilot`;

        await empireService.updateEmpire(activeEmpireId, {
          title,
          description
        });
        
        setIsVisible(false);
        setIsInteractive(false);
        // Reload to update UI
        window.location.reload();
      } catch (err) {
        console.error('Failed to sync intelligence', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 100, x: '-50%' }}
        className="fixed bottom-24 lg:bottom-12 left-1/2 lg:left-[calc(50%+166px)] z-[9999] w-[92%] max-w-2xl"
      >
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[32px] p-6 md:p-8 text-white border-2 border-primary/40 shadow-[0_0_80px_rgba(0,229,255,0.3)] relative overflow-hidden group">
          {/* Animated Scanning Line */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0 opacity-40"
          />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-white" />
                <div className="absolute inset-0 bg-primary/20 rounded-[28px] animate-pulse" />
                {isTyping && (
                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-2 animate-bounce shadow-lg border-2 border-slate-900">
                    <Sparkles className="w-3 h-3 text-slate-900" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col items-center">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-1">Intel integrity</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(lvl => (
                    <div key={lvl} className={cn("w-3 h-1 rounded-full", lvl <= intelLevel ? "bg-primary" : "bg-slate-800")} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-lg border border-primary/20">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">High Intelligence AI</span>
                  </div>
                  <div className="px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Protocol Gap Detected</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    localStorage.setItem('intel_audit_dismissed', Date.now().toString());
                    setIsVisible(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group/close"
                >
                  <X className="w-4 h-4 text-white/40 group-hover:text-white" />
                </button>
              </div>

              <div className="relative min-h-[60px]">
                <p className="text-base md:text-xl font-bold leading-snug tracking-tight italic text-slate-100">
                  {displayedMessage}
                  {isTyping && <span className="inline-block w-1.5 h-6 bg-primary ml-1 animate-pulse" />}
                </p>
              </div>

              {isInteractive ? (
                <div className="space-y-4 pt-2">
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      placeholder={`Enter your Empire ${missingFields[currentFieldIdx]}...`}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-5 text-sm md:text-base font-bold focus:border-primary outline-none transition-all placeholder:text-white/20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mr-2">Press Enter</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Step {currentFieldIdx + 1} of {missingFields.length}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={isSaving || !inputValue.trim()}
                      className="px-8 py-3 bg-primary text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? 'Synchronizing...' : currentFieldIdx === missingFields.length - 1 ? 'Complete Neural Sync' : 'Next Protocol'}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setIsInteractive(true)}
                    className="flex-1 px-8 py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,229,255,0.4)] group active:scale-95"
                  >
                    Synchronize Intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('intel_audit_dismissed', Date.now().toString());
                      setIsVisible(false);
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-white/60 active:scale-95"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Neural Network Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="neural-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
                <path d="M2 2 L40 40 M2 40 L40 2" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#neural-pattern)" />
            </svg>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
