"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InlineConsultantProps {
  context: 'video' | 'editor' | 'faceless' | 'design' | 'neural-twin';
  initialMessage?: string;
  className?: string;
}

export function InlineConsultant({ context, initialMessage, className }: InlineConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    } else {
      // Default initial messages based on context
      const defaults = {
        video: "I'm ready to storyboard your video. Any specific tone or visual style you're aiming for?",
        editor: "Upload your clips and I'll start the synthesis. Should I prioritize fast cuts or cinematic transitions?",
        faceless: "What niche should we dominate today? I can pull trending stock footage for almost anything.",
        design: "Describe your product vision. I'll cross-reference it with current market-winning DNA.",
        'neural-twin': "Once your photo is uploaded, I can script your twin. What's the main goal of this video?"
      };
      setMessages([{ role: 'assistant', content: defaults[context] }]);
    }
  }, [context, initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/studio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `[CONTEXT: ${context}] ${userMessage}` 
        })
      });

      if (!response.ok) throw new Error('Failed to consult AI');
      const data = await response.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Consultation error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the Neural Link. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-theme-background/40 border border-theme rounded-2xl overflow-hidden transition-all",
      className
    )}>
      {/* Mini Header */}
      <div className="px-3 py-2 border-b border-theme bg-theme-background/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Consultant: {context.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[7px] font-bold text-emerald-500/70 uppercase">Online</span>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 min-h-[80px] max-h-[160px] overflow-y-auto p-3 space-y-3 no-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-2",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border border-theme",
                msg.role === 'user' ? "bg-primary/10" : "bg-slate-500/10"
              )}>
                {msg.role === 'user' ? <User className="w-2.5 h-2.5 text-primary" /> : <Bot className="w-2.5 h-2.5 text-slate-400" />}
              </div>
              <div className={cn(
                "px-3 py-2 rounded-xl text-[10px] leading-relaxed max-w-[85%]",
                msg.role === 'user' 
                  ? "bg-primary text-slate-950 rounded-tr-none font-medium" 
                  : "bg-theme-surface border border-theme text-slate-300 rounded-tl-none italic"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-lg bg-slate-500/10 flex items-center justify-center border border-theme">
              <Bot className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <div className="px-3 py-2 rounded-xl bg-theme-surface border border-theme">
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Mini Input */}
      <form onSubmit={handleSend} className="p-2 border-t border-theme bg-theme-background/40">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your consultant..."
            className="w-full bg-theme-surface/50 border border-theme rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-primary/40 transition-all placeholder:text-slate-600 pr-10"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all disabled:opacity-30"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
