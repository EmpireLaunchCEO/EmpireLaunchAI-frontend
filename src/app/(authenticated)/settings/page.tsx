"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { useEmpire } from '@/lib/EmpireContext';
import { useStripeStatus } from '@/lib/hooks/useStripeStatus';

const IntegrationForm = ({ platform, onClose }: { platform: string, onClose: () => void }) => {
  if (platform.toLowerCase() === 'stripe') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-8 rounded-[40px] bg-theme-surface border-4 border-emerald-600 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[80px] -z-10" />
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Connecting Stripe Gateway
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Publishable Key</label>
              <input id="stripe-pub-key" type="text" placeholder="pk_live_..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-emerald-600 outline-none transition-all font-bold text-lg" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Secret Key</label>
              <input id="stripe-sec-key" type="password" placeholder="sk_live_..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-emerald-600 outline-none transition-all font-bold text-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
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
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
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
        <div className="p-8 rounded-[40px] bg-theme-surface border-4 border-blue-600 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -z-10" />
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Bot className="w-6 h-6 text-blue-600" /> Connecting Etsy Marketplace
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Etsy API Key (Keystring)</label>
              <input id="etsy-api-key" type="password" placeholder="Paste your Keystring..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-blue-600 outline-none transition-all font-bold text-lg" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Shared Secret</label>
              <input id="etsy-shared-secret" type="password" placeholder="Paste your Shared Secret..." className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-blue-600 outline-none transition-all font-bold text-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
            <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Save Connection</button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'tiktok') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-8 rounded-[40px] bg-theme-surface border-4 border-slate-900 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Share2 className="w-6 h-6 text-blue-600" /> Connecting TikTok Marketing
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">App Type</label>
              <select className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-blue-600 outline-none transition-all font-bold appearance-none text-lg">
                <option>Marketing API</option>
                <option>Display API</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Redirect URI</label>
              <input type="text" readOnly value="https://empire-launch-ai-frontend.vercel.app/api/auth/callback/tiktok" className="w-full p-5 rounded-3xl bg-slate-100 border-2 border-theme outline-none transition-all font-bold text-lg text-muted-foreground cursor-not-allowed" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Sync TikTok</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const SupportHub = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
          <LifeBuoy className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground">Support & Guides</h3>
          <p className="text-sm font-medium text-muted-foreground">Get help with your Empire dashboard.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-6 rounded-3xl border border-theme bg-theme-background hover:border-blue-600 transition-all text-left">
          <h4 className="font-bold mb-1">Knowledge Base</h4>
          <p className="text-xs text-muted-foreground">Self-serve tutorials and documentation.</p>
        </button>
        <button className="p-6 rounded-3xl border border-theme bg-theme-background hover:border-blue-600 transition-all text-left">
          <h4 className="font-bold mb-1">Priority Support</h4>
          <p className="text-xs text-muted-foreground">Direct line to our technical assistants.</p>
        </button>
      </div>
    </div>
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('link-center');
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const { theme, setTheme, aiMode, setAiMode } = useEmpire();
  const { isLinked: isStripeLinked } = useStripeStatus();

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
    { id: 'ai-intelligence', name: 'AI Intelligence', icon: Zap },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'support-hub', name: 'Support Hub', icon: LifeBuoy },
    { id: 'theme-style', name: 'Theme & Style', icon: Palette },
    { id: 'subscription', name: 'Subscription', icon: Diamond }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Electric Empire', primary: '#00e5ff', secondary: '#7c3aed', description: 'Neon Cyan-to-Deep Violet standard.' },
    { id: 'emerald', name: 'Growth Green', primary: '#10b981', secondary: '#059669', description: 'Focused on clarity and profitability.' },
    { id: 'pink', name: 'Electric Pink', primary: '#ff0099', secondary: '#be185d', description: 'High-energy vibrant neon aesthetic.' },
    { id: 'vibrant-cyan', name: 'Vibrant Cyan', primary: '#00ffff', secondary: '#0891b2', description: 'Cybernetic and fresh digital appearance.' },
    { id: 'electric-blue', name: 'Neon Blue', primary: '#00a2ff', secondary: '#0369a1', description: 'High-voltage neon sky blue.' }
  ];

  return (
    <PullToRefresh onRefresh={async () => { await new Promise(r => setTimeout(r, 1000)); }}>
      <div className="overflow-auto h-full w-full">
      <div className="p-3 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-12 pb-24">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 bg-theme-surface/30 p-5 md:p-0 rounded-[24px] md:rounded-none border border-theme md:border-none">
          <div className="space-y-1">
            <h1 className="text-xl md:text-5xl font-black text-foreground tracking-tighter italic">Settings</h1>
            <p className="text-muted-foreground font-medium text-[10px] md:text-lg italic">Configure your Global Empire parameters.</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 relative">
          {/* Sidebar Navigation - Long Rounded Box down the side */}
          <aside className="lg:w-72 shrink-0">
            <div className="flex flex-row lg:flex-col bg-theme-background p-1.5 rounded-[24px] lg:rounded-[32px] w-full border-2 border-theme sticky top-0 lg:top-8 z-20 gap-1.5 overflow-x-auto no-scrollbar lg:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 px-4 lg:px-6 py-3 lg:py-4 rounded-[18px] lg:rounded-[24px] font-black text-[9px] lg:text-[10px] uppercase tracking-tighter transition-all whitespace-nowrap lg:whitespace-normal",
                    activeTab === tab.id
                      ? "bg-theme-surface text-foreground shadow-sm border border-theme"
                      : "text-slate-400 hover:text-foreground hover:bg-theme-surface/50"
                  )}
                >
                  <tab.icon className={cn("w-3.5 h-3.5 lg:w-4 h-4", activeTab === tab.id ? "text-primary" : "")} />
                  <span className="truncate">{tab.name}</span>
                  {activeTab === tab.id && <ChevronRight className="hidden lg:block w-3 h-3 ml-auto text-primary" />}
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === 'financials' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic">Empire Financials</h3>
                      <p className="text-sm font-medium text-muted-foreground">Authorize your banking gateway for automated revenue collection.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Bank Account Nickname</label>
                      <input type="text" placeholder="e.g. Empire Main Operating" className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-lg" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Settlement Method</label>
                      <select className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold appearance-none text-lg">
                        <option>Stripe Connect (Incl. Cash App, Venmo, Cards)</option>
                        <option>Direct Bank Transfer (ACH)</option>
                        <option>PayPal Business</option>
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
                {activePlatform && <IntegrationForm platform={activePlatform} onClose={() => setActivePlatform(null)} />}
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Channel Authorization</h3>
                      <p className="text-sm font-medium text-muted-foreground">Manage connections for automated marketing and fulfillment.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Etsy', 'TikTok', 'Instagram', 'YouTube', 'Facebook', 'Gmail', 'Fiverr', 'Stripe'].map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setActivePlatform(p)} 
                        className={cn(
                          "p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 group",
                          p === 'Stripe' && isStripeLinked ? "border-emerald-600 bg-emerald-50/50" : "border-theme bg-theme-background hover:border-blue-600"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          p === 'Stripe' && isStripeLinked ? "bg-emerald-100" : "bg-theme-surface group-hover:bg-blue-50"
                        )}>
                          {p === 'Stripe' && isStripeLinked 
                            ? <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            : <Bot className={cn("w-6 h-6 transition-colors", p === 'Stripe' && isStripeLinked ? "text-emerald-600" : "text-slate-400 group-hover:text-blue-600")} />
                          }
                        </div>
                        <span className={cn(
                          "font-black text-[10px] uppercase tracking-widest",
                          p === 'Stripe' && isStripeLinked ? "text-emerald-700" : "text-slate-600"
                        )}>{p}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-intelligence' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic">AI Intelligence Calibration</h3>
                      <p className="text-sm font-medium text-muted-foreground">Define how much control you hand over to your Empire Engine.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                      id="mode-copilot"
                      onClick={() => setAiMode('co-pilot')}
                      className={cn(
                        "p-8 rounded-[32px] border-4 text-left space-y-4 group relative overflow-hidden transition-all",
                        aiMode === 'co-pilot' ? "border-primary bg-primary/5" : "border-theme bg-theme-background grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-lg">
                          <Bot className="w-6 h-6" />
                        </div>
                        {aiMode === 'co-pilot' && <CheckCircle2 className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-foreground uppercase italic">Co-Pilot Mode</h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tight italic">Manual Approval Required</p>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        I'll draft everything—posts, descriptions, and price syncs—but nothing goes live until you click 'Approve'.
                      </p>
                    </button>

                    <button 
                      id="mode-autopilot"
                      onClick={() => setAiMode('empire')}
                      className={cn(
                        "p-8 rounded-[32px] border-4 text-left space-y-4 group relative overflow-hidden transition-all",
                        aiMode === 'empire' ? "border-primary bg-primary/5" : "border-theme bg-theme-background grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                          <Zap className="w-6 h-6" />
                        </div>
                        {aiMode === 'empire' && <CheckCircle2 className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-foreground uppercase italic">Auto-Pilot Mode</h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tight italic">Full Autonomous Execution</p>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        I'll autonomously manage daily operations 24/7. You only intervene for major financial pivots.
                      </p>
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                         <Stars size={10} />
                         Recommended for Growth
                      </div>
                    </button>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-[32px] border border-slate-800 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">Autonomous Safety</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-relaxed">
                        Even in Auto-Pilot, I will NEVER initiate new subscriptions or spend your money without a one-time approval for the specific transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
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
                      <div key={n.id} className="flex items-center justify-between p-6 bg-theme-background border-2 border-theme rounded-3xl group hover:border-blue-100 transition-all">
                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground">{n.name}</h4>
                          <p className="text-xs text-muted-foreground">{n.desc}</p>
                        </div>
                        <div className="w-14 h-8 bg-blue-600 rounded-full flex items-center px-1 shadow-inner relative">
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
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Color Scheme</h3>
                      <p className="text-sm font-medium text-muted-foreground">Personalize your Command Center aesthetics.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {colorSchemes.map((scheme) => (
                      <button 
                        key={scheme.id} 
                        onClick={() => setTheme(scheme.id)} 
                        className={cn(
                          "p-6 rounded-[32px] border-4 text-left transition-all space-y-4 group", 
                          theme === scheme.id ? "border-primary bg-primary/5" : "border-theme bg-theme-background hover:border-primary/10"
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
                <div className="p-8 rounded-[40px] bg-slate-900 text-white space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center">
                        <Diamond className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black italic">Empire Elite</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Base Subscription: $40 / Month</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black">$40</span>
                       <span className="text-[10px] font-black text-slate-500 block uppercase tracking-widest">Current Base</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Empire Expansion</h4>
                      <p className="text-lg font-bold">$40 Unlock + $40/mo</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Per additional business slot authorized. Charged immediately upon activation.</p>
                    </div>
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Success Fee</h4>
                      <p className="text-lg font-bold">$40 / $1,000</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Secured automatically upon revenue milestones.</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Cancel Subscription</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  </PullToRefresh>
  );
}
