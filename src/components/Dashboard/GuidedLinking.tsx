"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Stars,
  Mail,
  ShoppingBag,
  Video,
  Camera,
  Globe,
  Share2,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Palette,
  ShieldCheck,
  Cpu
  } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { useRouter } from 'next/navigation';

import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

const availablePlatforms = [
  { id: 'gmail', name: 'Gmail', icon: Mail, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'imap', name: 'Universal Email', icon: Mail, color: 'text-slate-600', bg: 'bg-theme-background' },
  { id: 'etsy', name: 'Etsy', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'shopify', name: 'Shopify', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'youtube', name: 'YouTube', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'fiverr', name: 'Fiverr', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'kittl', name: 'Kittl', icon: Palette, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'capcut', name: 'CapCut', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'canva', name: 'Canva', icon: Stars, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'bannerbear', name: 'Bannerbear', icon: Stars, color: 'text-blue-900', bg: 'bg-slate-100' },
];

interface GuidedLinkingProps {
  isReturning?: boolean;
  onClose?: () => void;
}

export function GuidedLinking({ isReturning, onClose }: GuidedLinkingProps) {
  const {
    connectedPlatforms,
    connectPlatform,
    activeSetupPlatform,
    startSetup,
    finishSetup,
    completeLinkingPhase,
    updatePlatformPermission,
    platformPermissions
  } = useEmpire();
  const router = useRouter();

  const handleComplete = () => {
    if (onClose) {
      onClose();
    } else {
      completeLinkingPhase();
      router.push('/dashboard');
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [showTeacher, setShowTeacher] = useState(true);
  const [linkingStep, setLinkingStep] = useState<'tier' | 'auth' | 'keys'>('tier');
  const [selectedTier, setSelectedTier] = useState<'co-pilot' | 'empire'>('co-pilot');

  const [teacherMessage, setTeacherMessage] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationTrigger, setConversationTrigger] = useState(0);

  const isGmailLinked = connectedPlatforms.includes('gmail') || connectedPlatforms.includes('imap');
  const hasNoPlatforms = connectedPlatforms.length === 0;

  // Multi-stage message logic
  useEffect(() => {
    let msg = "";
    if (isReturning) {
      msg = "Back for more? Let's expand your footprint. What are we linking today?";
    } else if (hasNoPlatforms) {
      msg = "This is where you search for any app you want to link. I will personally walk you through what needs to be done! Let's start with your email, that way I can get some codes that will be required and you won't have to go back and forth.";
    } else if (isGmailLinked && connectedPlatforms.length === 1) {
      msg = "Now that your email is fully linked, pick another app you're wanting to link.";
    } else if (connectedPlatforms.length === 1) {
      msg = "One down! What's next on your roadmap? Maybe your primary store like Etsy or Shopify?";
    } else {
      msg = "We're building momentum. I'm already scanning your linked accounts for trends. Do you want to link more, or are you ready to see your initial strategy?";
    }
    setTeacherMessage(msg);
  }, [connectedPlatforms.length, hasNoPlatforms, isGmailLinked, isReturning]);

  // Typing effect
  useEffect(() => {
    if (!teacherMessage) return;

    setIsTyping(true);
    setDisplayedMessage('');

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedMessage(teacherMessage.slice(0, i));

      if (i >= teacherMessage.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [teacherMessage, conversationTrigger]);

  // Contextual reactions to search
  useEffect(() => {
    if (searchQuery.toLowerCase() === 'etsy') {
      setTeacherMessage("Etsy is a powerhouse for digital products. I can help you find best-sellers there once we're linked.");
      setConversationTrigger(prev => prev + 1);
    } else if (searchQuery.toLowerCase() === 'tiktok') {
      setTeacherMessage("Great choice! TikTok is essential for brand velocity. We can automate your posting schedule once it's linked.");
    }
  }, [searchQuery]);

  const filteredPlatforms = availablePlatforms.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !connectedPlatforms.includes(p.id)
  );

  const handleSelectPlatform = (platformId: string) => {
    startSetup(platformId);
    setLinkingStep('tier');
    setSearchQuery('');

    if (platformId === 'gmail') {
      setTeacherMessage("Excellent! Choose your intelligence tier for Gmail. Co-Pilot for tracking, or Empire Mode for automated responses.");
    } else if (platformId === 'imap') {
      setTeacherMessage("Establish your neural link via IMAP. Will you lead with Co-Pilot or grant full Empire control?");
    } else {
      setTeacherMessage(`Initializing protocols for ${platformId.toUpperCase()}. Choose your access level to begin.`);
    }
    setConversationTrigger(prev => prev + 1);
  };

  const handleAuth = () => {
    // Simulate auth success
    setLinkingStep('keys');
  };

  const handleLink = () => {
    if (activeSetupPlatform) {
      connectPlatform(activeSetupPlatform);
      updatePlatformPermission(activeSetupPlatform, selectedTier);
      finishSetup();
      setLinkingStep('tier');

      if (activeSetupPlatform === 'gmail' || activeSetupPlatform === 'imap') {
        setTeacherMessage("Excellent! Your neural link to email is established. This will allow me to monitor verification codes and customer inquiries autonomously.");
        setConversationTrigger(prev => prev + 1);
      }
    }
  };

  const currentPlatform = availablePlatforms.find(p => p.id === activeSetupPlatform);

  const handleManualPreFill = () => {
    setTeacherMessage("I understand. We'll go the manual route. I'll walk you through finding the API keys for each platform one by one. Where should we start? Search for an app above.");
    setConversationTrigger(prev => prev + 1);
  };

  const handleImapStart = () => {
    setTeacherMessage("Universal IMAP is a great alternative. Enter your email and App Password below, and I'll establish the link.");
    startSetup('imap');
    setLinkingStep('auth');
    setConversationTrigger(prev => prev + 1);
  };

  const handleInterception = (input: string) => {
    const query = input.toLowerCase();
    if (query.includes('how') && query.includes('link')) {
      setTeacherMessage("Linking is easy! Just type the name of the app in the search bar above, and I'll guide you through the secure OAuth or API key setup.");
    } else if (query.includes('what') && query.includes('next')) {
      if (hasNoPlatforms) {
        setTeacherMessage("I recommend starting with your email (Gmail or Universal IMAP). It acts as the backbone for your empire's communications.");
      } else {
        setTeacherMessage("You've got your email linked. Next, let's connect a sales channel like Etsy or Shopify to start tracking your revenue.");
      }
    } else {
      setTeacherMessage("I'm processing your request... During this linking phase, I'm focused on getting your core apps connected. Ask me how to link a specific platform!");
    }
    setConversationTrigger(prev => prev + 1);
  };

  // Expose interception to window for simplicity in this prototype or use a ref in real app
  useEffect(() => {
    (window as any).interceptTeacher = handleInterception;
    return () => delete (window as any).interceptTeacher;
  }, [connectedPlatforms]);

  return (
    <div className="space-y-12 max-w-4xl mx-auto pt-10 pb-20">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for an app to link (e.g. Gmail, Etsy...)"
          className="w-full bg-theme-surface border-4 border-theme rounded-[32px] py-8 pl-20 pr-8 text-2xl font-bold focus:border-primary focus:ring-0 transition-all shadow-2xl shadow-black/20 placeholder:text-muted-foreground/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Animated Ring on focus */}
        <div className="absolute inset-0 -z-10 bg-primary/5 blur-2xl rounded-[32px] opacity-0 group-focus-within:opacity-100 transition-opacity" />

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-theme-surface border-2 border-theme rounded-[24px] shadow-2xl z-50 overflow-hidden"
            >
              {filteredPlatforms.length > 0 ? (
                <div className="p-2">
                  {filteredPlatforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => handleSelectPlatform(platform.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-theme-background rounded-xl transition-colors text-left"
                    >
                      <div className={cn("p-2 rounded-lg", platform.bg)}>
                        <platform.icon className={cn("w-5 h-5", platform.color)} />
                      </div>
                      <span className="font-bold text-foreground">{platform.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground font-medium">
                  No platforms found matching "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connected Platforms Quick View (Always visible below search) */}
      {connectedPlatforms.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Established Links</h4>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">{connectedPlatforms.length} Neural Syncs</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {connectedPlatforms.map(id => {
              const platform = availablePlatforms.find(p => p.id === id);
              if (!platform) return null;
              return (
                <motion.div
                  key={id}
                  layoutId={id}
                  className="p-6 bg-theme-surface border-2 border-theme rounded-[28px] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={cn("p-3 rounded-xl", platform.bg)}>
                    <platform.icon className={cn("w-5 h-5", platform.color)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{platform.name}</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest",
                      platformPermissions[id] === 'empire' ? "text-amber-500" : "text-primary"
                    )}>
                      {platformPermissions[id] === 'empire' ? 'Auto-Pilot' : 'Co-Pilot'}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Empire Teacher Popup (Conversational Overhaul) */}
      <AnimatePresence mode="wait">
        {showTeacher && !activeSetupPlatform && (
          <motion.div
            key={connectedPlatforms.length}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-theme-background rounded-[40px] p-10 text-foreground border border-theme relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 relative">
                  <Stars className="w-10 h-10 text-foreground" />
                  {isTyping && (
                    <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1.5 animate-bounce shadow-lg">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-theme-surface rounded-full" />
                        <div className="w-1 h-1 bg-theme-surface rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-theme-surface rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Empire Teacher</h3>
                    <div className="px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
                      <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <button onClick={() => setShowTeacher(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative min-h-[80px]">
                  <p className="text-2xl font-bold leading-snug tracking-tight text-foreground">
                    {displayedMessage}
                    {isTyping && <span className="inline-block w-2 h-6 bg-primary ml-1 animate-pulse" />}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  {hasNoPlatforms ? (
                    <>
                      <button
                        onClick={() => handleSelectPlatform('gmail')}
                        className="px-8 py-4 bg-primary hover:opacity-90 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-primary/20 group text-foreground"
                      >
                        Start with Gmail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={handleImapStart}
                        className="px-8 py-4 bg-theme-surface hover:opacity-90 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3"
                      >
                        Other Email (IMAP)
                      </button>
                      <button
                        onClick={handleManualPreFill}
                        className="px-8 py-4 bg-transparent border-2 border-theme hover:bg-theme-surface rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 text-muted-foreground hover:text-foreground"
                      >
                        Manual Pre-fill
                      </button>
                    </>
                  ) : connectedPlatforms.length >= 2 ? (
                    <button
                      onClick={handleComplete}
                      className="px-10 py-5 bg-gradient-to-r from-primary to-amber-600 hover:opacity-90 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 group animate-pulse text-foreground"
                    >
                      Neural Sync Complete: Ready to move on <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground italic text-sm font-medium">
                      <Stars className="w-4 h-4" /> I'm waiting for your next platform choice...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Background elements for premium feel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-10 -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600 rounded-full blur-[100px] opacity-10 -ml-32 -mb-32" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Setup Card (Updated with IMAP support) */}
      <AnimatePresence>
        {currentPlatform && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-theme-surface border-2 border-theme rounded-[48px] p-10 md:p-16 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            {/* ... card content ... */}
            <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between relative z-10">
              <div className="flex items-center gap-8">
                <div className={cn("p-8 rounded-[36px] shadow-inner", currentPlatform?.bg ?? 'bg-theme-background')}>
                  <currentPlatform.icon className={cn("w-12 h-12", currentPlatform?.color ?? 'text-muted-foreground')} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-foreground tracking-tighter">{currentPlatform?.name ?? 'Connecting...'}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", linkingStep === 'auth' ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {linkingStep === 'auth' ? 'Establishing Neural Connection' : 'Decrypting API Protocols'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={finishSetup}
                  className="px-8 py-4 rounded-2xl border-2 border-theme text-muted-foreground font-black text-xs uppercase tracking-widest hover:bg-theme-background transition-all"
                >
                  Abort
                </button>
              </div>
            </div>

            <div className="mt-16">
              {linkingStep === 'tier' ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Co-Pilot Card */}
                    <div
                      onClick={() => setSelectedTier('co-pilot')}
                      className={cn(
                        "p-8 rounded-[40px] border-4 transition-all cursor-pointer relative group h-full flex flex-col",
                        selectedTier === 'co-pilot' ? "border-primary bg-primary/5 shadow-2xl" : "border-theme bg-theme-background hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-theme-surface flex items-center justify-center text-primary border border-theme">
                            <Cpu className="w-7 h-7" />
                        </div>
                        {selectedTier === 'co-pilot' && <CheckCircle2 className="w-8 h-8 text-primary" />}
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-2">Co-Pilot</h3>
                      <p className="text-sm font-bold text-primary/70 uppercase tracking-widest mb-6">Partial Access</p>
                      <ul className="space-y-4 flex-1">
                        {PLATFORM_CAPABILITIES[currentPlatform.id]?.capabilities?.find(c => c.tier === 'co-pilot')?.description?.split('. ')?.map((cap, i) => (
                          cap && (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              {cap}
                            </li>
                          )
                        ))}
                      </ul>
                    </div>

                    {/* Auto-Pilot Card */}
                    <div
                      onClick={() => setSelectedTier('empire')}
                      className={cn(
                        "p-8 rounded-[40px] border-4 transition-all cursor-pointer relative group h-full flex flex-col overflow-hidden",
                        selectedTier === 'empire' ? "border-amber-500 bg-amber-500/5 shadow-2xl" : "border-theme bg-theme-background hover:border-amber-500/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-foreground shadow-lg shadow-amber-500/20">
                            <Stars className="w-7 h-7" />
                        </div>
                        {selectedTier === 'empire' && <CheckCircle2 className="w-8 h-8 text-amber-500" />}
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-2">Auto-Pilot</h3>
                      <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-6">Full Empire Access</p>
                      <ul className="space-y-4 flex-1">
                        {PLATFORM_CAPABILITIES[currentPlatform.id]?.capabilities?.find(c => c.tier === 'empire')?.description?.split('. ')?.map((cap, i) => (
                          cap && (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              {cap}
                            </li>
                          )
                        ))}
                      </ul>

                      {/* Secure Vault Indicator */}
                      <div className="mt-8 p-4 bg-slate-950/50 rounded-2xl border border-white/10 flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Secure Vault Protocol</p>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Tokens are encrypted & isolated in the Ownership Vault (Admin Blindness Enforced).</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setLinkingStep('auth')}
                      className="px-12 py-5 bg-primary text-foreground rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group"
                    >
                      Confirm Tier & Begin Connection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Step 1: Auth / Email Auth */}
                  <div className={cn(
                    "p-10 rounded-[40px] border-2 transition-all relative",
                    linkingStep === 'auth' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-theme bg-theme-background/50 opacity-60"
                  )}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-theme-background shadow-sm flex items-center justify-center text-primary">
                        <Lock className="w-6 h-6" />
                      </div>
                      {linkingStep === 'keys' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {currentPlatform.id === 'imap' ? 'Email Credentials' : 'Secure Authorization'}
                    </h3>
                    <p className="text-base font-medium text-muted-foreground leading-relaxed mb-8">
                      {currentPlatform.id === 'imap'
                        ? "Enter your email and App Password to allow IMAP access."
                        : `Connect your ${currentPlatform.name} account via our encrypted OAuth gateway.`
                      }
                    </p>
                    {linkingStep === 'auth' && (
                      <div className="space-y-4">
                        {currentPlatform.id === 'imap' && (
                          <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary transition-colors"
                          />
                        )}
                        <button
                          onClick={handleAuth}
                          className="w-full py-5 bg-primary text-foreground rounded-[24px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                        >
                          {currentPlatform.id === 'imap' ? 'Authenticate IMAP' : `Authorize ${currentPlatform.name}`}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Keys */}
                  <div className={cn(
                    "p-10 rounded-[40px] border-2 transition-all",
                    linkingStep === 'keys' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-theme bg-theme-background/50 opacity-40"
                  )}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-theme-background shadow-sm flex items-center justify-center text-primary">
                        <Zap className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Neural Handshake</h3>
                    <p className="text-base font-medium text-muted-foreground leading-relaxed mb-8">
                      Verifying API endpoints and establishing autonomous bridge protocols.
                    </p>

                    {linkingStep === 'keys' ? (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Protocol Identifier</label>
                          <input type="password" value="••••••••••••••••" readOnly className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Token</label>
                          <input type="password" value="••••••••••••••••" readOnly className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold" />
                        </div>
                        <button
                          onClick={handleLink}
                          className="w-full py-5 bg-primary text-foreground rounded-[24px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl"
                        >
                          Finalize Neural Link
                        </button>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground/30 italic font-bold">
                        Waiting for Authentication Phase...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-theme-background rounded-full -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
