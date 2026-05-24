"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Check,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationGateProps {
  taskTitle: string;
  platform: string;
  onValidated: (url: string) => void;
  onCancel: () => void;
}

export function ValidationGate({ taskTitle, platform, onValidated, onCancel }: ValidationGateProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'validating' | 'success' | 'failed'>('idle');
  const [score, setScore] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus('idle');
    }
  };

  const startValidation = async () => {
    if (!file) return;

    setStatus('uploading');
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('validating');
    // Simulate AI Perceptual Hashing & Uniqueness check
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setScore(94); // High uniqueness score
    setStatus('success');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[32px] text-white">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black leading-tight uppercase italic">Neural Validation Gate.</h3>
          <p className="text-sm text-slate-400 font-medium italic">"Upload your {platform} export. I'll verify the design DNA and uniqueness."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
           {!preview ? (
             <label className="group relative aspect-video bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                <div className="p-6 bg-white rounded-3xl shadow-xl group-hover:scale-110 transition-transform mb-4">
                   <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-slate-900 font-black uppercase tracking-widest text-xs">Drop Export Here</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Kittl / CapCut / Canva PNG or MP4</p>
             </label>
           ) : (
             <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 border-4 border-white">
                {file?.type.includes('video') ? (
                  <video src={preview} className="w-full h-full object-cover" autoPlay loop muted />
                ) : (
                  <img src={preview} className="w-full h-full object-cover" alt="Upload Preview" />
                )}
                
                <AnimatePresence>
                  {status === 'validating' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center"
                    >
                       <div className="text-center space-y-4">
                          <div className="relative">
                             <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                             <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white" />
                          </div>
                          <p className="text-white font-black uppercase tracking-[0.2em] text-xs">Scanning Visual DNA...</p>
                       </div>
                    </motion.div>
                  )}
                  
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md flex items-center justify-center text-white"
                    >
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl">
                             <Check className="w-12 h-12 text-emerald-500 stroke-[4px]" />
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-3xl font-black uppercase italic tracking-tighter">Verified.</h4>
                             <p className="text-emerald-100 font-bold uppercase tracking-widest text-[10px]">Uniqueness Score: {score}%</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={() => { setPreview(null); setFile(null); setStatus('idle'); }}
                  className="absolute top-6 right-6 p-2 bg-slate-900/50 backdrop-blur-md text-white rounded-xl hover:bg-red-500 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 space-y-8 shadow-sm">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Context</h4>
                 <p className="text-lg font-black text-slate-900 leading-tight italic">{taskTitle}</p>
                 <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">{platform} Platform</span>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">AI Validation Logic</h4>
                 </div>
                 <ul className="space-y-3">
                    {[
                      'Perceptual Hash Uniqueness Check',
                      'Style Modifiers Compliance',
                      'Typography & Color DNA Match'
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-500">
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full",
                           status === 'success' ? "bg-emerald-500" : "bg-blue-600 animate-pulse"
                         )} />
                         {step}
                      </li>
                    ))}
                 </ul>
              </div>

              {status === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                   <div className="flex items-center gap-2 text-emerald-600">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Anti-Copycat Clear</span>
                   </div>
                   <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                      Design is 94% distinct from top competitors. High probability of search engine favorability.
                   </p>
                </div>
              )}
           </div>

           <div className="flex flex-col gap-3">
              {status === 'idle' && preview && (
                <button 
                  onClick={startValidation}
                  className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl flex items-center justify-center gap-3 group"
                >
                  Run Validation
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
              
              {status === 'success' && (
                <button 
                  onClick={() => onValidated(preview!)}
                  className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Confirm & Finalize
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}

              {status === 'idle' && !preview && (
                <button 
                  disabled
                  className="w-full py-5 bg-slate-100 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed"
                >
                  Upload Required
                </button>
              )}

              <button 
                onClick={onCancel}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel Validation
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from 'framer-motion';
