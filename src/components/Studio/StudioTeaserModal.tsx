"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Video, Zap, ShieldCheck, X, Rocket, Clock, Database } from 'lucide-react';

interface StudioTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioTeaserModal: React.FC<StudioTeaserModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header / Banner */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
                <Sparkles size={14} className="text-yellow-300" />
                Coming Soon
              </div>
              
              <h2 className="text-4xl font-black mb-2 tracking-tight">EMPIRE STUDIO</h2>
              <p className="text-blue-100 text-lg max-w-md">
                The ultimate AI creative engine. High-intelligence content creation with zero third-party subscriptions.
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Video className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Neural Video Synth</h4>
                    <p className="text-xs text-slate-500">Generate 3 high-conversion videos daily for TikTok, Reels, & Shorts automatically.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <Database className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Asset Harvester</h4>
                    <p className="text-xs text-slate-500">Auto-search best sellers on Etsy/Amazon and create similar high-performing designs.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">No More Canva/Kittl</h4>
                    <p className="text-xs text-slate-500">Stop paying $15-20/mo for each tool. Studio replaces them with integrated AI.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <Clock className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Elite Access</h4>
                    <p className="text-xs text-slate-500">Early access for Elite members starts soon. Ready your assets for mass production.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-2 text-blue-800 font-bold">
                  <Rocket size={20} />
                  Elite Expansion
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Empire Studio will be available as an integrated expansion for all Elite members. Unlock high-intelligence rendering, unlimited stock assets, and autonomous content production.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Got it, notify me on launch
                <Zap size={18} className="text-yellow-400" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
