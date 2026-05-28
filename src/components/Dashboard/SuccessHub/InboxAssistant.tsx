"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, Check, ExternalLink, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Draft {
  id: string;
  platform: 'Fiverr' | 'Etsy';
  customer: string;
  subject: string;
  body: string;
  reasoning: string;
}

const MOCK_DRAFTS: Draft[] = [
  {
    id: 'd1',
    platform: 'Fiverr',
    customer: 'Alex Miller',
    subject: 'Order Acknowledgment',
    body: "Hi Alex! Thank you so much for your order. I've received your requirements and I'm starting on your Vintage Botanical Cover right away. I'll reach out if I have any questions. Looking forward to delivering something amazing!",
    reasoning: "New order detected. Prompt acknowledgment builds trust and improves seller rating."
  },
  {
    id: 'd2',
    platform: 'Etsy',
    customer: 'Sarah J.',
    subject: 'Personalized Thank You',
    body: "Hi Sarah, thank you for purchasing the Digital Zen Journal! I hope it helps you stay organized and calm. As a thank you, here's a 10% discount code for your next purchase: EMPIRE10. Enjoy!",
    reasoning: "Repeat customer potential identified. Offering a discount increases LTV (Life Time Value)."
  }
];

export const InboxAssistant = () => {
  const [drafts, setDrafts] = useState<Draft[]>(MOCK_DRAFTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDone = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  if (drafts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Inbox Assistant</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manual-Assisted Mode</span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {drafts.map((draft) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-theme-surface rounded-[32px] p-6 border-2 border-slate-50 shadow-sm space-y-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    draft.platform === 'Fiverr' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                  )}>
                    {draft.platform}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{draft.customer}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                   <Bot className="w-3.5 h-3.5 text-blue-500" />
                   AI Drafted
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black text-foreground">{draft.subject}</h4>
                <div className="p-5 rounded-2xl bg-theme-background border border-theme relative group/body">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {draft.body}
                  </p>
                  <button 
                    onClick={() => handleCopy(draft.body, draft.id)}
                    className="absolute top-3 right-3 p-2 bg-theme-surface rounded-xl border border-theme shadow-sm opacity-0 group-hover/body:opacity-100 transition-opacity hover:bg-blue-50 hover:border-blue-200"
                  >
                    {copiedId === draft.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-600 italic">
                  "Reasoning: {draft.reasoning}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.open(draft.platform === 'Fiverr' ? 'https://fiverr.com' : 'https://etsy.com', '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                >
                  Open {draft.platform} <ExternalLink className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleDone(draft.id)}
                  className="px-6 py-3 rounded-2xl bg-theme-background text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-theme"
                >
                  Mark as Sent
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
