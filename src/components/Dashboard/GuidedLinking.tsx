"use client";
import { cn } from "@/lib/utils";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';
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
import { useEmpire } from '@/lib/EmpireContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

import { analyticsService, empireService } from '@/lib/api-service';

import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

const availablePlatforms = [
  { id: 'gmail', name: 'Gmail', icon: Mail, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'imap', name: 'Universal Email', icon: Mail, color: 'text-slate-600', bg: 'bg-theme-background' },
  { id: 'etsy', name: 'Etsy', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'shopify', name: 'Shopify', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'woocommerce', name: 'WooCommerce', icon: ShoppingBag, color: 'text-purple-700', bg: 'bg-purple-50' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'youtube', name: 'YouTube', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'fiverr', name: 'Fiverr', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'pinterest', name: 'Pinterest', icon: Share2, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'tiktok_shop', name: 'TikTok Shop', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'shipstation', name: 'ShipStation', icon: ShoppingBag, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'dsers', name: 'DSers', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'zendrop', name: 'Zendrop', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-50' },
  { id: 'spocket', name: 'Spocket', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'printful', name: 'Printful', icon: Palette, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'printify', name: 'Printify', icon: Palette, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'cj_dropshipping', name: 'CJ Dropshipping', icon: ShoppingBag, color: 'text-red-700', bg: 'bg-red-50' },
  { id: 'autods', name: 'AutoDS', icon: ShoppingBag, color: 'text-blue-800', bg: 'bg-blue-50' },
  { id: 'kittl', name: 'Kittl', icon: Palette, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'capcut', name: 'CapCut', icon: Video, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'canva', name: 'Canva', icon: Stars, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'bannerbear', name: 'Bannerbear', icon: Stars, color: 'text-blue-900', bg: 'bg-slate-100' },
];

interface GuidedLinkingProps {
  isReturning?: boolean;
  onClose?: () => void;
  currentEmpire?: any;
  onRefresh?: () => void;
}

const PLATFORM_3D_ICONS: Record<string, string> = {
  tiktok: '/brands/tiktok_128.png',
  instagram: '/brands/instagram_128.png',
  youtube: '/brands/youtube_128.png',
  etsy: '/brands/etsy_128.png',
  fiverr: '/brands/fiverr_128.png',
  gmail: '/brands/gmail_128.png',
  facebook: '/brands/facebook_128.png',
  canva: '/brands/canva_128.png',
  kittl: '/brands/kittl_128.png',
  capcut: '/brands/capcut_128.png',
};

function PlatformIcon({ id, icon: Icon, className, size = 20 }: { id: string, icon: any, className?: string, size?: number }) {
  const icon3d = PLATFORM_3D_ICONS[id];
  if (icon3d) {
    return (
      <div className={cn("relative flex items-center justify-center bg-white rounded-lg p-0.5 border border-theme/50", className)} style={{ width: size + 8, height: size + 8 }}>
        <Image src={icon3d} alt={id} width={size} height={size} className="object-contain" />
      </div>
    );
  }
  return <Icon className={cn(className)} style={{ width: size, height: size }} />;
}

export function GuidedLinking({ isReturning, onClose, currentEmpire, onRefresh }: GuidedLinkingProps) {
  const {
    connectedPlatforms,
    connectPlatform,
    activeSetupPlatform,
    startSetup,
    finishSetup,
    completeLinkingPhase,
    updatePlatformPermission,
    platformPermissions,
    aiMode,
    isProtocolAccepted
  } = useEmpire();
  const router = useRouter();

  // Robust check for name/niche status
  const checkNamePending = (empire: any) => {
    const name = empire?.name || empire?.title || '';
    const placeholders = ['', 'The First Empire', 'unnamed empire', 'Unnamed Empire', 'Empire One'];
    return !name || placeholders.includes(name);
  };

  const checkNichePending = (empire: any) => {
    const niche = empire?.niche || empire?.businessNiche || empire?.description?.match(/Empire Niche: (.*?)\./)?.[1] || '';
    const placeholders = ['', 'Niche Pending', 'CALIBRATION PENDING'];
    return !niche || placeholders.includes(niche);
  };

  const checkAnglePending = (empire: any) => {
    const angle = empire?.angle || empire?.businessAngle || empire?.description?.match(/Angle: (.*?)\./)?.[1] || '';
    const placeholders = ['', 'Angle Pending', 'CALIBRATION PENDING'];
    return !angle || placeholders.includes(angle);
  };

  const isNamePending = checkNamePending(currentEmpire);
  const isNichePending = checkNichePending(currentEmpire);
  const isAnglePending = checkAnglePending(currentEmpire);

  useEffect(() => {
    if (isNichePending || isNamePending || isAnglePending) {
       // Auto-trigger the high-intel auditor for a better "Pop Up" experience
       window.dispatchEvent(new CustomEvent('empire:force-intel-sync'));
    }
    
    // Synchronize setup step when empire data updates
    if (checkNamePending(currentEmpire)) {
      setSetupStep('name');
    } else if (checkNichePending(currentEmpire)) {
      setSetupStep('niche');
    } else if (checkAnglePending(currentEmpire)) {
      setSetupStep('angle');
    } else {
      setSetupStep('done');
    }
  }, [currentEmpire, isNichePending, isNamePending, isAnglePending]);

  const [nicheInput, setNicheInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [angleInput, setAngleInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isUpdatingNiche, setIsUpdatingNiche] = useState(false);
  const [setupStep, setSetupStep] = useState<'name' | 'niche' | 'angle' | 'done'>('done');

  const handleChatSubmit = async () => {
    const input = chatInput.trim() || searchQuery.trim();
    if (!input) return;
    
    setIsUpdatingNiche(true);
    try {
      if (setupStep === 'name' || input.toLowerCase().includes('name is')) {
        const cleanName = input.replace(/my business name is:?/i, '').trim();
        await empireService.updateEmpire(currentEmpire?.id || '1', { 
          title: cleanName,
          name: cleanName 
        });
        setNameInput(cleanName);
        setSetupStep('niche');
        setTeacherMessage(`"${cleanName}"—a powerful choice. Now, to calibrate my deep research protocols: What is your business niche? What exactly are we selling or growing?`);
      } else if (setupStep === 'niche') {
        await empireService.updateEmpire(currentEmpire?.id || '1', { niche: input });
        setNicheInput(input);
        setSetupStep('angle');
        setTeacherMessage(`Excellent. A "${input}" focus is high-potential. Now, what is our "Angle"? What makes your brand unique or different from competitors?`);
      } else if (setupStep === 'angle') {
        await empireService.updateEmpire(currentEmpire?.id || '1', { angle: input });
        setAngleInput(input);
        setSetupStep('done');
        setTeacherMessage(`Protocols fully calibrated. I have synchronized your unique angle into our neural network. I am now scanning for high-velocity profit opportunities. Let's link your first platform to begin the automation.`);
      } else {
        // Natural language handling even in "done" state
        handleInterception(input);
      }
      
      if (onRefresh) onRefresh();
      setChatInput('');
      setSearchQuery('');
      setConversationTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingNiche(false);
    }
  };

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
    if (isNamePending) {
      msg = "Welcome. I am the Empire Teacher. Before we begin, I need to know: What shall we call your new business empire? Give me a name that represents your vision.";
    } else if (isNichePending) {
      msg = `"${currentEmpire?.name || currentEmpire?.title}"—a powerful choice. Now, to calibrate my deep research protocols: What is your business niche? What exactly are we selling or growing?`;
    } else if (isReturning) {
      msg = "Back for more? Let's expand your footprint. What are we linking today?";
    } else if (hasNoPlatforms) {
      msg = "This is where you search for any app you want to link. I will personally walk you through what needs to be done! Let's start with your email, that way I can get some codes that will be required and you won't have to go back and forth.";
    } else if (isGmailLinked && connectedPlatforms.length === 1) {
      msg = "Now that your email is fully linked, pick another app you're wanting to link.";
    } else if (connectedPlatforms.length === 1) {
      msg = "One down! What's next on your roadmap? Link your existing store like Etsy or Shopify so I can start tracking your revenue.";
    } else {
      msg = "We're building momentum. I'm already scanning your linked stores for trends and sales. Do you want to link more platforms, or are you ready to see your initial strategy?";
    }
    setTeacherMessage(msg);
  }, [connectedPlatforms.length, hasNoPlatforms, isGmailLinked, isReturning, isNichePending]);

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
    if (!isProtocolAccepted) {
      setTeacherMessage("Protocol acceptance required. Please accept the Success-Share disclaimer above to unlock app linking and autonomous operations.");
      setConversationTrigger(prev => prev + 1);
      return;
    }
    startSetup(platformId);
    setLinkingStep('tier');
    setSearchQuery('');

    if (platformId === 'gmail') {
      setTeacherMessage("Excellent! Choose your intelligence tier for Gmail. Co-Pilot for tracking, or Empire Mode for automated responses.");
    } else if (platformId === 'imap') {
      setTeacherMessage("Establish your neural link via IMAP. Will you lead with Co-Pilot or grant full Empire control?");
    } else if (platformId === 'etsy') {
      setTeacherMessage("Etsy OAuth selected! Choose your intelligence tier, then I'll open a secure popup for you to authorize via Etsy's official login. No API keys needed.");
    } else {
      setTeacherMessage(`Initializing protocols for ${platformId.toUpperCase()}. Choose your access level to begin.`);
    }
    setConversationTrigger(prev => prev + 1);
  };

  const handleAuth = () => {
    // Universal OAuth via popup — backend provides auth URL for each platform
    const oauthPlatforms: Record<string, { endpoint: string; sessionKey: string; vaultKey: string; label: string }> = {
      etsy: { endpoint: 'etsy', sessionKey: 'etsy_oauth_session_id', vaultKey: 'empire_vault_etsy', label: 'Etsy' },
      tiktok: { endpoint: 'tiktok', sessionKey: 'tiktok_oauth_session_id', vaultKey: 'empire_vault_tiktok', label: 'TikTok' },
      tiktok_shop: { endpoint: 'tiktok_shop', sessionKey: 'tiktok_shop_oauth_session_id', vaultKey: 'empire_vault_tiktok_shop', label: 'TikTok Shop' },
      meta: { endpoint: 'meta', sessionKey: 'meta_oauth_session_id', vaultKey: 'empire_vault_meta', label: 'Meta' },
      instagram: { endpoint: 'meta', sessionKey: 'meta_oauth_session_id', vaultKey: 'empire_vault_meta', label: 'Instagram' },
      facebook: { endpoint: 'meta', sessionKey: 'meta_oauth_session_id', vaultKey: 'empire_vault_meta', label: 'Facebook' },
      pinterest: { endpoint: 'pinterest', sessionKey: 'pinterest_oauth_session_id', vaultKey: 'empire_vault_pinterest', label: 'Pinterest' },
      shopify: { endpoint: 'shopify', sessionKey: 'shopify_oauth_session_id', vaultKey: 'empire_vault_shopify', label: 'Shopify' },
      woocommerce: { endpoint: 'woocommerce', sessionKey: 'woocommerce_oauth_session_id', vaultKey: 'empire_vault_woocommerce', label: 'WooCommerce' },
      shipstation: { endpoint: 'shipstation', sessionKey: 'shipstation_oauth_session_id', vaultKey: 'empire_vault_shipstation', label: 'ShipStation' },
      fiverr: { endpoint: 'fiverr', sessionKey: 'fiverr_oauth_session_id', vaultKey: 'empire_vault_fiverr', label: 'Fiverr' },
      youtube: { endpoint: 'youtube', sessionKey: 'youtube_oauth_session_id', vaultKey: 'empire_vault_youtube', label: 'YouTube' },
      gmail: { endpoint: 'gmail', sessionKey: 'gmail_oauth_session_id', vaultKey: 'empire_vault_gmail', label: 'Gmail' },
      outlook: { endpoint: 'outlook', sessionKey: 'outlook_oauth_session_id', vaultKey: 'empire_vault_outlook', label: 'Outlook' },
      dsers: { endpoint: 'dsers', sessionKey: 'dsers_oauth_session_id', vaultKey: 'empire_vault_dsers', label: 'DSers' },
      zendrop: { endpoint: 'zendrop', sessionKey: 'zendrop_oauth_session_id', vaultKey: 'empire_vault_zendrop', label: 'Zendrop' },
      spocket: { endpoint: 'spocket', sessionKey: 'spocket_oauth_session_id', vaultKey: 'empire_vault_spocket', label: 'Spocket' },
      printful: { endpoint: 'printful', sessionKey: 'printful_oauth_session_id', vaultKey: 'empire_vault_printful', label: 'Printful' },
      printify: { endpoint: 'printify', sessionKey: 'printify_oauth_session_id', vaultKey: 'empire_vault_printify', label: 'Printify' },
      cj_dropshipping: { endpoint: 'cj_dropshipping', sessionKey: 'cj_dropshipping_oauth_session_id', vaultKey: 'empire_vault_cj_dropshipping', label: 'CJ Dropshipping' },
      autods: { endpoint: 'autods', sessionKey: 'autods_oauth_session_id', vaultKey: 'empire_vault_autods', label: 'AutoDS' },
    };

    const oauth = oauthPlatforms[activeSetupPlatform || ''];
    
    if (oauth) {
      fetch(`${API_URL}/api/auth/${oauth.endpoint}/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000',
          redirectUri: `${window.location.origin}/auth/callback/${oauth.endpoint}`
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          if (data.state) localStorage.setItem(oauth.sessionKey, data.state);
          const width = 600, height = 700;
          const left = window.screenX + (window.innerWidth - width) / 2;
          const top = window.screenY + (window.innerHeight - height) / 2;
          const popup = window.open(data.url, `${oauth.endpoint}-oauth`, `width=${width},height=${height},left=${left},top=${top},popup=1`);
          const pollTimer = setInterval(() => {
            if (popup?.closed) {
              clearInterval(pollTimer);
              const stored = localStorage.getItem(oauth.vaultKey);
              if (stored) {
                connectPlatform(activeSetupPlatform!);
                updatePlatformPermission(activeSetupPlatform!, selectedTier);
                finishSetup();
                setTeacherMessage(`${oauth.label} linked successfully! Your data is now flowing into the intelligence network.`);
                setConversationTrigger(prev => prev + 1);
              }
            }
          }, 500);
        } else {
          setTeacherMessage(`I'm having trouble reaching ${oauth.label}'s authorization server.`);
          setConversationTrigger(prev => prev + 1);
        }
      })
      .catch(() => {
        setTeacherMessage(`Connection error for ${oauth.label}. Please make sure the backend is running.`);
        setConversationTrigger(prev => prev + 1);
      });
      return;
    }
    
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

  const handleInterception = useCallback((input: string) => {
    const query = input.toLowerCase();
    if (query.includes('how') && query.includes('link')) {
      setTeacherMessage("Linking is easy! Just type the name of the app in the search bar above, and I'll guide you through the secure OAuth or API key setup.");
    } else if (query.includes('what') && query.includes('next')) {
      if (hasNoPlatforms) {
        setTeacherMessage("I recommend starting with your email (Gmail or Universal IMAP). It acts as the backbone for your empire's communications.");
      } else {
        setTeacherMessage("You've got your email linked. Next, let's connect your existing sales channels like Etsy or Shopify so I can start tracking your revenue.");
      }
    } else {
      setTeacherMessage("I'm processing your request... During this linking phase, I'm focused on getting your core apps connected. Ask me how to link a specific platform!");
    }
    setConversationTrigger(prev => prev + 1);
  }, [hasNoPlatforms]);

  // Expose interception to window for simplicity in this prototype or use a ref in real app
  useEffect(() => {
    (window as any).interceptTeacher = handleInterception;
    return () => { delete (window as any).interceptTeacher; };
  }, [handleInterception]);

  return (
    <div className="space-y-12">
      {/* Connected Platforms Quick View (Always visible) */}
      {connectedPlatforms.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Established Links</h4>
            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">{connectedPlatforms.length} Neural Syncs</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {connectedPlatforms.map(id => {
              const platform = availablePlatforms.find(p => p.id === id);
              if (!platform) return null;
              return (
                <motion.div
                  key={id}
                  layoutId={id}
                  className="p-6 bg-theme-surface border border-theme rounded-[28px] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group hover:border-primary/50"
                >
                  <div className={cn("p-3 rounded-xl transition-colors", platform.bg, "group-hover:bg-primary/20")}>
                    <PlatformIcon id={id} icon={platform.icon} className={platform.color} size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-xs group-hover:text-white transition-colors">{platform.name}</span>
                    <span className="text-[9px] font-medium text-muted-foreground">
                      {JSON.parse(localStorage.getItem(`empire_vault_${id}`) || '{}').handle || 'Syncing...'}
                    </span>
                    <span className={cn(
                      "text-[7px] font-black uppercase tracking-widest transition-colors",
                      platformPermissions[id] === 'empire' ? "text-amber-500" : "text-primary",
                      "group-hover:text-white"
                    )}>
                      {platformPermissions[id] === 'empire' ? 'Auto-Pilot' : 'Co-Pilot'}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto group-hover:text-white" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Empire Teacher Popup (Search Integrated) */}
      <AnimatePresence mode="wait">
        {showTeacher && !activeSetupPlatform && (
          <motion.div
            key={connectedPlatforms.length}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-theme-surface rounded-[40px] p-8 md:p-10 text-white border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[28px] bg-theme-gradient flex items-center justify-center shadow-2xl shadow-primary/20 relative">
                  <Stars className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  {isTyping && (
                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-2 animate-bounce shadow-lg">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-slate-950 rounded-full" />
                        <div className="w-1 h-1 bg-slate-950 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-slate-950 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Empire Teacher</h3>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-primary/20 rounded-full border border-primary/30">
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active</span>
                      </div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full border",
                        aiMode === 'empire' ? "bg-amber-500/20 border-amber-500/30" : "bg-primary/20 border-primary/30"
                      )}>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest",
                          aiMode === 'empire' ? "text-amber-500" : "text-primary"
                        )}>
                          {aiMode === 'empire' ? 'Auto-Pilot' : 'Co-Pilot'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowTeacher(false)} 
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative min-h-[60px]">
                  <p className="text-xl md:text-2xl font-black leading-snug tracking-tight text-white italic">
                    {displayedMessage}
                    {isTyping && <span className="inline-block w-2 h-6 bg-primary ml-1 animate-pulse" />}
                  </p>
                </div>

                {/* Interactive AI Chat Input for Setup */}
                <div className="relative group max-w-xl">
                  {setupStep !== 'done' ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={setupStep === 'name' ? "Enter Empire Name..." : "Describe your Niche..."}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-[11px] font-black focus:border-primary focus:ring-0 transition-all placeholder:text-white/20 text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                          disabled={isUpdatingNiche}
                        />
                        <button 
                          onClick={handleChatSubmit}
                          disabled={isUpdatingNiche || !chatInput.trim()}
                          className="absolute right-3 top-3 bottom-3 px-5 bg-primary text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 hover:scale-105 transition-transform shadow-lg shadow-primary/20 flex items-center justify-center"
                        >
                          {isUpdatingNiche ? <BrandedGlobe size="sm" spinning /> : "Send"}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest">
                          AI is waiting for your response...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-3.5 w-3.5 text-white/40 group-focus-within:text-primary transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for an app or talk to Teacher..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-20 text-[8px] font-bold focus:border-primary focus:ring-0 transition-all placeholder:text-white/20 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                      />
                      <button 
                        onClick={handleChatSubmit}
                        className="absolute right-2 top-2 bottom-2 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-lg text-[7px] font-black uppercase tracking-widest transition-all"
                      >
                        Send
                      </button>
                      
                      <AnimatePresence>
                        {searchQuery && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                          >
                            {filteredPlatforms.length > 0 ? (
                              <div className="p-1">
                                {filteredPlatforms.map(platform => (
                                  <button
                                    key={platform.id}
                                    onClick={() => handleSelectPlatform(platform.id)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left"
                                  >
                                    <div className={cn("p-1.5 rounded-md", platform.bg)}>
                                      <PlatformIcon id={platform.id} icon={platform.icon} className={cn("w-3.5 h-3.5", platform.color)} size={14} />
                                    </div>
                                    <span className="font-bold text-[10px] text-white">{platform.name}</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-white/40 text-[10px] font-medium">
                                No platforms found matching "{searchQuery}"
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {!isNichePending && hasNoPlatforms ? (
                    <>
                      <button
                        onClick={() => handleSelectPlatform('gmail')}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-primary/20 group text-slate-950"
                      >
                        Start with Gmail <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={handleImapStart}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 text-white"
                      >
                        Other Email (IMAP)
                      </button>
                      <button
                        onClick={handleManualPreFill}
                        className="px-6 py-3 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 text-white/40 hover:text-white"
                      >
                        Manual Pre-fill
                      </button>
                    </>
                  ) : connectedPlatforms.length >= 2 ? (
                    <button
                      onClick={handleComplete}
                      className="px-8 py-4 bg-gradient-to-r from-primary to-amber-600 hover:opacity-90 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 group animate-pulse text-slate-950"
                    >
                      Ready to move on <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-white/40 italic text-[10px] font-medium">
                      <Stars className="w-3 h-3" /> I'm waiting for your next choice...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Background elements for premium feel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-5 -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-5 -ml-32 -mb-32" />
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
                <div className={cn("p-8 rounded-[36px] shadow-inner relative bg-white border border-theme")}>
                  <PlatformIcon id={currentPlatform.id} icon={currentPlatform.icon} className={currentPlatform.color} size={48} />
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
                        ? "Enter your email and App Password (or account password) to allow IMAP access."
                        : `Connect your ${currentPlatform.name} account via our encrypted OAuth gateway.`
                      }
                    </p>
                    {linkingStep === 'auth' && (
                      <div className="space-y-4">
                        {currentPlatform.id === 'imap' && (
                          <>
                            <input
                              type="email"
                              placeholder="Email Address"
                              className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary transition-colors text-white"
                            />
                            <input
                              type="password"
                              placeholder="App Password"
                              className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary transition-colors text-white"
                            />
                          </>
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
