"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  ShieldCheck,
  Zap,
  X,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { BrandedGlobe } from '@/components/BrandedGlobe';

type GateState = 'discovery' | 'barrier' | 'verification' | 'resumption' | 'success';

interface Thought {
  id: string;
  text: string;
  timestamp: number;
}

interface ApprovalGateProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  initialUrl?: string;
  onSuccess?: () => void;
}

export function ApprovalGate({
  isOpen,
  onClose,
  platformName,
  initialUrl = "https://www.etsy.com/signin",
  onSuccess
}: ApprovalGateProps) {
  const [gateState, setGateState] = useState<GateState>('discovery');
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isAiActive, setIsAiActive] = useState(true);
  const thoughtStreamRef = useRef<HTMLDivElement>(null);

  const getDeepLink = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('tiktok')) return 'snssdk1128://';
    if (p.includes('etsy')) return 'etsy://';
    if (p.includes('instagram')) return 'instagram://';
    if (p.includes('facebook')) return 'fb://';
    if (p.includes('youtube')) return 'youtube://';
    if (p.includes('gmail')) return 'googlegmail://';
    return null;
  };

  const handleUserSignIn = () => {
    setGateState('verification');
    setIsAiActive(true);
    const newThought = {
      id: 'verification-start',
      text: "Handshake detected. Verifying secure session tokens...",
      timestamp: Date.now()
    };
    setThoughts(prev => [...prev, newThought]);

    // Simulate verification success
    setTimeout(() => {
      setGateState('resumption');
      setThoughts(prev => [...prev, {
        id: 'resumption',
        text: "Neural Link Stabilized. Resuming autonomous store calibration...",
        timestamp: Date.now()
      }]);

      setTimeout(() => {
        setGateState('success');
        if (onSuccess) onSuccess();
      }, 3000);
    }, 3000);
  };

  const handleDeepLink = () => {
    const link = getDeepLink(platformName);
    if (link) {
      window.location.href = link;
      // After a short delay, assume they are signing in via app and move to verification
      setTimeout(() => {
        handleUserSignIn();
      }, 5000);
    }
  };

  // Mock WebSocket / Thought Stream
  useEffect(() => {
    if (!isOpen) return;

    const mockMessages = [
      { state: 'discovery', text: `Accessing ${platformName} neural endpoints...` },
      { state: 'discovery', text: "Identifying authentication handshake protocols." },
      { state: 'discovery', text: "Analyzing DOM structure for login fields." },
      { state: 'discovery', text: "Security barrier detected: MFA Required." },
      { state: 'barrier', text: `CEO, please sign in to ${platformName}. I'll take it from there.` },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockMessages.length) {
        const msg = mockMessages[currentIndex];
        const newThought = {
          id: Math.random().toString(36).substr(2, 9),
          text: msg.text,
          timestamp: Date.now()
        };
        setThoughts(prev => [...prev, newThought]);

        setGateState(prev => {
           if (msg.state !== prev) {
             if (msg.state === 'barrier') {
               setIsAiActive(false);
             }
             return msg.state as GateState;
           }
           return prev;
        });
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, platformName]);

  // Scroll to bottom of thought stream
  useEffect(() => {
    if (thoughtStreamRef.current) {
      thoughtStreamRef.current.scrollTop = thoughtStreamRef.current.scrollHeight;
    }
  }, [thoughts]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Gate UI */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[900px]"
        >
          {/* Top Status Bar: Orchestrator Pulse */}
          <div className="shrink-0 bg-slate-950/50 border-b border-white/5 p-6 relative">
            {/* Pulse Progress Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
              <motion.div
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                animate={{
                  width: gateState === 'discovery' ? '30%' :
                         gateState === 'barrier' ? '50%' :
                         gateState === 'verification' ? '75%' : '100%',
                  opacity: isAiActive ? [0.6, 1, 0.6] : 1
                }}
                transition={{
                  width: { duration: 1 },
                  opacity: { repeat: Infinity, duration: 1.5 }
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isAiActive ? "bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]" : "bg-slate-800"
                )}>
                  {isAiActive ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                      {isAiActive ? "AI Orchestrator" : "Human Controller"}
                    </span>
                    {isAiActive && <BrandedGlobe size="sm" animate={true} className="w-3 h-3" />}
                  </div>

                  {/* Thought Stream (Last message) */}
                  <div className="h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={thoughts[thoughts.length - 1]?.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-sm font-mono text-slate-300 truncate"
                      >
                        {thoughts[thoughts.length - 1]?.text || "Initializing..."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-theme-surface/5 rounded-full transition-colors text-muted-foreground hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Center: Bridge Window */}
          <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Background motif */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* The Window Container */}
            <motion.div
              className={cn(
                "relative z-10 w-full max-w-2xl bg-theme-surface rounded-2xl shadow-2xl overflow-hidden transition-all duration-700",
                gateState === 'barrier' ? "h-full opacity-100" : "h-[100px] opacity-40 blur-sm pointer-events-none"
              )}
            >
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center gap-2 bg-theme-surface px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[200px]">{initialUrl}</span>
                </div>
                <div className="w-12" />
              </div>

              <div className="w-full h-full bg-theme-surface flex flex-col items-center justify-center p-12">
                {gateState === 'barrier' ? (
                  <div className="w-full max-w-sm space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
                        {platformName[0]}
                      </div>
                      <h4 className="text-2xl font-black text-foreground">Sign in to {platformName}</h4>
                      <p className="text-sm font-medium text-muted-foreground italic">"Detected MFA requirement. Please sign in to continue."</p>
                    </div>

                    <div className="space-y-4">
                      {getDeepLink(platformName) && (
                        <button
                          onClick={handleDeepLink}
                          className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                        >
                          <Smartphone className="w-4 h-4" />
                          One-Tap App Login
                        </button>
                      )}

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                          <span className="bg-theme-surface px-2 text-slate-400">or manual web login</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email or Username</label>
                        <input
                          type="text"
                          defaultValue="ceo@my-empire.com"
                          className="w-full px-4 py-3 bg-theme-background border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                        <input
                          type="password"
                          defaultValue="••••••••••••"
                          className="w-full px-4 py-3 bg-theme-background border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <button
                        onClick={handleUserSignIn}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 text-slate-400">
                    <BrandedGlobe size="xl" animate={true} className="shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
                    <p className="font-bold uppercase tracking-widest text-xs">Bridge Synchronizing...</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thought Stream Panel (History) */}
            <div
              ref={thoughtStreamRef}
              className="absolute left-8 bottom-8 w-64 h-48 overflow-y-auto space-y-3 pr-4 hidden md:block"
            >
              {thoughts.map((thought, i) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.6 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-mono text-muted-foreground">{new Date(thought.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                    {thought.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
              {gateState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-50 bg-blue-600 flex flex-col items-center justify-center text-white"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-24 h-24 bg-theme-surface rounded-full flex items-center justify-center mb-8 shadow-2xl"
                  >
                    <CheckCircle2 className="w-12 h-12 text-blue-600" />
                  </motion.div>
                  <h3 className="text-4xl font-black italic tracking-tight mb-2 uppercase">Neural Link Established.</h3>
                  <p className="text-blue-100 font-bold uppercase tracking-widest text-sm italic">{platformName} is now part of your empire!</p>

                  <button
                    onClick={onClose}
                    className="mt-12 px-10 py-4 bg-theme-surface text-blue-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl shadow-blue-800/40"
                  >
                    Return to Mission Hub
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom: Handoff Action Bar */}
          <div className="shrink-0 p-8 bg-slate-950 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-white">Trust Shield Active</h5>
                <p className="text-[10px] font-medium text-muted-foreground max-w-[240px]">Isolated browser session. Your password is never stored or visible to the AI agent.</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {gateState === 'barrier' ? (
                <button
                  onClick={handleUserSignIn}
                  className="flex-1 md:flex-none px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 group"
                >
                  Sign-in Completed
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <div className="flex-1 md:flex-none px-10 py-5 bg-slate-800 text-slate-400 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-not-allowed">
                  {gateState === 'discovery' ? 'Analyzing Security...' : 'Verifying Handshake...'}
                  <Zap className="w-4 h-4 animate-pulse" />
                </div>
              )}

              <button
                onClick={onClose}
                className="px-6 py-5 rounded-[24px] border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-theme-surface/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Security Transparency Explainer (Floating) */}
          <div className="absolute right-8 bottom-32 hidden lg:block">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 w-48 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Secure Session</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                EmpireLaunch AI uses a sandboxed remote browser. We only receive the session cookies to resume setup after you sign in.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
