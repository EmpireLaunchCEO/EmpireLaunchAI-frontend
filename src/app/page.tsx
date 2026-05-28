"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stars, 
  ArrowRight, 
  Shield, 
  Rocket, 
  Target, 
  Globe, 
  Coins,
  ChevronDown,
  Languages,
  CheckCircle2,
  Lock
} from "lucide-react";
import { useEmpire } from '@/lib/EmpireContext';

export default function LandingPage() {
  const router = useRouter();
  const { setLanguage: setGlobalLanguage, setCurrency: setGlobalCurrency, setIsPaid, isOnboarded, isPaid } = useEmpire();
  
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [currency, setCurrency] = useState('USD');
  const [isMounted, setIsMounted] = useState(false);
  const [flowStep, setFlowStep] = useState<'purchase' | 'ready'>('purchase');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isOnboarded) {
      router.replace('/dashboard');
    }
  }, [isMounted, isOnboarded, router]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setGlobalLanguage(lang);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    setGlobalCurrency(curr);
  };

  const handlePurchase = () => {
    setIsPaid(true);
    router.push('/onboarding');
  };

  if (!isMounted) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <img src="/branded-globe.png" alt="Empire" className="w-full h-full object-cover animate-pulse" />
        </div>
      </div>
    </div>
  );

  const PurchaseStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-primary border border-primary rounded-[32px] p-8 max-w-md mx-auto text-left relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Coins className="w-24 h-24 rotate-12 text-white" />
        </div>
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Empire Master</h2>
            <p className="text-primary/20 text-xs font-black uppercase tracking-widest mt-1">Unlimited Autonomy License</p>
          </div>
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-5xl font-black">$30</span>
            <span className="text-blue-200 font-bold uppercase text-xs">/month</span>
          </div>
          <ul className="space-y-3">
            {['Full Autonomous Execution', 'Priority Neural Discovery', 'Secure Bank Bridge'].map(f => (
              <li key={f} className="flex items-center gap-2 text-[10px] font-black uppercase text-white">
                <CheckCircle2 className="w-4 h-4" />
                {f}
              </li>
            ))}
          </ul>
          <button 
            onClick={handlePurchase}
            className="w-full bg-white text-primary py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-theme-background transition-all flex items-center justify-center gap-2"
          >
            Purchase License
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const ReadyStep = () => (
    <div className="space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="w-24 h-24 bg-emerald-500 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20">
        <Rocket className="w-12 h-12 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black uppercase italic tracking-tight text-emerald-400">License Secured.</h2>
        <p className="text-foreground/60 font-medium italic">"Neural channels are open. Your empire is ready for initialization."</p>
      </div>
      <button 
        onClick={() => router.push('/onboarding')}
        className="bg-white text-slate-950 px-12 py-6 rounded-3xl font-black text-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
      >
        Get Started
        <ArrowRight className="w-7 h-7" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30 overflow-x-hidden">
      {/* High-Intelligence Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic">EmpireLaunch <span className="text-primary">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Live: v4.1.7 (Stable Alpha)</span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-20 text-center">
        {!isTermsOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-12"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md px-5 py-2 rounded-full border border-primary/20 text-primary font-bold text-xs uppercase tracking-[0.2em]">
              <Stars className="w-4 h-4" />
              Autonomous Business Engineering
            </div>

            {/* Hero Heading */}
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">
              Command Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-purple-500">
                Digital Empire
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              The high-intelligence AI partner that builds, markets, and scales your business outlets while you sleep. Research, design, and profit—automated.
            </p>

            <div className="flex flex-col items-center gap-8 pt-10">
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="group relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Languages className="w-4 h-4 text-primary" />
                  </div>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold appearance-none hover:bg-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-primary/40 outline-none text-white"
                  >
                    <option value="en-US" className="bg-slate-900">English (US)</option>
                    <option value="en-GB" className="bg-slate-900">English (UK)</option>
                    <option value="es-ES" className="bg-slate-900">Español</option>
                    <option value="fr-FR" className="bg-slate-900">Français</option>
                    <option value="de-DE" className="bg-slate-900">Deutsch</option>
                  </select>
                  <ChevronDown className="absolute inset-y-0 right-4 my-auto w-4 h-4 text-theme-background0 pointer-events-none" />
                </div>

                <div className="group relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Coins className="w-4 h-4 text-purple-400" />
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold appearance-none hover:bg-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-purple-500/40 outline-none text-white"
                  >
                    <option value="USD" className="bg-slate-900">USD ($)</option>
                    <option value="EUR" className="bg-slate-900">EUR (€)</option>
                    <option value="GBP" className="bg-slate-900">GBP (£)</option>
                  </select>
                  <ChevronDown className="absolute inset-y-0 right-4 my-auto w-4 h-4 text-theme-background0 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={() => setIsTermsOpen(true)}
                className="group relative bg-primary text-white px-12 py-6 rounded-3xl font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 w-full md:w-auto"
              >
                Get Started
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl w-full">
            {flowStep === 'purchase' && <PurchaseStep />}
            {flowStep === 'ready' && <ReadyStep />}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-32 w-full max-w-7xl">
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 text-left space-y-4 hover:bg-white/[0.07] transition-all">
            <div className="bg-primary/20 p-4 rounded-2xl w-fit">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Secure Protocol</h3>
            <p className="text-slate-400 font-medium leading-relaxed">Your financial data and personal credentials are protected via encrypted sandboxes and hardware security modules.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 text-left space-y-4 hover:bg-white/[0.07] transition-all">
            <div className="bg-purple-500/20 p-4 rounded-2xl w-fit">
              <Rocket className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Hyper Scaling</h3>
            <p className="text-slate-400 font-medium leading-relaxed">AI intelligence monitors global trends 24/7 to adjust your strategy across Etsy, TikTok, and Youtube instantly.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 text-left space-y-4 hover:bg-white/[0.07] transition-all">
            <div className="bg-emerald-500/20 p-4 rounded-2xl w-fit">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Goal Targeted</h3>
            <p className="text-slate-400 font-medium leading-relaxed">Define your revenue targets and let the AI architect the exact execution path to hit your profit milestones.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
