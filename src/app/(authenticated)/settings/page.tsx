"use client";

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Share2, 
  CreditCard, 
  Bell, 
  Shield, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Bot,
  ChevronRight,
  X,
  Zap,
  User,
  Building2,
  Lock,
  Diamond,
  Power,
  Palette,
  Scale,
  LifeBuoy,
  Stars,
  Globe,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SecureVault } from '@/components/Financial/SecureVault';
import { SupportHub } from '@/components/Settings/SupportHub';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { TermsModal } from '@/components/Legal/TermsModal';

const IntegrationForm = ({ platform, onClose }: { platform: string, onClose: () => void }) => {
  if (platform.toLowerCase() === 'etsy') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-8 rounded-[40px] bg-theme-surface border-4 border-primary shadow-2xl space-y-8 relative overflow-hidden">
          {/* AI Brain Pulse in background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10" />
          
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Bot className="w-6 h-6 text-primary" /> Connecting Etsy Marketplace
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Etsy API Key (Keystring)</label>
              <input
                id="etsy-api-key"
                type="text"
                placeholder="Paste keystring here..."
                className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-lg"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Shared Secret</label>
              <input
                id="etsy-shared-secret"
                type="text"
                placeholder="Paste secret here..."
                className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-lg"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
            <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-blue-200">Save Connection</button>
          </div>
        </div>
      </div>
    );
  }

  if (platform.toLowerCase() === 'tiktok') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-8 rounded-[40px] bg-theme-surface border-4 border-slate-900 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 blur-[80px] -z-10" />

          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Share2 className="w-6 h-6 text-primary" /> Connecting TikTok Marketing
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">App Type</label>
              <div className="relative">
                <select
                  id="tiktok-marketing-api"
                  className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold appearance-none text-lg"
                >
                  <option>Select...</option>
                  <option>Marketing API</option>
                  <option>Display API</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Redirect URI</label>
              <input
                id="tiktok-redirect-uri"
                type="text"
                readOnly
                value="https://empire-launch-ai-frontend.vercel.app/api/auth/callback/tiktok"
                className="w-full p-5 rounded-3xl bg-slate-100 border-2 border-theme outline-none transition-all font-bold text-lg text-theme-background0 cursor-not-allowed"
              />
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

  if (platform.toLowerCase() === 'bannerbear') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 mb-12">
        <div className="p-8 rounded-[40px] bg-theme-surface border-4 border-theme shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 blur-[80px] -z-10" />
          
          <div className="flex items-center justify-between border-b border-theme pb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3 italic">
              <Stars className="w-6 h-6 text-foreground" /> Connecting Bannerbear AI
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Project API Key</label>
              <input
                id="bannerbear-api-key"
                type="password"
                placeholder="Paste your Bannerbear API key..."
                className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-lg"
              />
            </div>
            
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="text-xs font-bold text-primary leading-relaxed text-center">
                <Bot className="w-4 h-4 inline mr-2" />
                This key allows the Empire AI to automatically generate your social media graphics and videos using your Bannerbear templates.
              </p>
              <div className="mt-3 pt-3 border-t border-primary/20/50 flex flex-col items-center">
                <p className="text-[10px] text-primary uppercase tracking-widest font-black mb-1">Workflow Note</p>
                <p className="text-[11px] font-medium text-primary/80">Part of your <span className="font-black italic">Creative Blueprint</span> for autonomous asset production.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Connect API</button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

const tabs = [
  { id: 'link-center', name: 'Link Center', icon: Share2 },
  { id: 'ai-intelligence', name: 'AI Intelligence', icon: Zap },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'support-hub', name: 'Support Hub', icon: LifeBuoy },
  { id: 'user-info', name: 'User Info', icon: User },
  { id: 'bank-info', name: 'Bank Info', icon: Building2 },
  { id: 'theme-style', name: 'Theme & Style', icon: Palette },
  { id: 'cloud-storage', name: 'Cloud & Storage', icon: Globe },
  { id: 'account-settings', name: 'Account Settings', icon: Lock },
  { id: 'subscription', name: 'Subscription', icon: Diamond },
];

export default function SettingsPage() {
  const { 
    startSetup, 
    activeSetupPlatform, 
    finishSetup, 
    theme, 
    setTheme, 
    aiMode, 
    setAiMode,
    bankConnected,
    setBankConnected,
    directToBank,
    setDirectToBank,
    notificationSettings,
    updateNotificationSettings,
    addToast
  } = useEmpire();
  const [activeTab, setActiveTab] = useState('link-center');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  
  const [redeemKeyValue, setRedeemKeyValue] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleRedeem = async () => {
    if (!redeemKeyValue) return;
    setIsRedeeming(true);
    setRedeemStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/redeem-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key: redeemKeyValue, 
          userId: '00000000-0000-0000-0000-000000000000' 
        })
      });
      if (res.ok) {
        setRedeemStatus({ type: 'success', message: 'Key redeemed successfully! Account upgraded.' });
        setRedeemKeyValue('');
      } else {
        const data = await res.json();
        setRedeemStatus({ type: 'error', message: data.error || 'Invalid or expired key.' });
      }
    } catch (e) {
      setRedeemStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setIsRedeeming(false);
    }
  };

  const colorSchemes = [
    { id: 'classic-blue', name: 'Classic Blue', primary: 'bg-primary', secondary: 'bg-slate-900', description: 'The original high-velocity interface.' },
    { id: 'empire-gold', name: 'Empire Gold', primary: 'bg-amber-400', secondary: 'bg-slate-900', description: 'Luxurious gold and obsidian for a premium aesthetic.' },
    { id: 'emerald-growth', name: 'Emerald Growth', primary: 'bg-emerald-600', secondary: 'bg-slate-900', description: 'Focus on revenue and prosperity.' },
    { id: 'rose-gold', name: 'Rose Gold', primary: 'bg-rose-500', secondary: 'bg-slate-900', description: 'Premium, elegant aesthetic for luxury brands.' },
    { id: 'cyber-purple', name: 'Cyber Purple', primary: 'bg-purple-600', secondary: 'bg-indigo-900', description: 'High-intelligence futuristic look.' },
  ];

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const [isSwitching, setIsSwitching] = useState(false);

  const handleAiModeToggle = async (mode: 'co-pilot' | 'empire') => {
    if (mode === aiMode) return;
    setIsSwitching(true);
    // Simulate neural syncing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setAiMode(mode);
    setIsSwitching(false);
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12 pb-32">
      <AnimatePresence>
          {isSwitching && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-theme-surface p-8 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div>
                  <h4 className="font-black text-foreground">Neural Syncing...</h4>
                  <p className="text-xs font-medium text-theme-background0">Recalibrating AI autonomy protocols.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-3">
              Settings
            </h1>
            <p className="text-theme-background0 mt-2 text-base md:text-lg font-medium">
              Manage your Empire configuration and account security.
            </p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Navigation Sidebar */}
          <aside className="flex md:flex-col overflow-x-auto md:overflow-visible w-full md:w-64 shrink-0 gap-2 pb-2 md:pb-0 border-b md:border-b-0 border-theme md:border-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-theme-background"
                )}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                {tab.name}
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            {activeTab === 'link-center' && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Integration Form Overlay */}
                {activeSetupPlatform && (
                  <IntegrationForm 
                    platform={activeSetupPlatform} 
                    onClose={() => finishSetup()} 
                  />
                )}

                {/* Search Bar for Apps */}
                {!activeSetupPlatform && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for apps you want to link (e.g. Etsy, TikTok, Shopify, Pinterest...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-[28px] bg-theme-surface border-2 border-theme focus:border-primary outline-none transition-all text-lg font-bold text-foreground shadow-sm"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => {
                          startSetup(searchQuery);
                          setSearchQuery('');
                        }}
                        className="absolute right-3 top-2 bottom-2 px-6 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Link App
                      </button>
                    )}
                  </div>
                )}

                {/* Integrations Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold italic flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" /> Etsy Marketplace
                      </h3>
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest">
                        <AlertCircle className="w-4 h-4" /> Setup Required
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Connect your Etsy account to allow the AI to research trends and manage your shop listings automatically.
                    </p>

                    <button 
                      onClick={() => {
                        window.open('https://www.etsy.com/developers/register', '_blank');
                        startSetup('etsy');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-foreground/20 group"
                    >
                      Launch Guided Setup <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="p-8 rounded-[32px] bg-theme-background border-2 border-theme space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold italic flex items-center gap-2 text-foreground">
                        <Share2 className="w-5 h-5 text-primary" /> TikTok Marketing
                      </h3>
                      <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-widest">
                        <AlertCircle className="w-4 h-4" /> Setup Required
                      </span>
                    </div>
                    
                    <p className="text-theme-background0 text-sm leading-relaxed">
                      Link TikTok for Business to automate your viral marketing campaigns and video scheduling.
                    </p>

                    <button 
                      onClick={() => {
                        window.open('https://business-api.tiktok.com/portal/app', '_blank');
                        startSetup('tiktok');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
                    >
                      Launch Guided Setup <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="p-8 rounded-[32px] bg-theme-surface border-2 border-theme space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold italic flex items-center gap-2 text-foreground">
                        <Stars className="w-5 h-5 text-foreground" /> Bannerbear AI
                      </h3>
                      <span className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                        <Stars className="w-3.5 h-3.5" /> API Ready
                      </span>
                    </div>
                    
                    <p className="text-theme-background0 text-sm leading-relaxed">
                      Automate your creative production. Link Bannerbear to generate high-converting social assets and videos from templates.
                    </p>

                    <button 
                      onClick={() => {
                        window.open('https://www.bannerbear.com/dashboard', '_blank');
                        startSetup('bannerbear');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-foreground text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-200 group"
                    >
                      Connect Project API <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Secure Vault Section */}
                <SecureVault />
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
                      <h3 className="text-xl font-black text-foreground tracking-tight">AI Control Mode</h3>
                      <p className="text-sm font-medium text-theme-background0">Choose how much autonomy your AI partner has.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      id="mode-copilot"
                      onClick={() => handleAiModeToggle('co-pilot')}
                      className={cn(
                        "p-6 rounded-[32px] border-4 text-left transition-all space-y-4 relative overflow-hidden",
                        aiMode === 'co-pilot' ? "border-amber-400 bg-amber-50/50" : "border-theme bg-theme-surface hover:border-theme"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Bot className={cn("w-8 h-8", aiMode === 'co-pilot' ? "text-amber-600" : "text-slate-300")} />
                        {aiMode === 'co-pilot' && (
                          <div className="bg-amber-400 text-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-foreground">Co-Pilot</h4>
                        <p className="text-xs font-bold text-theme-background0 leading-relaxed">
                          AI makes suggestions and researches trends, but waits for your approval before posting or listing items.
                        </p>
                      </div>
                    </button>

                    <button
                      id="mode-autopilot"
                      onClick={() => handleAiModeToggle('empire')}
                      className={cn(
                        "p-6 rounded-[32px] border-4 text-left transition-all space-y-4 relative overflow-hidden",
                        aiMode === 'empire' ? "border-amber-400 bg-amber-50/50" : "border-theme bg-theme-surface hover:border-theme"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Power className={cn("w-8 h-8", aiMode === 'empire' ? "text-amber-600" : "text-slate-300")} />
                        {aiMode === 'empire' && (
                          <div className="bg-amber-400 text-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-foreground">Empire Mode</h4>
                        <p className="text-xs font-bold text-theme-background0 leading-relaxed">
                          AI executes strategies, posts content, and manages listings autonomously to maximize growth 24/7.
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Direct to Bank Toggle */}
                  <div className="p-8 rounded-[32px] bg-theme-surface border-2 border-theme space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-foreground">Direct-to-Bank Revenue</h4>
                          <p className="text-xs font-bold text-theme-background0">Ensure all generated revenue bypasses intermediaries.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDirectToBank(!directToBank)}
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative flex items-center px-1",
                          directToBank ? "bg-emerald-600" : "bg-slate-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: directToBank ? 24 : 0 }}
                          className="w-6 h-6 bg-white rounded-full shadow-md"
                        />
                      </button>
                    </div>
                    {directToBank && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Revenue Flow: Verified Path
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-900 rounded-3xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Bot className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Empire Wisdom</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      Empire Mode is recommended for maximum velocity once your initial strategy is calibrated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Notification Channels</h3>
                      <p className="text-sm font-medium text-theme-background0">Configure how and when your Empire alerts you.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-theme-background border-2 border-theme">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-theme-surface flex items-center justify-center text-primary shadow-sm">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-foreground">Sales Notifications</h4>
                          <p className="text-xs font-bold text-theme-background0">Get alerted instantly when a customer makes a purchase.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateNotificationSettings({ sales: !notificationSettings.sales })}
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative flex items-center px-1",
                          notificationSettings.sales ? "bg-primary" : "bg-slate-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: notificationSettings.sales ? 24 : 0 }}
                          className="w-6 h-6 bg-theme-surface rounded-full shadow-md"
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-3xl bg-theme-background border-2 border-theme">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-theme-surface flex items-center justify-center text-primary shadow-sm">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-foreground">Approval Requests</h4>
                          <p className="text-xs font-bold text-theme-background0">Notifications for when your AI needs you to review content or strategies.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateNotificationSettings({ approvals: !notificationSettings.approvals })}
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative flex items-center px-1",
                          notificationSettings.approvals ? "bg-primary" : "bg-slate-200"
                        )}
                      >
                        <motion.div 
                          animate={{ x: notificationSettings.approvals ? 24 : 0 }}
                          className="w-6 h-6 bg-theme-surface rounded-full shadow-md"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-primary rounded-3xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-blue-200" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Real-Time Sync</span>
                    </div>
                    <p className="text-sm font-medium text-primary/10/80 leading-relaxed">
                      All notifications are delivered via our low-latency neural bridge directly to your command center and linked devices.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'support-hub' && <SupportHub />}

            {activeTab === 'user-info' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Profile Information</h3>
                      <p className="text-sm font-medium text-theme-background0">How your empire recognizes you.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <input type="text" placeholder="Your Name" className="w-full p-4 rounded-2xl bg-theme-background border-2 border-theme font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input type="email" placeholder="email@example.com" className="w-full p-4 rounded-2xl bg-theme-background border-2 border-theme font-bold" />
                    </div>
                  </div>

                  <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'bank-info' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Payout Destination</h3>
                      <p className="text-sm font-medium text-theme-background0">Securely link your bank for direct revenue transfers.</p>
                    </div>
                  </div>

                  {!bankConnected ? (
                    <div className="p-8 bg-theme-background rounded-[32px] border-2 border-dashed border-theme text-center space-y-6 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors" />
                      <div className="relative z-10 w-20 h-20 rounded-full bg-theme-surface shadow-lg flex items-center justify-center mx-auto border-2 border-theme-background">
                        <Shield className="w-10 h-10 text-slate-300" />
                      </div>
                      <div className="relative z-10 space-y-2">
                        <h4 className="text-lg font-black text-foreground tracking-tight">Secured by Stripe Connect</h4>
                        <p className="text-xs font-bold text-theme-background0 max-w-sm mx-auto leading-relaxed">
                          Link your bank account to receive payments directly. Your data is encrypted and handled by industry-standard protocols.
                        </p>
                      </div>
                      <button 
                        onClick={async () => {
                          window.open('https://connect.stripe.com/oauth/authorize', '_blank');
                          // Simulate onboarding
                          await new Promise(r => setTimeout(r, 2000));
                          setBankConnected(true);
                          addToast({
                            title: 'Bank Linked',
                            message: 'Your payout destination has been successfully verified.',
                            type: 'success'
                          });
                        }}
                        className="relative z-10 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3 mx-auto"
                      >
                        Start Secure Onboarding <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-8 rounded-[32px] bg-emerald-50 border-4 border-emerald-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Primary Payout Method</p>
                          <h4 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            JP Morgan Chase <span className="text-sm font-bold text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-100">VERIFIED</span>
                          </h4>
                        </div>
                        <div className="mt-8 flex items-center gap-12">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Number</p>
                            <p className="font-mono font-bold text-slate-600">•••• •••• 4242</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Routing Number</p>
                            <p className="font-mono font-bold text-slate-600">•••• •••• 1234</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setBankConnected(false)}
                          className="px-6 py-4 bg-white border-2 border-slate-200 text-theme-background0 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-theme-background transition-all"
                        >
                          Disconnect Account
                        </button>
                        <button className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                          View Payout Schedule <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-6 bg-slate-900 rounded-3xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Security Protocol</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      Revenue is deposited directly to your bank account within 2-3 business days of a sale. No middleman, no delays.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme-style' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Color Scheme</h3>
                      <p className="text-sm font-medium text-theme-background0">Personalize your Command Center's aesthetic.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {colorSchemes.map((scheme) => (
                      <button 
                        key={scheme.id}
                        onClick={() => setTheme(scheme.id)}
                        className={cn(
                          "p-6 rounded-[32px] border-4 text-left transition-all space-y-4 group",
                          theme === scheme.id ? "border-primary bg-primary/10" : "border-theme-background bg-theme-background/50 hover:border-theme"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <div className={cn("w-6 h-6 rounded-full shadow-inner", scheme.primary)} />
                            <div className={cn("w-6 h-6 rounded-full shadow-inner", scheme.secondary)} />
                          </div>
                          {theme === scheme.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-foreground">{scheme.name}</h4>
                          <p className="text-xs font-bold text-theme-background0 leading-relaxed">
                            {scheme.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 bg-slate-900 rounded-3xl text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Stars className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Tip</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      Your color scheme syncs across all your devices linked to this empire.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cloud-storage' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">Empire Cloud Hub</h3>
                    <p className="text-sm font-medium text-theme-background0">Manage your high-velocity storage and global data sync.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Neural Storage Pool</p>
                      <h4 className="text-3xl font-black">Unlimited.</h4>
                      <p className="text-slate-400 text-xs font-medium mt-4 leading-relaxed">
                        Your videos, graphics, and business assets are automatically hosted on our global high-speed CDNs.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                  </div>

                  <div className="p-8 rounded-[32px] bg-theme-background border-2 border-theme space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Data Integrity</p>
                      <h4 className="text-xl font-black text-foreground italic">Protected.</h4>
                      <p className="text-theme-background0 text-xs font-medium mt-4 leading-relaxed">
                        Redundant backups across 3 global regions. Your financial and personal data is never stored locally.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Enterprise Scale Active</span>
                  </div>
                  <p className="text-sm font-medium text-foreground/70">
                    EmpireLaunch AI utilizes a decentralized storage mesh. As you create more content, your cloud footprint automatically scales to match your velocity without additional fees.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account-settings' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Account & Security</h3>
                      <p className="text-sm font-medium text-theme-background0">Manage your password and security protocols.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <button className="w-full flex items-center justify-between p-6 rounded-3xl bg-theme-background border-2 border-theme hover:border-slate-300 transition-all group">
                      <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                          <h4 className="font-black text-foreground">Two-Factor Authentication</h4>
                          <p className="text-xs font-bold text-theme-background0">Add an extra layer of security to your empire.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Redeem Key Section */}
                    <div className="p-8 rounded-[32px] bg-primary/10 border-2 border-primary/20 space-y-4">
                      <div className="flex items-center gap-3">
                        <Stars className="w-5 h-5 text-primary" />
                        <h4 className="font-black text-foreground">Redeem Access Key</h4>
                      </div>
                      <p className="text-xs font-bold text-theme-background0 leading-relaxed">
                        If you have an Empire Launch key, enter it below to upgrade your account or extend your subscription.
                      </p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="ENTER-KEY-HERE"
                          value={redeemKeyValue}
                          onChange={(e) => setRedeemKeyValue(e.target.value.toUpperCase())}
                          disabled={isRedeeming}
                          className="flex-1 p-4 rounded-2xl bg-theme-surface border-2 border-primary/20 focus:border-primary outline-none font-mono text-sm uppercase tracking-widest disabled:opacity-50"
                        />
                        <button 
                          onClick={handleRedeem}
                          disabled={isRedeeming || !redeemKeyValue}
                          className="px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redeem'}
                        </button>
                      </div>
                      {redeemStatus && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-4 rounded-2xl text-xs font-bold flex items-center gap-2",
                            redeemStatus.type === 'success' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}
                        >
                          {redeemStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {redeemStatus.message}
                        </motion.div>
                      )}
                    </div>

                    <button className="w-full flex items-center justify-between p-6 rounded-3xl bg-theme-background border-2 border-theme hover:border-slate-300 transition-all group">
                      <div className="flex items-center gap-4">
                        <Lock className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                          <h4 className="font-black text-foreground">Change Password</h4>
                          <p className="text-xs font-bold text-theme-background0">Update your access credentials.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                      onClick={() => setIsTermsOpen(true)}
                      className="w-full flex items-center justify-between p-6 rounded-3xl bg-theme-background border-2 border-theme hover:border-slate-300 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <Scale className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                          <h4 className="font-black text-foreground">Neural Agreement</h4>
                          <p className="text-xs font-bold text-theme-background0">Review our Data Protection & AI Approval policies.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <TermsModal 
                  isOpen={isTermsOpen} 
                  onClose={() => setIsTermsOpen(false)} 
                  onAccept={() => setIsTermsOpen(false)} 
                />
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-theme-surface/10 flex items-center justify-center backdrop-blur-md">
                        <Diamond className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight">Empire Elite Plan</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Status: Active</p>
                      </div>
                    </div>
                    <div className="px-6 py-2 bg-primary/20 border border-primary/40 rounded-full text-blue-300 font-black text-[10px] uppercase tracking-widest">
                      Next Payout: June 1st
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-theme-surface/5 border border-white/10">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Monthly Fee</p>
                      <p className="text-2xl font-black tracking-tight">$30<span className="text-sm text-theme-background0">/mo</span></p>
                    </div>
                    <div className="p-6 rounded-3xl bg-theme-surface/5 border border-white/10">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Post Autonomy</p>
                      <p className="text-2xl font-black tracking-tight">Unlimited</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-theme-surface/5 border border-white/10">
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Trend Velocity</p>
                      <p className="text-2xl font-black tracking-tight">Real-Time</p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 flex flex-col md:flex-row items-center gap-8 border-t border-white/10">
                    <p className="text-sm font-medium text-slate-400 flex-1">
                      Auto-billing is active. Your subscription renewal is managed securely via Stripe.
                    </p>
                    <button className="w-full md:w-auto px-8 py-4 bg-theme-surface/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 hover:border-red-500/20">
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-foreground">Unlock Business 2</h4>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">$30 One-time</span>
                      </div>
                      <p className="text-sm text-theme-background0 font-medium">Add a second independent business slot to your Empire dashboard.</p>
                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200">
                        Purchase Slot
                      </button>
                   </div>

                   <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-foreground">Unlock Business 3</h4>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">$30 One-time</span>
                      </div>
                      <p className="text-sm text-theme-background0 font-medium">Maximize your reach with a third automated business slot.</p>
                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200">
                        Purchase Slot
                      </button>
                   </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    
  );
}
