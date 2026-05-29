"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  Palette as PaletteIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { useRouter } from 'next/navigation';

const availablePlatforms = [
  { id: 'gmail', name: 'Gmail', icon: Mail, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'imap', name: 'Universal Email', icon: Mail, color: 'text-slate-600', bg: 'bg-theme-background' },
  { id: 'etsy', name: 'Etsy', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'shopify', name: 'Shopify', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'youtube', name: 'YouTube', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'fiverr', name: 'Fiverr', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'kittl', name: 'Kittl', icon: PaletteIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'capcut', name: 'CapCut', icon: Video, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'canva', name: 'Canva', icon: Stars, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'bannerbear', name: 'Bannerbear', icon: Stars, color: 'text-foreground', bg: 'bg-slate-100' },
];

interface GuidedLinkingProps {
  isReturning?: boolean;
  onClose?: () => void;
}

export function GuidedLinking({ isReturning, onClose }: GuidedLinkingProps) {
  const { 
    connectedPlatforms = [], 
    connectPlatform, 
    activeSetupPlatform, 
    startSetup, 
    finishSetup, 
    completeLinkingPhase 
  } = useEmpire();
  
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showTeacher, setShowTeacher] = useState(true);
  const [linkingStep, setLinkingStep] = useState<'auth' | 'keys'>('auth');
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationTrigger, setConversationTrigger] = useState(0);

  const safeConnected = useMemo(() => connectedPlatforms || [], [connectedPlatforms]);
  const isGmailLinked = safeConnected.includes('gmail') || safeConnected.includes('imap');
  const hasNoPlatforms = safeConnected.length === 0;
  const hasLinkedEnough = safeConnected.length >= 2;

  // Multi-stage message logic
  const teacherMessage = useMemo(() => {
    if (searchQuery.toLowerCase() === 'etsy') {
      return "Etsy is a powerhouse for digital products. I can help you find best-sellers there once we're linked.";
    }
    if (searchQuery.toLowerCase() === 'tiktok') {
      return "Great choice! TikTok is essential for brand velocity. We can automate your posting schedule once it's linked.";
    }
    if (isReturning) {
      return "Back for more? Let's expand your footprint. What are we linking today?";
    }
    if (hasNoPlatforms) {
      return "This is where you search for any app you want to link. I will personally walk you through what needs to be done! Let's start with your email, that way I can get some codes that will be required and you won't have to go back and forth.";
    }
    if (isGmailLinked && safeConnected.length === 1) {
      return "Now that your email is fully linked, pick another app you're wanting to link.";
    }
    if (safeConnected.length === 1) {
      return "One down! What's next on your roadmap? Maybe your primary store like Etsy or Shopify?";
    }
    return "Neural handshake successful. Your empire is now multi-channel. Ready to initialize the Command Center?";
  }, [safeConnected.length, hasNoPlatforms, isGmailLinked, isReturning, searchQuery]);

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
    }, 15);

    return () => clearInterval(interval);
  }, [teacherMessage, conversationTrigger]);

  const filteredPlatforms = useMemo(() => {
    return availablePlatforms.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      !safeConnected.includes(p.id)
    );
  }, [searchQuery, safeConnected]);

  const handleSelectPlatform = (platformId: string) => {
    startSetup(platformId);
    setLinkingStep('auth');
    setSearchQuery('');
    setConversationTrigger(prev => prev + 1);
  };

  const handleComplete = () => {
    if (onClose) {
      onClose();
    } else {
      completeLinkingPhase();
      router.push('/dashboard');
    }
  };

  const handleEmergencySkip = () => {
    completeLinkingPhase();
    router.push('/dashboard');
  };

  const handleLink = () => {
    if (activeSetupPlatform) {
      connectPlatform(activeSetupPlatform);
      finishSetup();
      setLinkingStep('auth');
      setConversationTrigger(prev => prev + 1);
    }
  };

  const currentPlatform = useMemo(() => 
    availablePlatforms.find(p => p.id === activeSetupPlatform),
    [activeSetupPlatform]
  );

  return (
    <div className="space-y-12 max-w-4xl mx-auto pt-10 pb-20">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for an app to link (e.g. Gmail, Etsy...)"
          className="w-full bg-theme-surface border-4 border-theme rounded-[32px] py-8 pl-20 pr-8 text-2xl font-bold focus:border-primary focus:ring-0 transition-all shadow-2xl shadow-slate-200/50 placeholder:text-slate-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
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
                  {filteredPlatforms.map(platform => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => handleSelectPlatform(platform.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-theme-background rounded-xl transition-colors text-left"
                      >
                        <div className={cn("p-2 rounded-lg", platform.bg)}>
                          <Icon className={cn("w-5 h-5", platform.color)} />
                        </div>
                        <span className="font-bold text-foreground">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 font-medium">
                  No platforms found matching "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connected Platforms Quick View */}
      {safeConnected.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Established Links</h4>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">{safeConnected.length} Neural Syncs</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {safeConnected.map(id => {
              const platform = availablePlatforms.find(p => p.id === id);
              if (!platform) return null;
              const Icon = platform.icon;
              return (
                <div 
                  key={id} 
                  className="p-6 bg-theme-surface border-2 border-theme rounded-[28px] flex items-center gap-4 shadow-sm"
                >
                  <div className={cn("p-3 rounded-xl", platform.bg)}>
                    <Icon className={cn("w-5 h-5", platform.color)} />
                  </div>
                  <span className="font-bold text-foreground">{platform.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Empire Teacher Popup */}
      <AnimatePresence mode="wait">
        {showTeacher && !activeSetupPlatform && (
          <motion.div
            key={safeConnected.length}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 relative">
                  <Stars className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Empire Teacher</h3>
                    <div className="px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
                      <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <button onClick={() => setShowTeacher(false)} className="text-theme-background0 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative min-h-[80px]">
                  <p className="text-2xl font-bold leading-snug tracking-tight text-slate-100">
                    {displayedMessage}
                    {isTyping && <span className="inline-block w-2 h-6 bg-primary ml-1 animate-pulse" />}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  {hasNoPlatforms ? (
                    <>
                      <button 
                        onClick={() => handleSelectPlatform('gmail')}
                        className="px-8 py-4 bg-primary hover:bg-primary rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-primary/20 group"
                      >
                        Start with Gmail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={handleEmergencySkip}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Skip Linking & Enter Hub
                      </button>
                    </>
                  ) : !hasLinkedEnough ? (
                    <>
                      <button 
                        onClick={() => setSearchQuery('etsy')}
                        className="px-8 py-4 bg-primary/20 text-primary hover:bg-primary/30 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                      >
                        Link Another Platform
                      </button>
                      <button 
                        onClick={handleEmergencySkip}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Skip & Enter Hub
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleComplete}
                      className="px-10 py-5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-500 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 group animate-pulse"
                    >
                      Neural Sync Complete: Ready to move on <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Setup Card */}
      <AnimatePresence>
        {currentPlatform && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-theme-surface border-2 border-theme rounded-[48px] p-10 md:p-16 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-10 md:items-center justify-between relative z-10">
              <div className="flex items-center gap-8">
                <div className={cn("p-8 rounded-[36px] shadow-inner", currentPlatform.bg)}>
                  {(() => {
                    const Icon = currentPlatform.icon;
                    return <Icon className={cn("w-12 h-12", currentPlatform.color)} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-foreground tracking-tighter">{currentPlatform.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", linkingStep === 'auth' ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      {linkingStep === 'auth' ? 'Establishing Neural Connection' : 'Decrypting API Protocols'}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={finishSetup}
                className="px-8 py-4 rounded-2xl border-2 border-theme text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-theme-background transition-all"
              >
                Abort
              </button>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Step 1: Auth */}
              <div className={cn(
                "p-10 rounded-[40px] border-2 transition-all relative",
                linkingStep === 'auth' ? "border-primary bg-primary/10 ring-4 ring-primary/10" : "border-theme bg-theme-background/50 opacity-60"
              )}>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-theme-surface shadow-sm flex items-center justify-center text-primary">
                    <Lock className="w-6 h-6" />
                  </div>
                  {linkingStep === 'keys' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {currentPlatform.id === 'imap' ? 'Email Credentials' : 'Secure Authorization'}
                </h3>
                <p className="text-base font-medium text-theme-background0 leading-relaxed mb-8">
                  {currentPlatform.id === 'imap' 
                    ? "Enter your email and App Password to allow IMAP access."
                    : `Connect your ${currentPlatform.name} account via our encrypted OAuth gateway.`
                  }
                </p>
                {linkingStep === 'auth' && (
                  <button 
                    onClick={() => setLinkingStep('keys')}
                    className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl"
                  >
                    {currentPlatform.id === 'imap' ? 'Authenticate IMAP' : `Authorize ${currentPlatform.name}`}
                  </button>
                )}
              </div>

              {/* Step 2: Keys */}
              <div className={cn(
                "p-10 rounded-[40px] border-2 transition-all",
                linkingStep === 'keys' ? "border-primary bg-primary/10 ring-4 ring-primary/10" : "border-theme bg-theme-background/50 opacity-40"
              )}>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-theme-surface shadow-sm flex items-center justify-center text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Neural Handshake</h3>
                <p className="text-base font-medium text-theme-background0 leading-relaxed mb-8">
                  Verifying API endpoints and establishing autonomous bridge protocols.
                </p>
                
                {linkingStep === 'keys' ? (
                  <div className="space-y-5">
                    <button 
                      onClick={handleLink}
                      className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl"
                    >
                      Finalize Neural Link
                    </button>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-300 italic font-bold">
                    Waiting for Authentication Phase...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
