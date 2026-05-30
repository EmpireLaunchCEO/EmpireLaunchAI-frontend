"use client";

import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

const IntegrationForm = ({ platform, onClose }: { platform: string, onClose: () => void }) => {
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
  const [theme, setTheme] = useState('blue');

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
    { id: 'blue', name: 'Electric Empire', primary: 'bg-blue-600', secondary: 'bg-indigo-900', description: 'The standard neon high-contrast look.' },
    { id: 'emerald', name: 'Growth Green', primary: 'bg-emerald-600', secondary: 'bg-slate-900', description: 'Focused on clarity and profitability.' }
  ];

  return (
    <PullToRefresh>
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-foreground tracking-tighter italic">Settings</h1>
            <p className="text-muted-foreground font-medium text-lg">Configure your Global Empire parameters.</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <aside className="flex md:flex-col overflow-x-auto no-scrollbar md:overflow-visible w-full md:w-64 shrink-0 gap-2 pb-2 md:pb-0 border-b md:border-b-0 border-theme md:border-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-xl scale-105" : "text-muted-foreground hover:bg-slate-100"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm uppercase tracking-widest">{tab.name}</span>
              </button>
            ))}
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Account Nickname</label>
                      <input type="text" placeholder="e.g. Empire Main Operating" className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-lg" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settlement Method</label>
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
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[8px] font-black uppercase">Pending Setup</span>
                    </div>
                    
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      "To enable 'Buy' buttons on social media and automated invoicing, you must link your payout account. All transactions are safeguarded with hardware-level encryption."
                    </p>

                    <button className="w-full py-5 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-amber-900/20">
                      Setup Payout Gateway
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
                    {['Etsy', 'TikTok', 'Instagram', 'YouTube', 'Facebook', 'Gmail', 'Fiverr'].map((p) => (
                      <button key={p} onClick={() => setActivePlatform(p)} className="p-6 rounded-[32px] border-2 border-theme bg-theme-background hover:border-blue-600 transition-all flex flex-col items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-theme-surface flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <Bot className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-600">{p}</span>
                      </button>
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
                      <button key={scheme.id} onClick={() => setTheme(scheme.id)} className={cn("p-6 rounded-[32px] border-4 text-left transition-all space-y-4 group", theme === scheme.id ? "border-blue-600 bg-blue-50" : "border-theme bg-theme-background hover:border-slate-200")}>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <div className={cn("w-6 h-6 rounded-full", scheme.primary)} />
                            <div className={cn("w-6 h-6 rounded-full", scheme.secondary)} />
                          </div>
                          {theme === scheme.id && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-foreground">{scheme.name}</h4>
                          <p className="text-xs font-bold text-muted-foreground">{scheme.description}</p>
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
    </PullToRefresh>
  );
}
