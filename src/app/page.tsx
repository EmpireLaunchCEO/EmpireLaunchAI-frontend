"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Rocket, Target } from "lucide-react";
import { useEmpire } from "@/lib/EmpireContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isOnboarded, isInitialized } = useEmpire();
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

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/onboarding" 
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/dashboard" 
            className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            Demo Dashboard
          </Link>
        </div>

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
