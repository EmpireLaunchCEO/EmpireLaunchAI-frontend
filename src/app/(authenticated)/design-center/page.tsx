"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignCenterHub } from '@/components/EmpireMode/DesignCenterHub';
import { CreativeBlueprint } from '@/components/EmpireMode/CreativeBlueprint';
import { DesignTask } from '@/lib/api-service';
import { Palette as PaletteIcon, ChevronLeft, Bot, Stars, Zap } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';

export default function DesignCenterPage() {
  const [activeTask, setActiveTask] = useState<DesignTask | null>(null);
  const { addToast } = useEmpire();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    addToast({ title: 'Creative Sync', message: 'Design assets and blueprints refreshed.', type: 'success' });
  };

  return (
    <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <PaletteIcon className="w-3 h-3" />
            Design Center <span className="ml-2 opacity-50">v4.2.3</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Creative Engine.
            </h1>
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <Zap className={cn("w-5 h-5 text-primary", isLoading && "animate-pulse")} />
            </button>
          </div>
          <p className="text-sm md:text-base text-theme-background0 font-medium">
            Execute manual creative tasks with AI-generated strategic blueprints.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl border border-indigo-100 font-bold text-sm shadow-sm">
              <Bot className="w-4 h-4" />
              Creative Assistant: Ready
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!activeTask ? (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DesignCenterHub onSelectTask={setActiveTask} />
          </motion.div>
        ) : (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-8">
               <button 
                 onClick={() => setActiveTask(null)}
                 className="flex items-center gap-2 text-slate-400 hover:text-foreground transition-colors font-bold text-sm uppercase tracking-widest"
               >
                 <ChevronLeft className="w-4 h-4" />
                 Back to Hub
               </button>
            </div>
            <CreativeBlueprint task={activeTask} onClose={() => setActiveTask(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
