"use client";
import { cn } from "@/lib/utils";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';

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
  { id: 'figma', name: 'Figma', icon: Palette, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'behance', name: 'Behance', icon: Palette, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'redbubble', name: 'Redbubble', icon: ShoppingBag, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'artstation', name: 'ArtStation', icon: Palette, color: 'text-sky-500', bg: 'bg-sky-50' },
  { id: 'substack', name: 'Substack', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50' },
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
  figma: '/brands/figma_128.png',
  behance: '/brands/behance_128.png',
  redbubble: '/brands/redbubble_128.png',
  artstation: '/brands/artstation_128.png',
  substack: '/brands/substack_128.png',
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
    isProtocolAccepted
  } = useEmpire();

  const [searchQuery, setSearchQuery] = useState('');
  const [linkingStep, setLinkingStep] = useState<'tier' | 'auth' | 'keys'>('tier');
  const [selectedTier, setSelectedTier] = useState<'co-pilot' | 'empire'>('co-pilot');

  const isGmailLinked = connectedPlatforms.includes('gmail') || connectedPlatforms.includes('imap');
  const hasNoPlatforms = connectedPlatforms.length === 0;

  const filteredPlatforms = availablePlatforms.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !connectedPlatforms.includes(p.id)
  );

  const handleSelectPlatform = (platformId: string) => {
    if (!isProtocolAccepted) return;
    startSetup(platformId);
    setLinkingStep('tier');
    setSearchQuery('');
  };

  const handleAuth = () => {
    // Universal OAuth via popup
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
              }
            }
          }, 500);
        }
      })
      .catch(() => {});
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
    }
  };

  const currentPlatform = availablePlatforms.find(p => p.id === activeSetupPlatform);

  const handleImapStart = () => {
    startSetup('imap');
    setLinkingStep('auth');
  };

  return (
    <div className="space-y-12">
      {/* Connected Platforms Quick View */}
      {connectedPlatforms.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Established Links</h4>
            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">{connectedPlatforms.length} Connected</span>
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

      {/* Search & Connect Card */}
      {!activeSetupPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-surface rounded-[40px] p-8 md:p-10 border border-theme relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Link Center</h3>
                    <p className="text-[9px] text-muted-foreground font-medium">
                      {hasNoPlatforms
                        ? "Search for an app to connect your empire"
                        : "Search and connect more platforms"}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                  isProtocolAccepted
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}>
                  {isProtocolAccepted ? 'Acceptance Active' : 'Protocol Pending'}
                </div>
              </div>

              {/* Search Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={hasNoPlatforms ? "Search for an app to link (e.g. Gmail, Etsy, TikTok)..." : "Search for more apps..."}
                  className="w-full bg-theme-background border-2 border-theme rounded-2xl py-4 pl-12 pr-6 text-xs font-bold focus:border-primary focus:ring-0 transition-all placeholder:text-muted-foreground/50 text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Action Buttons */}
              {hasNoPlatforms && !searchQuery && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSearchQuery('gmail'); handleSelectPlatform('gmail'); }}
                    className="px-4 py-2.5 bg-primary/10 border border-primary/30 rounded-xl font-black text-[8px] uppercase tracking-widest text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
                  >
                    <Mail className="w-3 h-3" /> Start with Gmail
                  </button>
                  <button
                    onClick={handleImapStart}
                    className="px-4 py-2.5 bg-theme-background border border-theme rounded-xl font-black text-[8px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
                  >
                    <Mail className="w-3 h-3" /> Other Email (IMAP)
                  </button>
                </div>
              )}

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-theme-background border border-theme rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {filteredPlatforms.length > 0 ? (
                      <div className="p-2 max-h-[300px] overflow-y-auto">
                        {filteredPlatforms.map(platform => (
                          <button
                            key={platform.id}
                            onClick={() => handleSelectPlatform(platform.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-theme-surface rounded-xl transition-colors text-left"
                          >
                            <div className={cn("p-2 rounded-lg", platform.bg)}>
                              <PlatformIcon id={platform.id} icon={platform.icon} className={cn("w-4 h-4", platform.color)} size={16} />
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-xs text-foreground">{platform.name}</span>
                              <p className="text-[8px] text-muted-foreground font-medium">Click to connect</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground text-xs font-medium">
                        No platforms found matching &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!searchQuery && connectedPlatforms.length >= 2 && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      if (onClose) onClose();
                      else completeLinkingPhase();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-amber-600 hover:opacity-90 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 group text-slate-950"
                  >
                    Ready to move on <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] opacity-5 -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-5 -ml-32 -mb-32" />
        </motion.div>
      )}

      {/* Active Setup Card */}
      <AnimatePresence>
        {currentPlatform && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-theme-surface border-2 border-theme rounded-[48px] p-10 md:p-16 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
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
                      {linkingStep === 'auth' ? 'Establishing Connection' : 'Finalizing Setup'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={finishSetup}
                  className="px-8 py-4 rounded-2xl border-2 border-theme text-muted-foreground font-black text-xs uppercase tracking-widest hover:bg-theme-background transition-all"
                >
                  Cancel
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

                      <div className="mt-8 p-4 bg-slate-950/50 rounded-2xl border border-white/10 flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Secure Vault Protocol</p>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Tokens are encrypted & isolated in the Ownership Vault.</p>
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
                  {/* Auth Step */}
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
                        : `Connect your ${currentPlatform.name} account via encrypted OAuth.`
                      }
                    </p>
                    {linkingStep === 'auth' && (
                      <div className="space-y-4">
                        {currentPlatform.id === 'imap' && (
                          <>
                            <input
                              type="email"
                              placeholder="Email Address"
                              className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary transition-colors text-foreground"
                            />
                            <input
                              type="password"
                              placeholder="App Password"
                              className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary transition-colors text-foreground"
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

                  {/* Keys Step */}
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
                          <input type="password" value="••••••••••••••••" readOnly className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold text-foreground" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Token</label>
                          <input type="password" value="••••••••••••••••" readOnly className="w-full bg-theme-background border-2 border-theme rounded-2xl p-4 text-sm font-bold text-foreground" />
                        </div>
                        <button
                          onClick={handleLink}
                          className="w-full py-5 bg-primary text-foreground rounded-[24px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl"
                        >
                          Finalize Link Center
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