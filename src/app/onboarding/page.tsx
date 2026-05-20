"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressConstellation } from '@/components/Onboarding/ProgressConstellation';
import { EmpireIdentity } from '@/components/Onboarding/EmpireIdentity';
import { PlatformMatrix } from '@/components/Onboarding/PlatformMatrix';
import { ConsultantToolkit } from '@/components/Onboarding/ConsultantToolkit';
import { AutomationCalibration } from '@/components/Onboarding/AutomationCalibration';

const steps = [
  { id: 1, title: 'Identity' },
  { id: 2, title: 'Matrix' },
  { id: 3, title: 'Toolkit' },
  { id: 4, title: 'Calibration' },
];

const platforms = [
  { id: 'tiktok', name: 'TikTok Shop' },
  { id: 'etsy', name: 'Etsy' },
  { id: 'shopify', name: 'Shopify' },
  { id: 'amazon', name: 'Amazon Seller' },
  { id: 'pinterest', name: 'Pinterest' },
];

import { API_URL } from '@/lib/config';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    niche: '',
    angle: '',
    connectedPlatforms: [] as string[],
    automationMode: 'co-pilot' as 'co-pilot' | 'empire',
  });

  const [isActivating, setIsActivating] = useState(false);
  const { completeOnboarding, setActiveEmpireId } = useEmpire();

  const updateData = (updates: any) => setData(prev => ({ ...prev, ...updates }));

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleActivate = async () => {
    setIsActivating(true);
    
    try {
      // Initialize the empire in the database
      const response = await fetch(`${API_URL}/api/agent/initialize`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token'
        },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000', // Root owner placeholder
          name: data.name,
          niche: data.niche,
          angle: data.angle,
          automationMode: data.automationMode
        }),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setActiveEmpireId(result.empire.id);
        completeOnboarding();
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3000);
      }
    } catch (error) {
      console.error('Error during activation:', error);
      // Fallback for demo
      completeOnboarding();
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    }
  };

  if (isActivating) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Neural Network Background (Simulated with SVG) */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-12"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-[40px] border-4 border-blue-500/30 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-[32px] border-4 border-blue-500/50 flex items-center justify-center">
                <Zap className="w-12 h-12 text-blue-500 fill-current" />
              </div>
            </motion.div>
            
            {/* Pulsing Glow */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500 blur-[60px] -z-10"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">Initialising Empire.</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-blue-400 font-black tracking-widest text-xs uppercase">Neural Sync in Progress</p>
            </div>
          </div>

          <div className="max-w-xs mx-auto space-y-2">
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Platform Matrix</span>
              <span>100% Sync</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Data Nodes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full"
            animate={{
              x: [Math.random() * 1000, Math.random() * 1000],
              y: [Math.random() * 1000, Math.random() * 1000],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    );
  }

  const handleConnect = (id: string) => {
    if (!data.connectedPlatforms.includes(id)) {
      updateData({ connectedPlatforms: [...data.connectedPlatforms, id] });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Persistent AI Thought Sidebar (Thin) */}
      <div className="fixed left-0 top-0 bottom-0 w-1 bg-slate-100 hidden lg:block z-[70]" />
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden lg:flex items-center gap-4 z-[70]">
        <Sparkles className="w-4 h-4 text-blue-600 rotate-90" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">
          Consultant Status: <span className="text-slate-900">{currentStep === 1 ? "Analyzing Potential" : currentStep === 2 ? "Mapping Infrastructure" : "Optimizing Growth"}</span>
        </span>
      </div>

      <div className="w-full max-w-5xl px-8 py-12 lg:py-16 flex flex-col">
        <ProgressConstellation currentStep={currentStep} totalSteps={steps.length} />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <EmpireIdentity data={data} updateData={updateData} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PlatformMatrix 
                  connectedPlatforms={data.connectedPlatforms} 
                  onConnect={handleConnect} 
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ConsultantToolkit businessAngle={data.angle} />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AutomationCalibration 
                  mode={data.automationMode} 
                  onModeChange={(mode) => updateData({ automationMode: mode })} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-20 flex justify-between items-center max-w-3xl mx-auto w-full">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-0",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Phase
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 group"
            >
              Continue Expansion
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 group disabled:opacity-50"
            >
              {isActivating ? "Establishing Neural Sync..." : "Activate Empire"}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
