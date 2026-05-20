"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Copy, Check, ExternalLink, Bot, ShieldCheck, ListChecks } from 'lucide-react';

const platformGuidance: Record<string, { step: string; instruction: string }[]> = {
  etsy: [
    { step: "Application Name", instruction: "EmpireLaunch AI - Staci" },
    { step: "Description", instruction: "AI assistant for managing my business." },
    { step: "Application Website", instruction: "Use the copy button below for Website URL." },
    { step: "Type of Application", instruction: "Select 'Seller Tools'." },
    { step: "Who will use it?", instruction: "Select 'Myself or people I work with'." },
    { step: "Commercial purposes?", instruction: "Select 'Yes'." },
    { step: "Callback URL", instruction: "Use the second copy button below." }
  ],
  tiktok: [
    { step: "App Name", instruction: "EmpireLaunch Marketing" },
    { step: "Category", instruction: "Select 'Marketing' or 'Business Tools'." },
    { step: "Redirect URI", instruction: "Use the second copy button below." }
  ],
  meta: [
    { step: "App Type", instruction: "Select 'Business' or 'Consumer'." },
    { step: "Display Name", instruction: "EmpireLaunch Social" },
    { step: "Permissions", instruction: "Ensure 'instagram_basic' and 'pages_show_list' are checked." }
  ]
};

export default function SetupHelper() {
  const params = useParams();
  const platform = params.platform as string;
  const [copied, setCopied] = React.useState<string | null>(null);

  const guidance = platformGuidance[platform.toLowerCase()] || [];
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
            <ShieldCheck className="w-3 h-3 text-green-500" /> Live Guidance Active
          </p>
        </div>
      </div>

      {/* Dynamic Guidance Section */}
      {guidance.length > 0 && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-4 h-4 text-blue-400" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Guidance</h2>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            {guidance.map((item, index) => (
              <div key={index} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/10 transition-colors">
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 block mb-1">
                  Field: {item.step}
                </span>
                <p className="text-xs font-bold text-slate-200 leading-relaxed">
                  {item.instruction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Connection URLs</h2>
        
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

      <div className="mt-8 text-center border-t border-white/5 pt-8">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          © EmpireLaunchAI Security Protocol
        </p>
      </div>
    </div>
  );
}
