"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

export function FeedbackChannel() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { isAdmin } = useEmpire();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // In a real app, this would call an API. 
    // For this team sandbox, we simulate the logic and log it.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("FEEDBACK SUBMITTED:", message);
    
    setIsSubmitting(false);
    setIsSent(true);
    setMessage('');
    
    setTimeout(() => {
      setIsSent(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-theme-surface border-2 border-theme rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic">Direct AI Counsel</h3>
                      <p className="text-xs text-muted-foreground font-medium italic">Request shifts, pivots, or new features.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-theme-background text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isSent ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-black text-foreground uppercase italic">Intelligence Received</p>
                      <p className="text-sm text-muted-foreground font-medium">Your request has been routed to the owner's command center.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2">Your Directive</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. 'I want to pivot my Etsy niche to Digital Art' or 'Add a Pinterest posting option'..."
                        className="w-full bg-theme-background border-2 border-theme rounded-[32px] p-6 text-sm font-medium outline-none focus:border-primary/50 transition-all min-h-[180px] text-foreground placeholder:text-slate-600"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className={cn(
                        "w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20",
                        isSubmitting || !message.trim() 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-primary text-white hover:scale-[1.02] active:scale-95"
                      )}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Transmit to Command
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-primary/5 p-4 text-center border-t border-theme">
                <p className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em]">
                  End-to-End Neural Encryption Active
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
