"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Palette, 
  Diamond, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Building2, 
  CreditCard,
  LifeBuoy,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { useEmpire } from '@/lib/EmpireContext';
import { useStripeStatus } from '@/lib/hooks/useStripeStatus';
import { SupportHub } from '@/components/Settings/SupportHub';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { SubscriptionSuccessShareBox } from '@/components/Dashboard/SubscriptionSuccessShareBox';

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme, isAdmin, setIsAdmin, isProtocolAccepted, acceptProtocols, connectedPlatforms, activeEmpire: empireData, registerRefreshHandler } = useEmpire();
  const { isLinked: isStripeLinked } = useStripeStatus();

  const [activeTab, setActiveTab] = useState('financials');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
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
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Settings Portal</span>
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Mail className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold text-white/60">stacipeabody@gmail.com</span>
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
            {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE' || empireData?.name === 'Business 1' || !empireData?.name) ? "EmpireLaunch AI" : (empireData?.name || empireData?.title)}
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
                        Financial configuration is locked until the <span className="text-amber-600 font-black underline underline-offset-4 decoration-amber-500/30">Partner Protocol</span> is accepted on the Dashboard.
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

                    <div className="p-8 rounded-[32px] bg-theme-background border border-theme space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-white uppercase italic tracking-wider">Gateway Configuration</h4>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase",
                          isStripeLinked ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                        )}>
                          {isStripeLinked ? "Connected & Live" : "Pending Setup"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {isStripeLinked 
                          ? "Your Stripe account is successfully linked. All 'Buy' buttons are now active and routing funds directly to your verified bank account."
                          : "To enable 'Buy' buttons on social media and automated invoicing, you must link your payout account. All transactions are safeguarded with hardware-level encryption."
                        }
                      </p>

                      <button 
                        onClick={() => router.push('/link-center')}
                        className={cn(
                          "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl",
                          isStripeLinked 
                            ? "bg-white/10 text-white hover:bg-white/20 shadow-none" 
                            : "bg-primary text-slate-950 hover:bg-white shadow-primary/20"
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

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
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
                        <div key={n.id} className="flex items-center justify-between p-6 bg-theme-background border-2 border-theme rounded-3xl group hover:border-white/50 transition-all">
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
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
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
                            theme === scheme.id ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]" : "border-theme bg-theme-background hover:border-white/30"
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
                  <SubscriptionSuccessShareBox
                    isProtocolAccepted={isProtocolAccepted}
                    onAcceptProtocol={() => acceptProtocols()}
                    totalRevenue={12450}
                    totalFees={498}
                    businessSlots={1}
                  />
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
              Command Center v3.0.2
            </span>
          </div>
        </div>
      </div>
    );
}
