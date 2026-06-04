"use client";

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ExternalLink,
  Copy,
  Check,
  Stars,
  ShieldCheck,
  Scissors,
  Palette,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Bot,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { creativeService, CreativeBlueprintData, DesignTask } from '@/lib/api-service';
import { VaultInjected } from '@/components/VaultInjected';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { VisualVariationSelector } from './VisualVariationSelector';
import { CopyPastePowerTool } from './CopyPastePowerTool';
import { ValidationGate } from './Gates/ValidationGate';

interface CreativeBlueprintProps {
  task: DesignTask;
  onClose: () => void;
}

export function CreativeBlueprint({ task, onClose }: CreativeBlueprintProps) {
  const [loading, setLoading] = useState(true);
  const [blueprint, setBlueprint] = useState<CreativeBlueprintData | null>(null);
  const [step, setStep] = useState<'variation' | 'blueprint' | 'power_tool' | 'validation'>('variation');
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

      useEffect(() => {
    async function loadData() {
      const data = await creativeService.getBlueprint(task.id);
      setBlueprint(data);
      setLoading(false);

      // If task is already in 'editing' or 'drafting', skip variation selection
      if (task.status === 'editing') {
        setStep('blueprint');
      }
    }
    loadData();
  }, [task.id, task.status]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <BrandedGlobe size="sm" animate={true} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Consulting Market Intelligence...</p>
      </div>
    );
  }

  if (!blueprint) return null;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {step === 'variation' && (
          <motion.div
            key="variation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <VisualVariationSelector
              variations={blueprint.variations}
              selectedId={selectedVariation}
              onSelect={setSelectedVariation}
              onConfirm={() => setStep('blueprint')}
            />
          </motion.div>
        )}

        {(step === 'blueprint' || step === 'power_tool') && (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12 pb-20"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    <Stars className="w-3 h-3" />
                    Creative Direction
                    <VaultInjected />
                 </div>
                 <h1 className="text-4xl font-black text-foreground tracking-tight italic">{task.title}.</h1>
                 <p className="text-muted-foreground font-medium italic">Strategic blueprint for {task.platform} execution.</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">AI Identity Sync</span>
                    <span className="text-xs font-bold text-foreground">Secure Protocol v4.2</span>
                 </div>
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Bot className="w-6 h-6" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                 {/* Design Intelligence */}
                 <div className="bg-primary rounded-[40px] p-8 text-slate-900 relative overflow-hidden shadow-2xl shadow-amber-900/20">
                    <div className="relative z-10 space-y-4">
                       <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-slate-900/60" />
                          <h4 className="font-black uppercase tracking-widest text-[10px]">Strategic Rationale</h4>
                       </div>
                       <p className="text-lg font-bold leading-tight italic">
                         "{blueprint.intelligence}"
                       </p>
                       <div className="pt-4 flex items-center gap-6 border-t border-slate-900/10">
                          <div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900/60 block mb-1">Probability</span>
                             <span className="text-xl font-black italic">84.2%</span>
                          </div>
                          <div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900/60 block mb-1">Niche Lift</span>
                             <span className="text-xl font-black italic">+14%</span>
                          </div>
                       </div>
                    </div>
                    <Stars className="absolute -right-4 -bottom-4 w-48 h-48 text-slate-900 opacity-5 rotate-12" />
                 </div>

                 {/* Visual DNA */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6 shadow-sm">
                       <div className="flex items-center gap-2">
                          <Palette className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Color DNA</h4>
                       </div>
                       <div className="flex items-center gap-3">
                          {blueprint.palette.map((color) => (
                            <button
                              key={color}
                              onClick={() => handleCopy(color, color)}
                              className="group relative"
                            >
                               <div
                                 className="w-12 h-12 rounded-2xl border-2 border-theme shadow-sm transition-transform group-hover:scale-110"
                                 style={{ backgroundColor: color }}
                               />
                               <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  <span className="text-[8px] font-black text-slate-400">{color}</span>
                               </div>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6 shadow-sm">
                       <div className="flex items-center gap-2">
                          <Layout className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Font Pairings</h4>
                       </div>
                       <div className="space-y-3">
                          {blueprint.fonts.map((f) => (
                            <div key={f.platform} className="flex justify-between items-center p-3 bg-theme-background rounded-2xl border border-theme">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.platform}</span>
                               <span className="text-xs font-bold text-foreground">{f.pairing}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Composition Guide */}
                 <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2">
                       <Scissors className="w-5 h-5 text-primary" />
                       <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Composition Guide</h4>
                    </div>
                    <div className="relative aspect-[21/9] bg-slate-900 rounded-3xl overflow-hidden border border-white/5">
                       <img
                         src={blueprint.compositionUrl}
                         className="w-full h-full object-cover opacity-30 grayscale"
                         alt="Composition Wireframe"
                       />
                       <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                          <p className="text-xs font-bold text-slate-400 max-w-xs">
                             Wireframe overlay of the high-converting layout. Place your elements according to this balance.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 {/* Launch Platform */}
                 <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 shadow-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center shadow-xl shadow-amber-900/20">
                          {task.platform === 'Kittl' ? <Palette className="w-8 h-8 text-slate-900" /> : <Scissors className="w-8 h-8 text-slate-900" />}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Execution Link</p>
                          <h4 className="font-black text-white italic">{task.platform} Engine</h4>
                       </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                       "Launch {task.platform} to begin. I'll stay pinned to your screen with the Copy-Paste Power Tool."
                    </p>

                    <button
                      onClick={() => setStep('power_tool')}
                      className="w-full py-5 bg-primary text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-3 group"
                    >
                       Start Designing
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="pt-6 border-t border-white/5">
                       <div className="flex items-center gap-2 text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Anti-Copycat Verified</span>
                       </div>
                    </div>
                 </div>

                 {/* Tips Card */}
                 <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                       <Stars className="w-4 h-4 text-amber-500" />
                       <h4 className="font-black text-foreground uppercase tracking-widest text-xs">AI Tip</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                       "In {task.platform}, try using the 'Fine Detail' brush for the botanical lines. It mirrors the top-performing listing's aesthetic."
                    </p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 'power_tool' && (
        <CopyPastePowerTool
          blueprint={blueprint}
          platform={task.platform}
          platformLink={blueprint.platformLink}
          onComplete={() => setStep('validation')}
        />
      )}

      {step === 'validation' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ValidationGate
            taskTitle={task.title}
            platform={task.platform}
            onValidated={(url) => {
              console.log('Validated asset:', url);
              onClose();
            }}
            onCancel={() => setStep('blueprint')}
          />
        </motion.div>
      )}
    </div>
  );
}
