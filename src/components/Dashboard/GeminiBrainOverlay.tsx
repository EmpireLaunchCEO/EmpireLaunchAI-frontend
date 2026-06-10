"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, MicOff, Stars, Bot, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';

export function GeminiBrainOverlay() {
  const { isProtocolAccepted, addNote } = useEmpire();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: "I am your Neural Brain. Ask me anything about your Empire, or give me a task to execute." }
  ]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handlePointerDown = () => {
    // Start 2 second timer to unlock dragging
    holdTimerRef.current = setTimeout(() => {
      setIsDraggable(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 2000);
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    // Note: We don't reset isDraggable here immediately to allow the drag to finish
    // isDraggable will be reset on dragEnd
  };

  const toggleChat = () => {
    // Only toggle if we weren't just dragging
    if (!isDraggable) {
      setIsOpen(!isOpen);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || isProcessing) return;

    const userQuery = value.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setValue('');

    if (!isProtocolAccepted) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: "Protocol Restriction: I cannot execute tasks or perform autonomous research until the Success-Share Agreement is accepted on your Dashboard. Please finalize that handshake so we can begin." 
        }]);
      }, 1000);
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI Intelligence
    setTimeout(() => {
      let response = "Understood. I am processing that neural request now.";
      
      if (userQuery.toLowerCase().includes('note')) {
        const note = userQuery.replace(/note/i, '').trim();
        addNote(note || "User provided a neural update via Brain Overlay.");
        response = "I've archived that in your Neural Notes. Anything else?";
      } else if (userQuery.toLowerCase().includes('status')) {
        response = "All systems are nominal. Your Empire is scaling across linked nodes.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsProcessing(false);
    }, 1500);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      {/* Floating Action Button (Neural Brain) - Movable on 2s Hold */}
      <motion.div 
        drag={isDraggable}
        dragMomentum={false}
        onDragEnd={() => {
          setIsDraggable(false);
        }}
        className="fixed z-[9999]"
        style={{ 
          top: dragPosition.y || '50%', 
          right: 24,
          translateY: dragPosition.y ? 0 : '-50%'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={toggleChat}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500",
            isOpen ? "bg-slate-900 border-2 border-primary" : "bg-primary border-4 border-white/20",
            isDraggable && "ring-4 ring-white animate-pulse scale-110"
          )}
        >
          {isOpen ? (
            <X className="w-8 h-8 text-primary relative z-10" />
          ) : (
            <div className="relative w-10 h-10">
              <img 
                src="/neural-core.webp" 
                alt="Neural Brain" 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
              />
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white/30 blur-md rounded-full -z-10"
              />
            </div>
          )}
          
          {/* Pulsing Aura when processing */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.5, 0], scale: [1, 2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white rounded-full blur-xl"
            />
          )}
        </motion.button>
        
        {/* Unlock Hint */}
        {holdTimerRef.current && !isDraggable && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-tighter"
          >
            Hold to Move
          </motion.div>
        )}
      </motion.div>

      {/* Neural Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-48px)] sm:w-[400px] h-[600px] max-h-[70vh] bg-slate-950 border-4 border-white/10 rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.5)] z-[9998] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src="/neural-core.webp" 
                  alt="Neural Brain" 
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Neural Brain</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Intelligence Mode</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === 'ai' ? "items-start" : "items-end"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-3xl text-[11px] font-bold leading-relaxed",
                    msg.role === 'ai' 
                      ? "bg-slate-900 text-white border border-white/5 rounded-tl-none" 
                      : "bg-primary text-slate-950 rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <div className="flex gap-1.5 p-4 bg-slate-900 rounded-3xl rounded-tl-none w-20">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-slate-900/50 border-t border-white/5">
              {!isProtocolAccepted && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-tight">
                    Protocol Limited: Finish Success-Share Handshake to unlock.
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Neural query..."}
                  className="w-full bg-slate-800 border-2 border-white/5 rounded-2xl py-4 pl-5 pr-24 text-[10px] font-bold text-white placeholder:text-slate-500 focus:border-primary transition-all outline-none"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isListening ? "bg-red-500 text-white animate-pulse" : "hover:bg-white/5 text-slate-400"
                    )}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    type="submit"
                    disabled={!value.trim() || isProcessing}
                    className="p-2 rounded-xl bg-primary text-slate-950 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
