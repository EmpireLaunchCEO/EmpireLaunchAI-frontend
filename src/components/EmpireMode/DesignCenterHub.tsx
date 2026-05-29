"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Scissors,
  Layout,
  ExternalLink,
  Clock,
  CheckCircle2,
  Plus,
  Bot,
  Zap,
  ChevronRight,
  Stars
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { creativeService, DesignTask } from '@/lib/api-service';

interface DesignCenterHubProps {
  onSelectTask: (task: DesignTask) => void;
}

export function DesignCenterHub({ onSelectTask }: DesignCenterHubProps) {
  const [tasks, setTasks] = useState<DesignTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      const data = await creativeService.getDesignTasks();
      setTasks(data);
      setLoading(false);
    }
    loadTasks();
  }, []);

  const getStatusColor = (status: DesignTask['status']) => {
    switch (status) {
      case 'blueprint_ready': return 'bg-primary/10 text-primary border-primary/20';
      case 'editing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'review_required': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  const getPlatformIcon = (platform: DesignTask['platform']) => {
    switch (platform) {
      case 'Kittl': return <Palette className="w-5 h-5" />;
      case 'CapCut': return <Scissors className="w-5 h-5" />;
      case 'Canva': return <Layout className="w-5 h-5" />;
      case 'Fiverr': return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Platform Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Kittl', icon: Palette, color: 'text-primary', bg: 'bg-primary/10', link: 'https://www.kittl.com' },
          { name: 'CapCut', icon: Scissors, color: 'text-foreground', bg: 'bg-slate-800', link: 'https://www.capcut.com' },
          { name: 'Canva', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-500/10', link: 'https://www.canva.com' },
        ].map((p) => (
          <a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-8 bg-theme-surface border-2 border-theme rounded-[40px] hover:border-primary transition-all group shadow-sm flex flex-col items-center text-center space-y-4"
          >
            <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", p.bg)}>
              <p.icon className={cn("w-8 h-8", p.color)} />
            </div>
            <div>
              <h3 className="font-black text-foreground">{p.name} Launchpad</h3>
              <p className="text-xs text-slate-400 font-medium">Open manual creative tool</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        ))}
      </div>

      {/* Creative Queue */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg border border-white/10">
                 <Layout className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-foreground tracking-tight uppercase italic">Creative Queue.</h2>
           </div>
           <button className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
             Sync External Tools
           </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {loading ? (
             <div className="p-12 flex justify-center">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
           ) : tasks.map((task) => (
             <motion.button
               key={task.id}
               onClick={() => onSelectTask(task)}
               whileHover={{ x: 8 }}
               className="p-6 bg-theme-surface border-2 border-theme rounded-[32px] shadow-sm flex items-center justify-between group text-left"
             >
               <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                    task.platform === 'Kittl' ? 'bg-primary/10 text-primary' :
                    task.platform === 'CapCut' ? 'bg-slate-800 text-foreground' : 'bg-amber-500/10 text-amber-500'
                  )}>
                     {getPlatformIcon(task.platform)}
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.platform} Task</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
                          getStatusColor(task.status)
                        )}>
                          {task.status.replace('_', ' ')}
                        </span>
                     </div>
                     <h4 className="text-lg font-bold text-foreground">{task.title}</h4>
                  </div>
               </div>

               <div className="flex items-center gap-8">
                  <div className="text-right hidden md:block">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Timeline</p>
                     <div className="flex items-center gap-1.5 text-foreground font-bold text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {task.dueDate}
                     </div>
                  </div>
                  <div className="p-4 bg-theme-background rounded-2xl group-hover:bg-primary group-hover:text-slate-900 transition-all shadow-sm">
                     <ChevronRight className="w-5 h-5" />
                  </div>
               </div>
             </motion.button>
           ))}
        </div>
      </div>

      {/* AI Strategy Note */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-primary/20">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-primary">Manual Assistance Engine</span>
               </div>
               <h3 className="text-3xl font-black leading-tight italic">Building on non-API platforms?</h3>
               <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  I can't directly "click" for you in Kittl or CapCut yet, but I've prepared full strategic blueprints for every task. Open a task to see my color recommendations, font pairings, and high-conversion scripts.
               </p>
               <div className="flex gap-4">
                  <button className="px-8 py-4 bg-primary text-slate-900 rounded-[20px] font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                     How it works
                  </button>
               </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl hidden lg:block bg-slate-900">
               <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <Stars className="w-24 h-24 text-primary opacity-20 animate-pulse" />
               </div>
            </div>
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
