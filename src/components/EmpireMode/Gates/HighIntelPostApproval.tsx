"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Stars,
  Clock,
  Target,
  TrendingUp,
  Zap,
  ShieldCheck,
  Bot,
  Video,
  Search,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Send,
  Eye,
  MousePointer2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface HighIntelPostApprovalProps {
  payload: {
    title: string;
    platform: 'tiktok' | 'instagram' | 'facebook' | 'youtube';
    previewUrl: string;
    strategicReasoning: string;
    targetAudience: string;
    trendAlignment: string;
    confidenceScore: number;
    goldenHour: string;
    suggestedTimes: string[];
    caption: string;
    predictedReach: string;
    predictedCTR: string;
  };
  onApprove: () => void;
  onReject: () => void;
  onRefine?: (feedback: string) => void;
  onBack?: () => void;
}

export function HighIntelPostApproval({ payload, onApprove, onReject, onRefine, onBack }: HighIntelPostApprovalProps) {
  const [selectedTime, setSelectedTime] = useState(payload.goldenHour);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [strategyMode, setStrategyMode] = useState<'golden' | 'even'>('golden');
  const [refineFeedback, setRefineFeedback] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refineFeedback.trim() && onRefine) {
      setIsRefining(true);
      onRefine(refineFeedback);
      // Simulate AI processing for UX
      setTimeout(() => {
        setIsRefining(false);
        setRefineFeedback('');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans selection:bg-primary selection:text-foreground relative overflow-hidden">
      {/* Background Intelligence Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 backdrop-blur-md bg-slate-950/50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Command Center</span>
        </button>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Neural Draft v2.4</span>
           </div>
           <ChevronDown className="w-5 h-5 text-slate-600" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left Column: Post Preview & Platform Context */}
          <div className="space-y-10">
            <div className="relative aspect-[9/16] max-w-[380px] mx-auto bg-black rounded-[56px] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,1)] border-[14px] border-slate-900 group">
              {/* Mock Platform UI Overlay (TikTok style) */}
              <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-7 pb-14">
                <div className="flex justify-between items-start">
                  <div className="bg-black/20 backdrop-blur-md p-2.5 rounded-full border border-white/10">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <Search className="w-6 h-6 text-white" />
                </div>

                <div className="flex justify-end gap-4 items-end">
                   <div className="flex flex-col gap-6 items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                          <Bot className="w-7 h-7 text-foreground" />
                        </div>
                        <div className="bg-primary rounded-full p-1 -mt-3 relative z-10 shadow-md">
                           <CheckCircle2 className="w-3 h-3 text-white fill-primary" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <Heart className="w-8 h-8 text-white fill-white/10 drop-shadow-md" />
                         <span className="text-[11px] font-black drop-shadow-md">12.4K</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <MessageCircle className="w-8 h-8 text-white fill-white/10 drop-shadow-md" />
                         <span className="text-[11px] font-black drop-shadow-md">342</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <Bookmark className="w-8 h-8 text-white fill-white/10 drop-shadow-md" />
                         <span className="text-[11px] font-black drop-shadow-md">1.2K</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                         <Share2 className="w-8 h-8 text-white fill-white/10 drop-shadow-md" />
                         <span className="text-[11px] font-black drop-shadow-md">89</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-black text-white text-lg drop-shadow-md">@empire_ai</h4>
                    <p className="text-sm text-white/90 line-clamp-3 leading-relaxed drop-shadow-md font-medium">
                      {payload.caption}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-2 rounded-full w-fit border border-white/5">
                     <div className="w-4 h-4 bg-primary/40 rounded-full animate-pulse" />
                     <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Original Sound - Empire Intelligence</span>
                  </div>
                </div>
              </div>

              {/* Real Content Preview */}
              {payload.previewUrl.match(/\.(mp4|mov|webm)$/i) ? (
                <video
                  src={payload.previewUrl}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={payload.previewUrl}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                  alt="Post Preview"
                />
              )}

              {/* Video Play Overlay */}
              {!payload.previewUrl.match(/\.(mp4|mov|webm)$/i) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                      <Zap className="w-9 h-9 text-white fill-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Impact Projection */}
            <div className="grid grid-cols-2 gap-4 max-w-[380px] mx-auto">
               <div className="bg-slate-900/60 border border-white/5 p-5 rounded-[32px] backdrop-blur-sm space-y-1">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Est. Reach</span>
                  </div>
                  <div className="text-2xl font-black text-white">{payload.predictedReach}</div>
               </div>
               <div className="bg-slate-900/60 border border-white/5 p-5 rounded-[32px] backdrop-blur-sm space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <MousePointer2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Est. CTR</span>
                  </div>
                  <div className="text-2xl font-black text-white">{payload.predictedCTR}</div>
               </div>
            </div>
          </div>

          {/* Right Column: Intelligence, Scheduling & Refinement */}
          <div className="space-y-12">

            {/* Strategic Reasoning Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-7 bg-primary rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
                   <h2 className="text-3xl font-black text-white tracking-tight italic">Strategic Reasoning</h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Growth Validated</span>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-[40px] p-8 space-y-8 relative overflow-hidden backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trend Alignment
                  </div>
                  <p className="font-mono text-sm text-slate-300 leading-relaxed border-l-2 border-primary/20 pl-4 py-1">
                    {payload.trendAlignment}
                  </p>
                  <p className="font-mono text-sm text-slate-400 leading-relaxed">
                    {payload.strategicReasoning}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
                    <Target className="w-3.5 h-3.5" />
                    Target Audience
                  </div>
                  <p className="font-mono text-sm text-slate-300 leading-relaxed border-l-2 border-blue-400/20 pl-4 py-1">
                    {payload.targetAudience}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Confidence</div>
                      <div className="flex items-center gap-1.5">
                        <Stars className="w-4 h-4 text-primary fill-primary animate-pulse" />
                        <span className="text-xl font-black text-white">{payload.confidenceScore}%</span>
                      </div>
                   </div>
                </div>

                {/* Subtle Neural Pattern Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              </div>
            </div>

            {/* Scheduling Intelligence Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-7 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
                  <h2 className="text-3xl font-black text-white tracking-tight italic">Scheduling Strategy</h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                   <Clock className="w-3 h-3 text-blue-400" />
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Efficiency Optimized</span>
                </div>
              </div>

              {/* Strategy Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setStrategyMode('golden')}
                  className={cn(
                    "p-6 rounded-[28px] border-2 transition-all text-left space-y-2 relative overflow-hidden",
                    strategyMode === 'golden' ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(251,191,36,0.2)]" : "bg-slate-900/40 border-white/5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <Sparkles className={cn("w-6 h-6", strategyMode === 'golden' ? "text-primary" : "text-slate-400")} />
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest">Golden Hour</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Hero post at peak activity</p>
                  </div>
                  {strategyMode === 'golden' && (
                    <div className="absolute top-0 right-0 p-3">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </button>

                <button 
                  onClick={() => setStrategyMode('even')}
                  className={cn(
                    "p-6 rounded-[28px] border-2 transition-all text-left space-y-2 relative overflow-hidden",
                    strategyMode === 'even' ? "bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-slate-900/40 border-white/5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <TrendingUp className={cn("w-6 h-6", strategyMode === 'even' ? "text-blue-400" : "text-slate-400")} />
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest">Even Spacing</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Steady momentum velocity</p>
                  </div>
                  {strategyMode === 'even' && (
                    <div className="absolute top-0 right-0 p-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </button>
              </div>

              {/* Time Selector Dropdown */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-[28px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <button
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="relative w-full bg-slate-900/80 border border-white/10 rounded-[24px] p-6 flex items-center justify-between transition-all hover:border-primary/40 backdrop-blur-md"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                       <span className="block text-2xl font-black text-white">{selectedTime}</span>
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                         {strategyMode === 'golden' ? 'Neural Peak Recommended' : 'Manual Slot Selection'}
                       </span>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-6 h-6 text-slate-600 transition-transform duration-500", isTimeDropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isTimeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl z-20 overflow-hidden backdrop-blur-xl"
                    >
                      {payload.suggestedTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setIsTimeDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full p-5 text-left font-black transition-all hover:bg-white/5 flex items-center justify-between",
                            selectedTime === time ? "text-primary bg-primary/5" : "text-slate-400"
                          )}
                        >
                          <span className="text-lg">{time}</span>
                          {time === payload.goldenHour && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 text-primary rounded-full text-[10px] uppercase tracking-tighter">
                               <Sparkles className="w-3 h-3" />
                               Neural Optimal
                            </div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="p-6 bg-slate-900/60 rounded-[32px] border border-white/5 border-dashed">
                <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                  {strategyMode === 'golden' 
                    ? `"I recommend posting '${payload.title}' at ${payload.goldenHour}. I've analyzed your niche velocity and this window provides a 22% higher probability of going viral. I will space the remaining posts every 4 hours to maintain engagement."`
                    : `"I will space your pending posts evenly throughout the next 24 hours to ensure consistent visibility across all timezones. This strategy prioritizes long-term brand recall over immediate reach peaks."`
                  }
                </p>
              </div>
            </div>

            {/* Conversational Edit Bar */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-3">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Refinement</span>
               </div>
               <form
                 onSubmit={handleRefineSubmit}
                 className="relative group"
               >
                  <input
                    type="text"
                    value={refineFeedback}
                    onChange={(e) => setRefineFeedback(e.target.value)}
                    placeholder="e.g., 'Make the hook more aggressive' or 'Change the vibe to retro'..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-full py-5 px-8 pr-16 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!refineFeedback.trim() || isRefining}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 shadow-lg"
                  >
                    {isRefining ? (
                      <BrandedGlobe size="sm" animate={true} />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
               </form>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col gap-5">
               <motion.button
                 whileHover={{ scale: 1.01, y: -2 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={onApprove}
                 className="w-full py-7 bg-primary text-foreground rounded-[32px] font-black text-xl uppercase tracking-[0.3em] shadow-[0_25px_50px_-12px_rgba(251,191,36,0.4)] hover:shadow-[0_30px_60px_-12px_rgba(251,191,36,0.6)] transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
               >
                 <span className="relative z-10">Approve & Schedule</span>
                 <Zap className="w-7 h-7 relative z-10 fill-current" />
                 <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-25deg]" />
               </motion.button>

               <div className="grid grid-cols-2 gap-5">
                  <button
                    onClick={onReject}
                    className="py-5 border border-white/10 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] text-muted-foreground hover:bg-white/5 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Reject Draft
                  </button>
                  <button
                    onClick={() => onRefine?.('optimize')}
                    className="py-5 bg-slate-900 border border-white/5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    Deep Refine
                  </button>
               </div>
            </div>

            {/* Secure Vault Notice */}
            <div className="flex items-center gap-3 px-8 py-5 bg-primary/5 rounded-[32px] border border-primary/10">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
                    Sovereign Execution
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter leading-relaxed">
                    This post is isolated in the secure vault until the golden hour.
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
