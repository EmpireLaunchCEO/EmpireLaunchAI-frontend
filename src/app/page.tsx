"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Rocket, Target, Globe, Coins } from "lucide-react";
import { useEmpire } from "@/lib/EmpireContext";
import { useRouter } from "next/navigation";
import { TermsModal } from "@/components/Legal/TermsModal";

export default function Home() {
  const { isOnboarded, isInitialized, language, setLanguage, currency, setCurrency } = useEmpire();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (isOnboarded) {
        router.replace('/dashboard');
      } else {
        // If not onboarded, we stay on the landing page, 
        // but we can also pre-check if they should go to onboarding
      }
    }
  }, [isInitialized, isOnboarded, router]);

  // If already onboarded, don't even wait for useEffect, show nothing
  if (isOnboarded) return null;
  
  // While initializing, show nothing to avoid flash
  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-blue-400 font-bold text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          The Future of Business Automation
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
          Build your empire <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            with AI intelligence.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The all-in-one partner that researches, creates, and markets for you. 
          Focus on your vision, let EmpireLaunchAI handle the rest.
        </p>

        <div className="flex flex-col items-center gap-6 pt-8">
          {/* Global Preferences Selector */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
              <Globe className="w-5 h-5 text-blue-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en-US" className="bg-slate-800">English (US)</option>
                <option value="en-GB" className="bg-slate-800">English (UK)</option>
                <option value="es-ES" className="bg-slate-800">Español</option>
                <option value="fr-FR" className="bg-slate-800">Français</option>
                <option value="de-DE" className="bg-slate-800">Deutsch</option>
                <option value="it-IT" className="bg-slate-800">Italiano</option>
                <option value="pt-BR" className="bg-slate-800">Português</option>
              </select>
            </div>
            
            <div className="w-px h-8 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
              <Coins className="w-5 h-5 text-purple-400" />
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
              >
                <option value="USD" className="bg-slate-800">USD ($)</option>
                <option value="EUR" className="bg-slate-800">EUR (€)</option>
                <option value="GBP" className="bg-slate-800">GBP (£)</option>
                <option value="AUD" className="bg-slate-800">AUD ($)</option>
                <option value="CAD" className="bg-slate-800">CAD ($)</option>
                <option value="JPY" className="bg-slate-800">JPY (¥)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => setIsTermsOpen(true)}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 group w-full md:w-fit"
          >
            Get Started
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <TermsModal 
          isOpen={isTermsOpen} 
          onClose={() => setIsTermsOpen(false)}
          onAccept={() => router.push('/onboarding')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-left space-y-4">
            <div className="bg-blue-500/20 p-3 rounded-2xl w-fit">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-slate-500 text-sm">Your bank and personal info are protected with enterprise-grade encryption.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-left space-y-4">
            <div className="bg-purple-500/20 p-3 rounded-2xl w-fit">
              <Rocket className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold">High ROI Insights</h3>
            <p className="text-slate-500 text-sm">AI scans trends across Etsy, TikTok, and more to find your next best-seller.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-left space-y-4">
            <div className="bg-green-500/20 p-3 rounded-2xl w-fit">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold">Goal Driven</h3>
            <p className="text-slate-500 text-sm">Set your targets and let the AI build the roadmap to reach them.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
