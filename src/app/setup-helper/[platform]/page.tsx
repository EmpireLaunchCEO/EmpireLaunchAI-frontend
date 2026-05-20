"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Copy, Check, ExternalLink, Bot, ShieldCheck } from 'lucide-react';

export default function SetupHelper() {
  const params = useParams();
  const platform = params.platform as string;
  const [copied, setCopied] = React.useState<string | null>(null);

  const websiteUrl = 'https://empire-launch-ai.vercel.app';
  const callbackUrl = `https://empire-launch-ai.vercel.app/auth/callback/${platform}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black uppercase tracking-tighter italic">Empire Setup Assistant</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-500" /> Secure Link Active
          </p>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-300 leading-relaxed mb-8">
        Keep this window open while you fill out the <span className="text-white font-bold capitalize">{platform}</span> form. Use the buttons below to copy the exact URLs needed.
      </p>

      <div className="space-y-6">
        {/* Website URL */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">1. Website URL</label>
          <div className="flex items-center gap-2 group">
            <div className="flex-1 bg-slate-800 border border-white/5 p-4 rounded-2xl font-mono text-xs text-blue-300 break-all select-all">
              {websiteUrl}
            </div>
            <button 
              onClick={() => copyToClipboard(websiteUrl, 'web')}
              className={`p-4 rounded-2xl transition-all shadow-xl active:scale-95 ${
                copied === 'web' ? 'bg-green-600 text-white' : 'bg-white text-slate-900 hover:bg-blue-50'
              }`}
            >
              {copied === 'web' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Callback URL */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">2. Callback / Redirect URL</label>
          <div className="flex items-center gap-2 group">
            <div className="flex-1 bg-slate-800 border border-white/5 p-4 rounded-2xl font-mono text-xs text-blue-300 break-all select-all">
              {callbackUrl}
            </div>
            <button 
              onClick={() => copyToClipboard(callbackUrl, 'call')}
              className={`p-4 rounded-2xl transition-all shadow-xl active:scale-95 ${
                copied === 'call' ? 'bg-green-600 text-white' : 'bg-white text-slate-900 hover:bg-blue-50'
              }`}
            >
              {copied === 'call' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Next Step</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed italic">
          After pasting these and clicking "Register" on {platform}, you will receive your API Keys. Paste those into the Empire Launch dashboard to finish.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          © EmpireLaunchAI Security Protocol
        </p>
      </div>
    </div>
  );
}
