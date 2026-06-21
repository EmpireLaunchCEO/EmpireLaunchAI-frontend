"use client";
import { cn } from "@/lib/utils";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, Check, ExternalLink, Bot, User, Zap, Trash2, Info, ChevronRight } from 'lucide-react';
import { retentionService, InboxDraft } from '@/lib/api-service';

import { useEmpire } from '@/lib/EmpireContext';

export const InboxAssistant = () => {
  const [drafts, setDrafts] = useState<InboxDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { autoSendRetention, setAutoSendRetention } = useEmpire();

  useEffect(() => {
    const loadDrafts = async () => {
      const data = await retentionService.getInboxDrafts();
      setDrafts(data);
      setLoading(false);
    };
    loadDrafts();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDecision = async (id: string, status: 'approved' | 'rejected') => {
    await retentionService.respondToDraft(id, status);
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center bg-theme-surface rounded-[40px] border border-theme animate-pulse" />;
  }

  if (drafts.length === 0 && !loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Inbox Assistant</h3>
        </div>

        <div className="flex items-center gap-3 bg-theme-surface border border-theme p-1.5 rounded-2xl shadow-sm">
           <div className="flex items-center gap-2 px-2">
              <Zap className={cn("w-3.5 h-3.5", autoSendRetention ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Auto-Send</span>
           </div>
           <button
             onClick={() => setAutoSendRetention(!autoSendRetention)}
             className={cn(
               "w-10 h-6 rounded-full relative transition-colors duration-300",
               autoSendRetention ? "bg-amber-500" : "bg-theme-background border border-theme"
             )}
           >
             <motion.div
               animate={{ x: autoSendRetention ? 18 : 2 }}
               className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
             />
           </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {drafts.map((draft) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-theme-surface rounded-[32px] p-6 border border-theme shadow-sm space-y-4 group relative overflow-hidden"
            >
              {/* Type Badge */}
              <div className="absolute top-0 right-0">
                 <div className={cn(
                   "px-4 py-1.5 rounded-bl-[16px] text-[8px] font-black uppercase tracking-[0.2em] text-white",
                   draft.type === 'THANK_YOU' ? "bg-emerald-500" : "bg-blue-600"
                 )}>
                   {draft.type.replace('_', ' ')}
                 </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-theme-background flex items-center justify-center border border-theme">
                     <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground leading-tight">{draft.customer}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{draft.platform} Order</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <h5 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Draft Message</h5>
                   <div className="flex items-center gap-1.5 text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <Bot className="w-3 h-3" />
                      AI Calibrated
                   </div>
                </div>

                <div className="p-4 rounded-2xl bg-theme-background border border-theme relative group/body hover:border-white/30 transition-colors">
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    <span className="text-muted-foreground font-bold">Subject:</span> {draft.subject}
                    <br /><br />
                    {draft.body}
                  </p>
                  <button
                    onClick={() => handleCopy(`${draft.subject}\n\n${draft.body}`, draft.id)}
                    className="absolute top-4 right-4 p-2 bg-theme-surface rounded-lg border border-theme shadow-sm opacity-0 group-hover/body:opacity-100 transition-opacity hover:bg-primary/10 hover:border-white/20"
                  >
                    {copiedId === draft.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-muted-foreground leading-relaxed italic">
                  <span className="text-primary font-black uppercase mr-1">AI Reasoning:</span>
                  {draft.reasoning}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDecision(draft.id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-foreground py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  Approve & Send <ChevronRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDecision(draft.id, 'rejected')}
                  className="p-3 rounded-xl bg-theme-background text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border border-theme transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
