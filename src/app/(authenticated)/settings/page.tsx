"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Share2, 
  Zap, 
  Bell, 
  Palette, 
  Diamond, 
  CheckCircle2, 
  Bot, 
  X, 
  ChevronRight, 
  Lock, 
  Building2, 
  Globe, 
  Stars,
  CreditCard,
  ExternalLink,
  LifeBuoy,
  Mail,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { useEmpire } from '@/lib/EmpireContext';
import { useStripeStatus } from '@/lib/hooks/useStripeStatus';
import { SupportHub } from '@/components/Settings/SupportHub';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';

const IntegrationForm = ({ platform, onClose }: { platform: string, onClose: () => void }) => {
  if (platform.toLowerCase() === 'stripe') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-4 border-emerald-600 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[80px] -z-10" />
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Connecting Stripe Gateway
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Publishable Key</label>
              <input id="stripe-pub-key" type="text" placeholder="pk_live_..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-emerald-600 outline-none transition-all font-bold text-lg text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Secret Key</label>
              <input id="stripe-sec-key" type="password" placeholder="sk_live_..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-emerald-600 outline-none transition-all font-bold text-lg text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button 
              onClick={() => {
                const pub = (document.getElementById('stripe-pub-key') as HTMLInputElement)?.value;
                const sec = (document.getElementById('stripe-sec-key') as HTMLInputElement)?.value;
                if (pub && sec) {
                  localStorage.setItem('empire_vault_stripe', JSON.stringify({ publishableKey: pub, secretKey: sec }));
                  window.dispatchEvent(new CustomEvent('empire:vault-updated'));
                  onClose();
                }
              }}
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20"
            >
              Link Stripe Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'etsy') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-4 border-blue-600 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -z-10" />
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Bot className="w-6 h-6 text-blue-600" /> Connecting Etsy Marketplace
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Etsy API Key (Keystring)</label>
              <input id="etsy-api-key" type="password" placeholder="Paste your Keystring..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-blue-600 outline-none transition-all font-bold text-lg text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Shared Secret</label>
              <input id="etsy-shared-secret" type="password" placeholder="Paste your Shared Secret..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-blue-600 outline-none transition-all font-bold text-lg text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">Save Connection</button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'tiktok') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-4 border-slate-900 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Share2 className="w-6 h-6 text-blue-600" /> Connecting TikTok Marketing
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">App Type</label>
              <select className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-blue-600 outline-none transition-all font-bold appearance-none text-lg text-white">
                <option>Marketing API</option>
                <option>Display API</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Redirect URI</label>
              <input type="text" readOnly value="https://empire-launch-ai-frontend.vercel.app/api/auth/callback/tiktok" className="w-full p-5 rounded-3xl bg-white/5 border-2 border-theme outline-none transition-all font-bold text-lg text-white/40 cursor-not-allowed" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/40">Sync TikTok</button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'canva') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-4 border-cyan-400 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Palette className="w-6 h-6 text-cyan-400" /> Connecting Canva Creative
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-slate-400 italic">
              "To harvest Style DNA from your Canva designs, provide your Canva Public Profile URL or a specific Public Design Link. I'll analyze the visual patterns to improve your empire's creative intelligence."
            </p>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Canva Profile or Design URL</label>
              <input id="canva-url" type="text" placeholder="https://www.canva.com/p/yourname or https://www.canva.com/design/..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-cyan-400 outline-none transition-all font-bold text-lg text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button 
              onClick={() => {
                const url = (document.getElementById('canva-url') as HTMLInputElement)?.value;
                if (url) {
                  localStorage.setItem('empire_link_canva', url);
                  onClose();
                }
              }}
              className="px-10 py-4 bg-cyan-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/20"
            >
              Start DNA Harvest
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'kittl') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-4 border-amber-500 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Stars className="w-6 h-6 text-amber-500" /> Connecting Kittl Studio
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-slate-400 italic">
              "Kittl is a powerhouse for typography and layout DNA. Link your Kittl project or profile to allow the Empire AI to learn from your highest-performing assets."
            </p>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Kittl Profile or Project Link</label>
              <input id="kittl-url" type="text" placeholder="https://www.kittl.com/u/yourname or https://www.kittl.com/design/..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-amber-500 outline-none transition-all font-bold text-lg text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button 
              onClick={() => {
                const url = (document.getElementById('kittl-url') as HTMLInputElement)?.value;
                if (url) {
                  localStorage.setItem('empire_link_kittl', url);
                  onClose();
                }
              }}
              className="px-10 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-900/20"
            >
              Link Kittl Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'capcut') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-4 border-slate-100 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Video className="w-6 h-6 text-slate-200" /> Connecting CapCut Production
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white/40" />
            </button>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-slate-400 italic">
              "CapCut provides the pacing and transition DNA. Link your CapCut workspace or a shared project link to synchronize video editing intelligence."
            </p>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">CapCut Share Link</label>
              <input id="capcut-url" type="text" placeholder="https://www.capcut.com/t/..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-slate-100 outline-none transition-all font-bold text-lg text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
            <button 
              onClick={() => {
                const url = (document.getElementById('capcut-url') as HTMLInputElement)?.value;
                if (url) {
                  localStorage.setItem('empire_link_capcut', url);
                  onClose();
                }
              }}
              className="px-10 py-4 bg-slate-100 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-white/10"
            >
              Sync Production DNA
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function SettingsPage() {
  const { theme, setTheme, aiMode, setAiMode, isAdmin, setIsAdmin, isProtocolAccepted, activeEmpire: empireData, registerRefreshHandler } = useEmpire();
  const { isLinked: isStripeLinked } = useStripeStatus();

  const [activeTab, setActiveTab] = useState('link-center');
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  useEffect(() => {
    return registerRefreshHandler(async () => { await new Promise(r => setTimeout(r, 1000)); });
  }, [registerRefreshHandler]);

  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      const tabId = e.detail;
      setActiveTab(tabId);
      
      // Update URL without a full page refresh to keep things stable
      const newUrl = `${window.location.pathname}?tab=${tabId}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
      
      // Smooth scroll the tab into view
      setTimeout(() => {
        const tabEl = document.getElementById(`tab-${tabId}`);
        if (tabEl) {
          tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 100);
    };

    window.addEventListener('empire:switch-tab', handleSwitchTab);
    return () => window.removeEventListener('empire:switch-tab', handleSwitchTab);
  }, []);

  const tabs = [
    { id: 'link-center', name: 'Link Center', icon: Share2 },
    { id: 'financials', name: 'Financials', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'support-hub', name: 'Support Hub', icon: LifeBuoy },
    { id: 'theme-style', name: 'Theme & Style', icon: Palette },
    { id: 'subscription', name: 'Subscription', icon: Diamond }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Electric Empire', primary: '#7c3aed', secondary: '#3b82f6', description: 'Deep Violet-to-Electric Blue shimmer.' },
    { id: 'emerald', name: 'Growth Green', primary: '#10b981', secondary: '#059669', description: 'Focused on clarity and profitability.' },
    { id: 'pink', name: 'Electric Pink', primary: '#ff0099', secondary: '#be185d', description: 'High-energy vibrant neon aesthetic.' },
    { id: 'vibrant-cyan', name: 'Cyan Teal', primary: '#00ffff', secondary: '#008080', description: 'Cybernetic and fresh digital appearance.' },
    { id: 'electric-blue', name: 'Neon Blue', primary: '#00a2ff', secondary: '#0369a1', description: 'High-voltage neon sky blue.' }
  ];

  return (
      <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
        
        {/* 1. Identity Header */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Link Center Active</span>
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Mail className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold text-white/60">stacipeabody@gmail.com</span>
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
            {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE') ? "EmpireLaunch AI" : (empireData?.name || empireData?.title || "EmpireLaunch AI")}
          </h1>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 relative items-start">
            {/* Sidebar Navigation - Long Rounded Box down the side */}
            <aside className="lg:w-64 w-full shrink-0">
              <div className="flex flex-row lg:flex-col bg-theme-background p-1.5 rounded-[24px] lg:rounded-[32px] w-full border-2 border-theme sticky top-0 lg:top-8 z-20 gap-1.5 overflow-x-auto scrollbar-hide lg:overflow-visible touch-pan-x">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-none lg:flex-none flex items-center justify-center lg:justify-start gap-2 px-4 lg:px-6 py-3 lg:py-4 rounded-[18px] lg:rounded-[24px] font-black text-[9px] lg:text-[10px] uppercase tracking-tighter transition-all whitespace-nowrap lg:whitespace-normal",
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] border-white/20"
                        : "text-white/40 hover:text-white hover:bg-theme-surface/50"
                    )}
                  >
                    <tab.icon className={cn("w-3.5 h-3.5 lg:w-4 h-4", activeTab === tab.id ? "text-white" : "text-white/40")} />
                    <span className="truncate">{tab.name}</span>
                    {activeTab === tab.id && <ChevronRight className="hidden lg:block w-3 h-3 ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </aside>

            <main className="flex-1">
              {activeTab === 'financials' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!isProtocolAccepted && (
                    <div className="p-6 bg-amber-500/10 border-2 border-amber-500/20 rounded-[32px] flex items-center gap-4">
                      <Lock className="w-6 h-6 text-amber-500 shrink-0" />
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-tight">
                        Financial configuration is locked until the <span className="text-slate-950">Partner Protocol</span> is accepted on the Dashboard.
                      </p>
                    </div>
                  )}
                  <div className={cn(
                    "p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-2 border-theme space-y-8 transition-all",
                    !isProtocolAccepted && "opacity-50 pointer-events-none grayscale"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic">Empire Financials</h3>
                        <p className="text-sm font-medium text-muted-foreground">Authorize your banking gateway for automated revenue collection.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Bank Account Nickname</label>
                        <input type="text" placeholder="e.g. Empire Main Operating" className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-lg" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Revenue Tracking & Success-Share Gateway</label>
                        <p className="text-[10px] text-slate-500 italic">Select how the Empire AI monitors your sales on Etsy, TikTok, and Fiverr, and where direct-to-consumer payouts are routed.</p>
                        <select className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold appearance-none text-lg">
                          <option>Stripe Connect (Recommended for Direct Sales)</option>
                          <option>External Marketplace Tracking (Etsy/Fiverr/TT Only)</option>
                          <option>Direct Bank Transfer (Manual Audit Required)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-white uppercase italic tracking-wider">Gateway Configuration</h4>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase",
                          isStripeLinked ? "bg-emerald-500/10 text-emerald-500" : "bg-cyan-500/10 text-cyan-400"
                        )}>
                          {isStripeLinked ? "Connected & Live" : "Pending Setup"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {isStripeLinked 
                          ? "Your Stripe account is successfully linked. All 'Buy' buttons are now active and routing funds directly to your verified bank account."
                          : "To enable 'Buy' buttons on social media and automated invoicing, you must link your payout account. All transactions are safeguarded with hardware-level encryption."
                        }
                      </p>

                      <button 
                        onClick={() => setActiveTab('link-center')}
                        className={cn(
                          "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl",
                          isStripeLinked 
                            ? "bg-white/10 text-white hover:bg-white/20 shadow-none" 
                            : "bg-primary text-slate-950 hover:bg-white shadow-cyan-900/20"
                        )}
                      >
                        {isStripeLinked ? "Manage Payout Gateway" : "Setup Payout Gateway"}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 pt-4 opacity-50 grayscale">
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Secure Bank Bridge</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'link-center' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {!isProtocolAccepted && (
                    <div className="p-6 bg-blue-500/10 border-2 border-blue-500/20 rounded-[32px] flex items-center gap-4">
                      <Lock className="w-6 h-6 text-blue-500 shrink-0" />
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-tight">
                        Platform linking is locked until the <span className="text-slate-950">Partner Protocol</span> is accepted on the Dashboard.
                      </p>
                    </div>
                  )}
                  {activePlatform && <IntegrationForm platform={activePlatform} onClose={() => setActivePlatform(null)} />}
                  <div className={cn(
                    "p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-2 border-theme space-y-8 transition-all",
                    !isProtocolAccepted && "opacity-50 pointer-events-none grayscale"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Share2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Channel Authorization</h3>
                        <p className="text-sm font-medium text-muted-foreground">Manage connections for automated marketing and fulfillment.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {['Etsy', 'TikTok', 'Instagram', 'YouTube', 'Facebook', 'Gmail', 'Fiverr', 'Stripe', 'Canva', 'Kittl', 'CapCut', 'Bannerbear'].map((p) => {
                        const id = p.toLowerCase().replace(' ', '_');
                        const isConnected = connectedPlatforms.includes(id) || (id === 'stripe' && isStripeLinked);
                        
                        return (
                          <button 
                            key={p} 
                            onClick={() => !isConnected && setActivePlatform(p)} 
                            className={cn(
                              "p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                              isConnected ? "border-emerald-600 bg-emerald-900/20 cursor-default" : "border-theme bg-theme-background hover:border-primary/50"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                              isConnected ? "bg-emerald-900/40" : "bg-theme-surface group-hover:bg-primary/20"
                            )}>
                              {isConnected 
                                ? <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                : <Bot className={cn("w-6 h-6 transition-colors", "text-white/40 group-hover:text-primary")} />
                              }
                            </div>
                            <div className="flex flex-col items-center">
                              <span className={cn(
                                "font-black text-[10px] uppercase tracking-widest",
                                isConnected ? "text-emerald-500" : "text-white/60 group-hover:text-white"
                              )}>{p}</span>
                              {isConnected && (
                                <span className="text-[7px] font-black text-emerald-500/60 uppercase tracking-tighter mt-1">Verified & Linked</span>
                              )}
                            </div>
                            
                            {isConnected && (
                              <div className="absolute top-2 right-2">
                                <Lock className="w-3 h-3 text-emerald-500/30" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic">Intelligence Pulse</h3>
                        <p className="text-sm font-medium text-muted-foreground">Configure how your Empire alerts you of critical events.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: 'sales', name: 'New Revenue Milestones', desc: 'Notify when customers click your social "Buy" buttons.' },
                        { id: 'content', name: 'Content Ready for Review', desc: 'Alert when a high-converting video is drafted and ready.' },
                        { id: 'trends', name: 'Market Pivot Detected', desc: 'AI found a new trend your empire should capitalize on.' }
                      ].map((n) => (
                        <div key={n.id} className="flex items-center justify-between p-6 bg-theme-background border-2 border-theme rounded-3xl group hover:border-primary/50 transition-all">
                          <div className="space-y-1">
                            <h4 className="font-bold text-white">{n.name}</h4>
                            <p className="text-xs text-white/40">{n.desc}</p>
                          </div>
                          <div className="w-14 h-8 bg-primary/20 rounded-full flex items-center px-1 shadow-inner relative border border-primary/30">
                             <div className="w-6 h-6 bg-white rounded-full shadow-lg absolute right-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'theme-style' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Palette className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Color Scheme</h3>
                        <p className="text-sm font-medium text-muted-foreground">Personalize your Command Center aesthetics.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {colorSchemes.map((scheme) => (
                        <button 
                          key={scheme.id} 
                          onClick={() => setTheme(scheme.id)} 
                          className={cn(
                            "p-6 rounded-[32px] border-4 text-left transition-all space-y-4 group", 
                            theme === scheme.id ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]" : "border-theme bg-theme-background hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-end gap-3">
                              <div 
                                className="w-10 h-10 rounded-2xl border-2 static-border shadow-lg shadow-black/40" 
                                style={{ backgroundColor: scheme.primary }} 
                              />
                              <div 
                                className="w-6 h-6 rounded-lg border static-border" 
                                style={{ backgroundColor: scheme.secondary }} 
                              />
                            </div>
                            {theme === scheme.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-foreground uppercase italic">{scheme.name}</h4>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight italic">{scheme.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'support-hub' && <SupportHub />}

              {activeTab === 'subscription' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Unified Subscription & Milestone Protocol Box */}
                  <div className="p-8 md:p-12 bg-slate-900 border-2 border-primary/30 rounded-[48px] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    
                    <div className="space-y-12 relative z-10">
                      {/* Header Section */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <Diamond className="w-10 h-10 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Empire Elite</h3>
                            <div className="flex items-center gap-2 text-emerald-500 mt-1">
                               <ShieldCheck className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Partnership Active</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 text-center md:text-right">
                           <div className="text-4xl font-black text-white tracking-tighter">$40<span className="text-lg text-white/40">/mo</span></div>
                           <span className="text-[10px] font-black text-slate-500 block uppercase tracking-widest mt-1">Base Subscription</span>
                        </div>
                      </div>

                      {/* Agreement & Protocol Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Stars className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-white uppercase italic tracking-wider">Success-Share Agreement</h4>
                        </div>
                        <p className="text-sm md:text-base text-slate-400 font-medium italic leading-relaxed max-w-4xl">
                          "To keep the Empire AI accessible, we operate on a performance-based partnership. A simple <span className="text-white font-bold">$40 Success-Share</span> is applied for every <span className="text-white font-bold">$1,000</span> earned through AI-generated assets (videos, posts, designs). This ensures we only grow when you grow. By maintaining this subscription, you authorize the Empire AI to act as your autonomous growth agent."
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                           <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                               <DollarSign className="w-4 h-4 text-primary" />
                               <span className="text-[10px] font-black text-primary uppercase tracking-widest">$40 / $1k Milestone Protocol</span>
                           </div>
                           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Auto-Pilot Authorized</span>
                           </div>
                        </div>
                      </div>

                      {/* Tier Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-4 group hover:bg-white/[0.07] transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Empire Expansion</h4>
                            <p className="text-xl font-black text-white mt-1">$40 Unlock + $40/mo</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 italic">Per additional business slot. Activated immediately upon node initialization.</p>
                          </div>
                        </div>
                        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-4 group hover:bg-white/[0.07] transition-all">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Milestone Payouts</h4>
                            <p className="text-xl font-black text-white mt-1">Automatic & Secured</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 italic">Success-shares are processed automatically as revenue milestones are reached.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-8">
                    <button 
                      className="group relative px-12 py-6 bg-red-600 hover:bg-red-500 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] active:scale-95 overflow-hidden"
                      onClick={() => {
                        if (confirm("Are you absolutely sure? Your Empire growth protocols will be terminated immediately.")) {
                          alert("This is a master account. Deletion protocol suppressed.");
                        }
                      }}
                    >
                      <span className="relative z-10">I'm sure I want to lose my empire now</span>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-25deg]" />
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FeedbackBox />
          </motion.div>

          {/* Version Verification */}
          <div className="flex justify-center pb-20">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.0.2 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
  );
}
