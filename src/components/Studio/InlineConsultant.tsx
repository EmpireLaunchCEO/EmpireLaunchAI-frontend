"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, User, Bot, Loader2, Wand2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/config';

const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) { token = crypto.randomUUID(); localStorage.setItem('empire_auth_token', token); }
    return `Bearer ${token}`;
  }
  return 'Bearer ';
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InlineConsultantProps {
  context: 'video' | 'editor' | 'faceless' | 'design' | 'neural-twin';
  initialMessage?: string;
  className?: string;
  idea?: string;
  onGenerate?: (finalIdea: string) => void;
  isParentGenerating?: boolean;
  empireContext?: { niche?: string; angle?: string; targetCustomers?: string; businessGoals?: string };
}

export function InlineConsultant({ context, initialMessage, className, idea, onGenerate, isParentGenerating, empireContext }: InlineConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastIdea, setLastIdea] = useState('');
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset local generating state when parent's pipeline finishes
  const prevParentGenerating = useRef(isParentGenerating);
  useEffect(() => {
    if (prevParentGenerating.current && !isParentGenerating) {
      setIsGenerating(false);
    }
    prevParentGenerating.current = isParentGenerating;
  }, [isParentGenerating]);

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    } else {
      // Default initial messages based on context
      const defaults: Record<string, string> = {
        video: "Let's design your video together. What visuals are you imagining? Tell me about backgrounds, effects (sparkles, transitions, overlays), color schemes, and any specific elements you want. I'll refine the script around your vision.",
        editor: "Upload your clips and tell me how you want it to look. Any specific background style, effects, or on-screen graphics? Should I prioritize fast cuts or cinematic transitions?",
        faceless: "What niche should we dominate? Describe the vibe — backgrounds, motion graphics, overlays, text styles. I'll pull trending footage and build the visuals around your preferences.",
        design: "Describe your product vision in detail — colors, materials, backgrounds, sparkles or effects, layout style. I'll cross-reference it with current market-winning DNA and suggest refinements.",
        'neural-twin': "Once your photo is uploaded, I can script your twin. What's the main goal? Also, what background setting, effects, or visual style do you want for the video?"
      };
      setMessages([{ role: 'assistant', content: defaults[context] || defaults.video }]);
    }
  }, [context, initialMessage]);

  // When a new idea is shared from the parent (Enter pressed in textarea), send it to the AI
  useEffect(() => {
    if (idea && idea !== lastIdea && idea.trim()) {
      setLastIdea(idea);
      
      // Auto-send the idea to the AI consultant for review
      const sendIdeaToConsultant = async () => {
        setMessages(prev => [...prev, { role: 'user', content: `Here's my video idea: ${idea}` }]);
        setIsTyping(true);
        
        try {
          const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : null;
          const brandId = typeof window !== 'undefined' ? localStorage.getItem('empire_brandId') : null;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const response = await fetch(`${API_URL}/api/studio/process`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': getAuthHeader(),
              ...(userId ? { 'x-user-id': userId } : {})
            },
            body: JSON.stringify({
              request: `My video idea: ${idea}`,
              brandId: brandId || undefined,
              conversationHistory: [{ role: 'user' as const, content: `My video idea: ${idea}` }],
              mode: 'consult'
            }),
            signal: controller.signal
          });
          clearTimeout(timeout);

          if (!response.ok) {
            let errorMsg = 'Failed to consult AI';
            try {
              const errData = await response.json();
              errorMsg = errData.response || errData.error || errorMsg;
            } catch {}
            throw new Error(errorMsg);
          }
          const data = await response.json();
          
          if (data.status === 'completed') {
            setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Generation complete!' }]);
            setReadyToGenerate(true);
            // User must explicitly tap the wand — do NOT auto-trigger onGenerate
          } else if (data.status === 'error') {
            setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Something went wrong. Please try again.' }]);
          } else {
            // ai_response or needs_refinement
            setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || '' }]);
          }
        } catch (error) {
          console.error('Consultation error:', error);
          const isTimeout = error instanceof DOMException && error.name === 'AbortError';
          setMessages(prev => [...prev, { role: 'assistant', content: 
            isTimeout 
              ? 'AI is taking too long. Please try a simpler description or tap the wand to generate directly.'
              : (error instanceof Error ? error.message : 'Failed to consult AI.')
          }]);
        } finally {
          setIsTyping(false);
        }
      };
      
      sendIdeaToConsultant();
    }
  }, [idea, context, lastIdea]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Once conversation has started (≥2 messages), user can generate anytime
  const canGenerate = messages.length >= 2 && !!onGenerate;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : null;
      const brandId = typeof window !== 'undefined' ? localStorage.getItem('empire_brandId') : null;
      const conversationHistory = updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(`${API_URL}/api/studio/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          ...(userId ? { 'x-user-id': userId } : {})
        },
        body: JSON.stringify({ 
          request: userMessage,
          brandId: brandId || undefined,
          conversationHistory,
          mode: 'consult'
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!response.ok) {
        let errorMsg = 'Failed to consult AI';
        try {
          const errData = await response.json();
          errorMsg = errData.response || errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      
      if (data.status === 'completed') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Generation complete!' }]);
        setReadyToGenerate(true);
        // User must explicitly tap the wand — do NOT auto-trigger onGenerate
      } else if (data.status === 'error') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Something went wrong. Please try again.' }]);
      } else {
        // ai_response or needs_refinement
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || '' }]);
      }
    } catch (error) {
      console.error('Consultation error:', error);
      const isTimeout = error instanceof DOMException && error.name === 'AbortError';
      const isNetworkError = !isTimeout && (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch')));
      setMessages(prev => [...prev, { role: 'assistant', content: 
        isTimeout
          ? 'AI is taking too long. Please try a simpler description or tap the wand to generate directly.'
          : isNetworkError
          ? "I'm having trouble connecting to the Neural Link. Please try again."
          : (error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerate = () => {
    if (onGenerate && !isGenerating) {
      setIsGenerating(true);
      const conversationSummary = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => m.content)
        .join(' ');
      onGenerate(conversationSummary || idea || '');
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-theme-background/40 border border-theme rounded-2xl overflow-hidden transition-all",
      className
    )}>
      {/* Mini Header */}
      <div className="px-2 py-1.5 border-b border-theme bg-theme-background/60 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-slate-400" />
          <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Consultant: {context.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-0.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[6px] font-bold text-emerald-500/70 uppercase">Online</span>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 min-h-[120px] max-h-[280px] overflow-y-auto p-3 space-y-2 no-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-1.5",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-lg flex items-center justify-center shrink-0 border border-theme",
                msg.role === 'user' ? "bg-white/10" : "bg-slate-500/10"
              )}>
                {msg.role === 'user' ? <User className="w-2 h-2 text-white" /> : <Bot className="w-2 h-2 text-slate-400" />}
              </div>
              <div className={cn(
                "px-2.5 py-2 rounded-xl text-xs leading-relaxed max-w-[85%]",
                msg.role === 'user' 
                  ? "bg-white text-slate-950 rounded-tr-none font-medium" 
                  : "bg-theme-surface border border-theme text-slate-300 rounded-tl-none italic"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-start gap-1.5">
            <div className="w-4 h-4 rounded-lg bg-slate-500/10 flex items-center justify-center border border-theme">
              <Bot className="w-2 h-2 text-slate-400" />
            </div>
            <div className="px-2 py-1.5 rounded-xl bg-theme-surface border border-theme">
              <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
            </div>
          </div>
        )}

      </div>

      {/* Mini Input + Generate */}
      <form onSubmit={handleSend} className="p-1.5 border-t border-theme bg-theme-background/40">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={canGenerate ? "Type to refine, or tap the wand..." : "Ask..."}
            className="flex-1 bg-theme-surface/50 border border-theme rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-white/40 transition-all placeholder:text-slate-600"
          />
          {/* Wand — appears once conversation started */}
          {canGenerate && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isTyping || isGenerating}
              className={cn(
                "w-8 h-8 rounded-lg bg-primary text-slate-950 flex items-center justify-center shrink-0 transition-all",
                isGenerating && "opacity-50 scale-90",
                !isGenerating && readyToGenerate && "animate-pulse ring-2 ring-primary/50"
              )}
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            </button>
          )}
          {/* Send — always present */}
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 hover:bg-white/20 transition-all disabled:opacity-30"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

      {/* Hint bar */}
      {!isTyping && messages.length >= 1 && (
        <div className="flex items-center gap-1.5 px-2 py-1 mx-1.5 mb-1.5 rounded-lg bg-primary/5 border border-primary/10">
          <ArrowDown className="w-2.5 h-2.5 text-primary" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
            {readyToGenerate ? "Ready — tap the wand!" : canGenerate ? "Tap the wand when ready, or keep chatting" : "Chat with the AI to refine your idea"}
          </span>
        </div>
      )}
    </div>
  );
}