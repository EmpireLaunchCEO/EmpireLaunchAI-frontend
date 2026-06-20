"use client";

import React, { useState } from 'react';
import { Stars, Send, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function EmpireAIChatBox({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "What can I help you with?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm analyzing your empire's data. I'll have a strategic recommendation ready shortly. What specific area would you like to optimize first?" 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={cn(
      "bg-theme-surface border-2 border-theme rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[400px] relative group transition-all hover:border-white/30",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-theme bg-theme-background/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Stars className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="font-black text-foreground uppercase tracking-tight italic">Empire AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Link Online</span>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'user' ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className={cn(
              "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-slate-950 rounded-tr-none" 
                : "bg-theme-background border border-theme text-foreground rounded-tl-none shadow-sm"
            )}>
              {msg.content}
            </div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 px-1">
              {msg.role === 'user' ? 'YOU' : 'EMPIRE AI'}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="bg-theme-background border border-theme px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-theme-background/30 border-t border-theme">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What can I help you with?"
            className="w-full bg-theme-surface border border-theme rounded-2xl px-5 py-4 text-xs font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-500 pr-14"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary text-slate-950 flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
