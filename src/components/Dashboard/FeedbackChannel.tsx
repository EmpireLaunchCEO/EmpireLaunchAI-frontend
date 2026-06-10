"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackBoxProps {
  className?: string;
}

export function FeedbackBox({ className }: FeedbackBoxProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("FEEDBACK SUBMITTED:", message);
    
    setIsSubmitting(false);
    setIsSent(true);
    setMessage('');
    
    setTimeout(() => {
      setIsSent(false);
    }, 5000);
  };

  return (
    <div className={cn(
      "bg-theme-surface border-2 border-theme rounded-[32px] p-6 shadow-lg overflow-hidden relative group transition-all",
      className
    )}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-tight italic">Direct AI Counsel</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
               Do you want to keep track of something we don't have yet?
            </p>
          </div>
        </div>

        {isSent ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 text-center space-y-2"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-black text-foreground uppercase italic">Intelligence Received</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send us feedback..."
              className="w-full bg-theme-background border border-theme rounded-2xl p-4 text-xs font-medium outline-none focus:border-primary/50 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
              disabled={isSubmitting}
            />

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className={cn(
                "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10",
                isSubmitting || !message.trim() 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-primary text-white hover:scale-[1.02] active:scale-95"
              )}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  Transmit Feedback
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <Sparkles className="w-12 h-12 text-primary rotate-12" />
      </div>
    </div>
  );
}
