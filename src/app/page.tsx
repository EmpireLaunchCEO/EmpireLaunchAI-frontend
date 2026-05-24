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

const TermsModal = ({ isOpen, onClose, onAccept }: { isOpen: boolean, onClose: () => void, onAccept: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <h2 className="text-3xl font-black mb-6 text-white uppercase tracking-tight">Terms of Operation</h2>
          <div className="space-y-6 text-slate-400 font-medium leading-relaxed">
            <section>
              <h3 className="text-white font-bold mb-2 uppercase text-sm tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Data Sovereignty
              </h3>
              <p>EmpireLaunchAI acts as your primary executive agent. All bank details and personal identifiers are encrypted at the edge. We do not store raw financial data on shared nodes.</p>
            </section>
            <section>
              <h3 className="text-white font-bold mb-2 uppercase text-sm tracking-widest flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-400" />
                Autonomous Execution
              </h3>
              <p>By proceeding, you grant the AI permission to research trends and draft listings. Financial transactions and high-impact social posts will ALWAYS require your final verification via the validation gates.</p>
            </section>
            <section>
              <h3 className="text-white font-bold mb-2 uppercase text-sm tracking-widest flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Safeguards
              </h3>
              <p>The system will never execute paid subscriptions or purchases without explicit owner signatures. Your business angle and social outlets remain your intellectual property.</p>
            </section>
          </div>
        </div>
        <div className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
          <button onClick={onClose} className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all uppercase tracking-widest text-xs">
            Decline
          </button>
          <button onClick={onAccept} className="flex-[2] px-6 py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            Accept & Initialize
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [currency, setCurrency] = useState('USD');
  const [isMounted, setIsOnboarded] = useState(false);

  useEffect(() => {
    setIsOnboarded(true);
  }, []);

  if (!isMounted) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <Globe className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* High-Intelligence Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic">EmpireLaunch<span className="text-blue-500">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Live: v3.1.0</span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl space-y-12"
        >
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-md px-5 py-2 rounded-full border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Stars className="w-4 h-4" />
            Autonomous Business Engineering
          </div>

          {/* Hero Heading */}
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500">
              Digital Empire
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The high-intelligence AI partner that builds, markets, and scales your business outlets while you sleep. Research, design, and profit—automated.
          </p>

          <div className="flex flex-col items-center gap-8 pt-10">
            {/* NEW: Explicit Language & Currency Selectors ABOVE Get Started */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="group relative w-full md:w-64">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Languages className="w-4 h-4 text-blue-400" />
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold appearance-none hover:bg-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-blue-500/40 outline-none"
                >
                  <option value="en-US" className="bg-slate-900">English (US)</option>
                  <option value="en-GB" className="bg-slate-900">English (UK)</option>
                  <option value="es-ES" className="bg-slate-900">Español</option>
                  <option value="fr-FR" className="bg-slate-900">Français</option>
                  <option value="de-DE" className="bg-slate-900">Deutsch</option>
                </select>
                <ChevronDown className="absolute inset-y-0 right-4 my-auto w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="group relative w-full md:w-48">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Coins className="w-4 h-4 text-purple-400" />
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold appearance-none hover:bg-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-purple-500/40 outline-none"
                >
                  <option value="USD" className="bg-slate-900">USD ($)</option>
                  <option value="EUR" className="bg-slate-900">EUR (€)</option>
                  <option value="GBP" className="bg-slate-900">GBP (£)</option>
                </select>
                <ChevronDown className="absolute inset-y-0 right-4 my-auto w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Main Action */}
            <button
              onClick={() => setIsTermsOpen(true)}
              className="group relative bg-blue-600 text-white px-12 py-6 rounded-3xl font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 w-full md:w-auto"
            >
              Get Started
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          </div>
        </motion.div>

        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          onAccept={() => router.push('/onboarding')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-32 w-full max-w-7xl">
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 text-left space-y-4 hover:bg-white/[0.07] transition-all">
            <div className="bg-blue-500/20 p-4 rounded-2xl w-fit">
              <Shield className="w-8 h-8 text-blue-400" />
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
