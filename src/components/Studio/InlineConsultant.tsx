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
}

export function InlineConsultant({ context, initialMessage, className, idea, onGenerate }: InlineConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastIdea, setLastIdea] = useState('');
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          const response = await fetch(`${API_URL}/api/studio/chat`, {
            method: 'POST',
            headers: {
                          'Content-Type': 'application/json',
                          'Authorization': getAuthHeader(),
                          ...(userId ? { 'x-user-id': userId } : {})
                        },
                        body: JSON.stringify({
                          message: `You're a creative director helping someone brainstorm a short-form ${context === 'design' ? 'design' : 'video'}. Their idea: "${idea}". Have a natural conversation — acknowledge what they shared, offer creative input based on what performs well on social media, and help them refine their vision. Be yourself.`
            })
          });

          if (!response.ok) throw new Error('Failed to consult AI');
          const data = await response.json();
          setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
          // Detect if AI is signaling readiness
          if (/ready|go ahead|let'?s create|shall we|sound(s)? good/i.test(data.message)) {
            setReadyToGenerate(true);
          }
        } catch (error) {
          console.error('Consultation error:', error);
          setMessages(prev => [...prev, { role: 'assistant', content: "Great concept! What kind of visual vibe are you going for — bold and energetic, or clean and cinematic? Any specific colors you have in mind?" }]);
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
      
      // Build conversation history from last 6 messages (3 exchanges)
      const recentMessages = updatedMessages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
      
      const response = await fetch(`${API_URL}/api/studio/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          ...(userId ? { 'x-user-id': userId } : {})
        },
        body: JSON.stringify({ 
          message: `You're a creative director helping with short-form content. Be conversational and helpful — offer creative direction, ask questions when you need clarity, and guide them toward a great final concept.\n\nConversation so far:\n${recentMessages}\n\nUser's latest message: ${userMessage}`
        })
      });

      if (!response.ok) throw new Error('Failed to consult AI');
      const data = await response.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      // Detect if AI is signaling readiness
      if (/ready|go ahead|let'?s create|shall we|sound(s)? good/i.test(data.message)) {
        setReadyToGenerate(true);
      }
    } catch (error) {
      console.error('Consultation error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the Neural Link. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerate = () => {
    if (onGenerate) {
      // Build the final concept from the full conversation, not just the initial idea
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
        className="flex-1 min-h-[60px] max-h-[100px] overflow-y-auto p-2 space-y-2 no-scrollbar"
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
                "px-2 py-1.5 rounded-xl text-[9px] leading-relaxed max-w-[85%]",
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

        {/* Reply hint — always visible after conversation starts */}
        {!isTyping && messages.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/5 border border-primary/10"
          >
            <ArrowDown className="w-2.5 h-2.5 text-primary" />
            <span className="text-[7px] font-bold text-primary uppercase tracking-widest">
              {readyToGenerate ? "Ready to create — hit Generate!" : "Refine your idea, then hit Generate"}
            </span>
          </motion.div>
        )}

        {/* Generate Button — always visible below the conversation */}
        {onGenerate && messages.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-1"
          >
            <button
              onClick={handleGenerate}
              className={cn(
                "w-full py-2 bg-primary text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20",
                readyToGenerate && "animate-pulse ring-2 ring-primary/50"
              )}
            >
              <Wand2 className="w-3 h-3" />
              Generate {context === 'design' ? 'Design' : 'Video'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Mini Input */}
      <form onSubmit={handleSend} className="p-1.5 border-t border-theme bg-theme-background/40">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask..."
            className="w-full bg-theme-surface/50 border border-theme rounded-xl px-2 py-1.5 text-[9px] focus:outline-none focus:border-white/40 transition-all placeholder:text-slate-600 pr-9"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30"
          >
            <Send className="w-2.5 h-2.5" />
          </button>
        </div>
      </form>
    </div>
  );
}