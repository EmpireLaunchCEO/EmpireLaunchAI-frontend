"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface GoLiveGateProps {
  payload: {
    platform: string;
    title: string;
    price: number;
    tags: string[];
    bankInfoVerified: boolean;
  };
  onApprove: () => void;
  onReject: () => void;
}

export function GoLiveGate({ payload, onApprove, onReject }: GoLiveGateProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-emerald-600/5 p-6 rounded-[32px] border border-emerald-600/10">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <Rocket className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">Pre-Deployment Sync.</h3>
          <p className="text-sm text-slate-500 font-medium italic">"Final confirmation required before I deploy your listing to {payload?.platform ?? 'your chosen platform'}."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listing Preview */}
        <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 space-y-6 shadow-sm">
           <div className="flex items-center gap-2">
              <BrandedGlobe size="sm" animate={false} className="border-emerald-600/30" />
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Listing Manifest</h4>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Target</p>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-900">
                    {payload?.platform ?? 'Platform'} Storefront
                 </div>
              </div>

              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Title & Price</p>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-900">{payload?.title ?? 'Untitled Product'}</span>
                    <span className="font-black text-emerald-600">${payload?.price ?? '0.00'}</span>
                 </div>
              </div>

              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Tags (SEO)</p>
                 <div className="flex flex-wrap gap-2">
                    {(payload?.tags ?? []).map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold border border-emerald-100">
                         #{tag}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Security & Financial Verification */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
           <div className="flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="font-black uppercase tracking-widest text-xs">Financial Safety Gate</h4>
           </div>

           <div className="space-y-6 relative z-10">
              <div className={cn(
                "p-6 rounded-3xl border-2 transition-all",
                payload?.bankInfoVerified ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
              )}>
                 <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      payload?.bankInfoVerified ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    )}>
                       <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <h5 className="font-bold text-white">Bank Info Verification</h5>
                       <p className="text-xs text-slate-400 leading-relaxed">
                          {payload?.bankInfoVerified 
                            ? "Your settlement account is linked and ready for direct deposits."
                            : "I've detected missing settlement info. Please verify your bank details before deployment."}
                       </p>
                    </div>
                 </div>
                 {payload && !payload.bankInfoVerified && (
                   <button className="mt-4 w-full py-3 bg-amber-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-colors">
                      Update Bank Info
                   </button>
                 )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                 <AlertCircle className="w-5 h-5 text-slate-500" />
                 <p className="text-[10px] text-slate-400 font-medium italic">
                   "Deploying will trigger automated posting. Ensure your account is not in vacation mode."
                 </p>
              </div>
           </div>

           <div className="absolute right-0 bottom-0 p-8 opacity-10">
              <Rocket className="w-48 h-48 -mr-12 -mb-12 rotate-12" />
           </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onReject}
          className="flex-1 py-5 border-2 border-slate-100 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Hold Deployment
        </button>
        <button 
          onClick={onApprove}
          className="flex-[2] py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 group"
        >
          Launch to {payload.platform}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
