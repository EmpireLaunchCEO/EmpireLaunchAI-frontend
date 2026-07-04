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
  Cpu,
  LogOut,
  AlertCircle,
  HelpCircle,
  CreditCard,
  DollarSign
  } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { onboardingService } from '@/lib/api-service';

import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

const availablePlatforms = [
  { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'gmail', name: 'Gmail', icon: Mail, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'imap', name: 'Empire Email', icon: Mail, color: 'text-slate-600', bg: 'bg-theme-background' },
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
  { id: 'godaddy', name: 'GoDaddy', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'systeme_io', name: 'Systeme.io', icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  // New platforms added by Troubleshooter — OAuth configs live on backend
  { id: 'amazon', name: 'Amazon', icon: ShoppingBag, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'ebay', name: 'eBay', icon: ShoppingBag, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'squarespace', name: 'Squarespace', icon: Globe, color: 'text-slate-700', bg: 'bg-slate-50' },
  { id: 'wix', name: 'Wix', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'gumroad', name: 'Gumroad', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'patreon', name: 'Patreon', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'linkedin', name: 'LinkedIn', icon: Share2, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'twitch', name: 'Twitch', icon: Video, color: 'text-purple-700', bg: 'bg-purple-50' },
  { id: 'railway', name: 'Railway', icon: Globe, color: 'text-slate-700', bg: 'bg-slate-50' },
  { id: 'google_studio', name: 'Google Studio', icon: Camera, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'external_link', name: 'External Link', icon: Globe, color: 'text-primary', bg: 'bg-primary/10' },
];

const COMMERCE_PLATFORMS = [
  'etsy', 'shopify', 'woocommerce', 'amazon', 'ebay', 
  'squarespace', 'wix', 'gumroad', 'tiktok_shop', 'redbubble'
];

interface GuidedLinkingProps {
  isReturning?: boolean;
  onClose?: () => void;
  currentEmpire?: any;
  onRefresh?: () => void;
  hideEstablished?: boolean;
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
  godaddy: '/brands/godaddy_128.png',
  systeme_io: '/brands/systeme_io_128.png',
  shopify: '/brands/shopify_128.png',
  pinterest: '/brands/pinterest_128.png',
  tiktok_shop: '/brands/tiktok_shop_128.png',
  shipstation: '/brands/shipstation_128.png',
  dsers: '/brands/dsers_128.png',
  zendrop: '/brands/zendrop_128.png',
  spocket: '/brands/spocket_128.png',
  printful: '/brands/printful_128.png',
  printify: '/brands/printify_128.png',
  cj_dropshipping: '/brands/cj_dropshipping_128.png',
  autods: '/brands/autods_128.png',
  bannerbear: '/brands/bannerbear_128.png',
  amazon: '/brands/amazon_128.png',
  ebay: '/brands/ebay_128.png',
  squarespace: '/brands/squarespace_128.png',
  wix: '/brands/wix_128.png',
  gumroad: '/brands/gumroad_128.png',
  patreon: '/brands/patreon_128.png',
  linkedin: '/brands/linkedin_128.png',
  twitch: '/brands/twitch_128.png',
  stripe: '/brands/stripe_128.png',
  railway: '/brands/railway_128.png',
  google_studio: '/brands/google_studio_128.png',
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

function PermissionToggle({ permission, onToggle }: { permission: string, onToggle: (next: 'co-pilot' | 'empire') => void }) {
  const isEmpire = permission === 'empire';
  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onToggle(isEmpire ? 'co-pilot' : 'empire');
      }}
      className={cn(
        "relative w-9 h-5 rounded-full cursor-pointer transition-all duration-300 p-1 flex items-center shadow-inner",
        isEmpire ? "bg-amber-500/20 border border-amber-500/40" : "bg-emerald-500/20 border border-emerald-500/40"
      )}
    >
      <motion.div 
        animate={{ x: isEmpire ? 16 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "w-3 h-3 rounded-full shadow-lg border border-white/20",
          isEmpire ? "bg-amber-500" : "bg-emerald-500"
        )}
      />
    </div>
  );
}

export function GuidedLinking({ isReturning, onClose, currentEmpire, onRefresh, hideEstablished }: GuidedLinkingProps) {
  const {
    connectedPlatforms,
    connectPlatform,
    activeSetupPlatform,
    startSetup,
    finishSetup,
    completeLinkingPhase,
    updatePlatformPermission,
    platformPermissions,
    spendingPermissions,
    updateSpendingPermission,
    isProtocolAccepted,
    disconnectPlatform,
    activeEmpire: empireData
  } = useEmpire();

  const isCatalyst = empireData?.archetype === 'CATALYST';
  const hasCommercePlatform = connectedPlatforms.some(id => COMMERCE_PLATFORMS.includes(id));

  const [searchQuery, setSearchQuery] = useState('');
  const [linkingStep, setLinkingStep] = useState<'auth' | 'keys'>('auth');
  const [selectedTier, setSelectedTier] = useState<'co-pilot' | 'empire'>('co-pilot');
  const [onboardingSessionId, setOnboardingSessionId] = useState<string | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);

  useEffect(() => {
    let interval: any;
    if (onboardingSessionId) {
      interval = setInterval(async () => {
        try {
          const status = await onboardingService.getStatus(onboardingSessionId);
          setOnboardingStatus(status.session);
          if (status.session.status === 'completed') {
            clearInterval(interval);
            connectPlatform(status.session.platform);
            updatePlatformPermission(status.session.platform, selectedTier);
            finishSetup();
            setLinkingStep('auth');
            setOnboardingSessionId(null);
          } else if (status.session.status === 'failed') {
            clearInterval(interval);
            setOnboardingSessionId(null);
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [onboardingSessionId, connectPlatform, finishSetup, selectedTier, updatePlatformPermission]);

  const isGmailLinked = connectedPlatforms.includes('gmail') || connectedPlatforms.includes('imap');
  const hasNoPlatforms = connectedPlatforms.length === 0;

  const filteredPlatforms = availablePlatforms.filter(p => {
    const isCommerce = COMMERCE_PLATFORMS.includes(p.id);
    const alreadyConnected = connectedPlatforms.includes(p.id);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If it's a commerce platform and we already have one, hide it from search
    if (isCommerce && hasCommercePlatform && !alreadyConnected) return false;
    
    return matchesSearch && !alreadyConnected;
  });

  const handleSelectPlatform = (platformId: string) => {
    if (!isProtocolAccepted) return;
    startSetup(platformId);
    setLinkingStep('auth');
    setSearchQuery('');
  };

  const handleAuth = () => {
    // Empire OAuth via popup
    // Direct OAuth Platforms (Official APIs)
    const oauthPlatforms: Record<string, { endpoint: string; sessionKey: string; vaultKey: string; label: string }> = {
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
      figma: { endpoint: 'figma', sessionKey: 'figma_oauth_session_id', vaultKey: 'empire_vault_figma', label: 'Figma' },
      godaddy: { endpoint: 'godaddy', sessionKey: 'godaddy_oauth_session_id', vaultKey: 'empire_vault_godaddy', label: 'GoDaddy' },
      systeme_io: { endpoint: 'systeme_io', sessionKey: 'systeme_io_oauth_session_id', vaultKey: 'empire_vault_systeme_io', label: 'Systeme.io' },
      // ─── NEW 31+ PLATFORMS ───────────────────────────────────────
      linkedin: { endpoint: 'linkedin', sessionKey: 'linkedin_oauth_session_id', vaultKey: 'empire_vault_linkedin', label: 'LinkedIn' },
      twitch: { endpoint: 'twitch', sessionKey: 'twitch_oauth_session_id', vaultKey: 'empire_vault_twitch', label: 'Twitch' },
      patreon: { endpoint: 'patreon', sessionKey: 'patreon_oauth_session_id', vaultKey: 'empire_vault_patreon', label: 'Patreon' },
      amazon: { endpoint: 'amazon', sessionKey: 'amazon_oauth_session_id', vaultKey: 'empire_vault_amazon', label: 'Amazon' },
      ebay: { endpoint: 'ebay', sessionKey: 'ebay_oauth_session_id', vaultKey: 'empire_vault_ebay', label: 'eBay' },
      squarespace: { endpoint: 'squarespace', sessionKey: 'squarespace_oauth_session_id', vaultKey: 'empire_vault_squarespace', label: 'Squarespace' },
      wix: { endpoint: 'wix', sessionKey: 'wix_oauth_session_id', vaultKey: 'empire_vault_wix', label: 'Wix' },
      gumroad: { endpoint: 'gumroad', sessionKey: 'gumroad_oauth_session_id', vaultKey: 'empire_vault_gumroad', label: 'Gumroad' },
      etsy: { endpoint: 'etsy', sessionKey: 'etsy_oauth_session_id', vaultKey: 'empire_vault_etsy', label: 'Etsy' },
      canva: { endpoint: 'canva', sessionKey: 'canva_oauth_session_id', vaultKey: 'empire_vault_canva', label: 'Canva' },
      stripe: { endpoint: 'stripe', sessionKey: 'stripe_oauth_session_id', vaultKey: 'empire_vault_stripe', label: 'Stripe' },
      railway: { endpoint: 'railway', sessionKey: 'railway_oauth_session_id', vaultKey: 'empire_vault_railway', label: 'Railway' },
      google_studio: { endpoint: 'google_studio', sessionKey: 'google_studio_oauth_session_id', vaultKey: 'empire_vault_google_studio', label: 'Google Studio' },
    };

    const oauth = null; // Skip OAuth — all apps use Browser Link (Neural Handshake)

    if (oauth) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const authUrl = `${API_URL}/api/auth/${oauth.endpoint}/url`;
      fetch(authUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000',
          redirectUri: `${window.location.origin}/auth/callback/${oauth.endpoint}`
        })
      })
      .then(async (res) => {
        clearTimeout(timeout);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
        }
        return res.json();
      })
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
        } else if (data.error === 'MISSING_KEYS') {
          // Auto-fallback: No OAuth keys configured → use Neural Handshake
          setLinkingStep('keys');
          setOnboardingStatus({ status: 'initializing', currentState: 'WAKING_NEURAL_NODE' });
          onboardingService.startOnboarding(activeSetupPlatform!)
            .then(data => {
              if (data.sessionId) {
                setOnboardingSessionId(data.sessionId);
              }
            })
            .catch(err => {
              console.error('Failed to start neural onboarding', err);
              setOnboardingStatus({ status: 'failed', error: 'Failed to wake neural node. Please try again.' });
            });
        } else if (data.error) {
          alert(`Configuration Notice: ${data.error}. API keys may need to be set in the backend.`);
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
          console.warn('Auth request timed out');
          alert('Connection timed out. The backend may be starting up. Please try again.');
        } else {
          console.error('Auth initiation failed', err);
          alert('Connection unavailable. Please check that the backend is running and try again.');
        }
      });
      return;
    }

    // Neural Node Platforms — reached via auto-fallback from MISSING_KEYS
    setLinkingStep('keys');
    setOnboardingStatus({ status: 'initializing', currentState: 'WAKING_NEURAL_NODE' });
    onboardingService.startOnboarding(activeSetupPlatform!)
      .then(data => {
        if (data.sessionId) {
          setOnboardingSessionId(data.sessionId);
        }
      })
      .catch(err => {
        console.error('Failed to start neural onboarding', err);
        setOnboardingStatus({ status: 'failed', error: 'Failed to wake neural node. Please try again.' });
      });
    return;

    setLinkingStep('keys');
  };

  const handleLink = () => {
    if (activeSetupPlatform) {
      connectPlatform(activeSetupPlatform);
      updatePlatformPermission(activeSetupPlatform, selectedTier);
      finishSetup();
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
      {connectedPlatforms.length > 0 && !hideEstablished && (
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
                  className="p-6 bg-theme-surface border border-theme rounded-[28px] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group hover:border-white/50"
                >
                  <div className={cn("p-3 rounded-xl transition-colors", platform.bg, "group-hover:bg-primary/20")}>
                    <PlatformIcon id={id} icon={platform.icon} className={platform.color} size={20} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-foreground text-xs group-hover:text-white transition-colors truncate">{platform.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                       <PermissionToggle 
                         permission={platformPermissions[id] || 'co-pilot'} 
                         onToggle={(next) => updatePlatformPermission(id, next)} 
                       />
                       <span className={cn(
                         "text-[7px] font-black uppercase tracking-widest transition-colors",
                         platformPermissions[id] === 'empire' ? "text-amber-500" : "text-emerald-500",
                         "group-hover:text-white"
                       )}>
                         {platformPermissions[id] === 'empire' ? 'Auto-Pilot' : 'Co-Pilot'}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <PermissionToggle 
                         permission={spendingPermissions[id] ? 'empire' : 'co-pilot'} 
                         onToggle={(allowed) => updateSpendingPermission(id, allowed === 'empire')} 
                       />
                       <DollarSign className={cn(
                         "w-3 h-3 transition-colors",
                         spendingPermissions[id] ? "text-green-500" : "text-slate-500",
                         "group-hover:text-white"
                       )} />
                       <span className={cn(
                         "text-[7px] font-black uppercase tracking-widest transition-colors",
                         spendingPermissions[id] ? "text-green-500" : "text-slate-500",
                         "group-hover:text-white"
                       )}>
                         {spendingPermissions[id] ? 'Spending On' : 'Spending Off'}
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 group-hover:text-white shrink-0" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Sever the neural link with ${platform.name}? This will stop all autonomous actions for this platform.`)) {
                          disconnectPlatform(id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      title="Disconnect Platform"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
              <div className="space-y-4">
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

                {hasCommercePlatform && (
                  <div className="flex items-start gap-2 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[9px] font-bold text-amber-200/60 uppercase tracking-wider leading-relaxed">
                      Primary Commerce Node Established. To link a different shop (Etsy/Shopify/Amazon), please open a new Empire Expansion slot.
                    </p>
                  </div>
                )}

                {isCatalyst && !connectedPlatforms.includes('external_link') && (
                  <button
                    onClick={() => handleSelectPlatform('external_link')}
                    className="w-full p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between group hover:bg-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Daily Pay / External Link</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Link your sales page directly</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
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
            className="bg-theme-surface border-2 border-theme rounded-[32px] p-6 md:p-8 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className={cn("p-4 rounded-2xl shadow-inner relative bg-white border border-theme")}>
                  <PlatformIcon id={currentPlatform.id} icon={currentPlatform.icon} className={currentPlatform.color} size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tighter">{currentPlatform?.name ?? 'Connecting...'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-2 h-2 rounded-full", linkingStep === 'auth' ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {linkingStep === 'auth' ? 'Establishing Connection' : 'Finalizing Setup'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={finishSetup}
                  className="px-6 py-3 rounded-xl border border-theme text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:bg-theme-background transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Auth Step */}
                  <div className={cn(
                    "p-6 rounded-3xl border-2 transition-all relative",
                    linkingStep === 'auth' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-theme bg-theme-background/50 opacity-60"
                  )}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-theme-background shadow-sm flex items-center justify-center text-primary">
                        <Lock className="w-5 h-5" />
                      </div>
                      {linkingStep === 'keys' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {currentPlatform.id === 'imap' ? 'Email Credentials' : 
                       currentPlatform.id === 'external_link' ? 'External Sales Link' : 'Secure Authorization'}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-6">
                      {currentPlatform.id === 'imap'
                        ? "Enter your email and App Password to allow IMAP access."
                        : currentPlatform.id === 'external_link'
                        ? "Enter the primary URL for this business (e.g. your Daily Pay sales page)."
                        : `Connect your ${currentPlatform.name} account via encrypted OAuth.`
                      }
                    </p>
                    {linkingStep === 'auth' && (
                      <div className="space-y-3">
                        {currentPlatform.id === 'imap' && (
                          <>
                            <input
                              type="email"
                              placeholder="Email Address"
                              className="w-full bg-theme-background border-2 border-theme rounded-xl p-3 text-xs font-bold outline-none focus:border-primary transition-colors text-foreground"
                            />
                            <input
                              type="password"
                              placeholder="App Password"
                              className="w-full bg-theme-background border-2 border-theme rounded-xl p-3 text-xs font-bold outline-none focus:border-primary transition-colors text-foreground"
                            />
                          </>
                        )}
                        {currentPlatform.id === 'external_link' && (
                          <input
                            type="url"
                            placeholder="https://your-sales-page.com/offer"
                            className="w-full bg-theme-background border-2 border-theme rounded-xl p-3 text-xs font-bold outline-none focus:border-primary transition-colors text-foreground"
                          />
                        )}
                        <button
                          onClick={currentPlatform.id === 'external_link' ? handleLink : handleAuth}
                          className="w-full py-4 bg-primary text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                        >
                          {currentPlatform.id === 'imap' ? 'Authenticate IMAP' : 
                           currentPlatform.id === 'external_link' ? 'Establish Link' : `Authorize ${currentPlatform.name}`}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Keys Step */}
                  <div className={cn(
                    "p-6 rounded-3xl border-2 transition-all",
                    linkingStep === 'keys' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-theme bg-theme-background/50 opacity-40"
                  )}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-theme-background shadow-sm flex items-center justify-center text-primary">
                        <Zap className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Neural Handshake</h3>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-6">
                      Verifying API endpoints and establishing autonomous bridge protocols.
                    </p>

                    {linkingStep === 'keys' ? (
                      <div className="space-y-4">
                        {onboardingStatus ? (
                          <div className="space-y-3">
                            <div className="p-3 bg-primary/10 rounded-xl border border-primary/30">
                              <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-0.5">Session Status</p>
                              <p className="text-[10px] font-bold text-foreground capitalize">{onboardingStatus.status.replace('_', ' ')}</p>
                            </div>
                            <div className="p-3 bg-theme-background border border-theme rounded-xl">
                              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Current Task</p>
                              <p className="text-[10px] font-bold text-foreground">{onboardingStatus.currentState.replace('_', ' ')}</p>
                            </div>
                            
                            {onboardingStatus.status === 'hitl_required' && (
                              <div className="p-4 bg-amber-500/10 border-2 border-amber-500/50 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2">
                                  <Stars className="w-4 h-4 text-amber-500 animate-pulse" />
                                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Action Required</p>
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground leading-relaxed">
                                  Our Neural Node has reached the login screen. Please log in to your {currentPlatform.name} account in the window that just opened (or on your device) to allow the AI to continue.
                                </p>
                                <button
                                  onClick={() => window.open(currentPlatform.id === 'canva' ? 'https://www.canva.com/login' : '#', '_blank')}
                                  className="w-full py-2.5 bg-amber-500 text-slate-950 rounded-lg font-black text-[9px] uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                  Open {currentPlatform.name} Login
                                </button>
                              </div>
                            )}

                            {onboardingStatus.status === 'failed' && (
                              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-0.5">Error</p>
                                <p className="text-[10px] font-bold text-foreground">{onboardingStatus.error || 'Connection failed'}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-center py-2">
                              <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1 h-1 rounded-full bg-primary"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Protocol Identifier</label>
                              <input type="password" value="••••••••••••••••" readOnly className="w-full bg-theme-background border-2 border-theme rounded-xl p-3 text-xs font-bold text-foreground" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Token</label>
                              <input type="password" value="••••••••••••••••" readOnly className="w-full bg-theme-background border-2 border-theme rounded-xl p-3 text-xs font-bold text-foreground" />
                            </div>
                            <button
                              disabled={!!onboardingSessionId}
                              onClick={handleLink}
                              className={cn(
                                "w-full py-4 bg-primary text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl",
                                onboardingSessionId ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                              )}
                            >
                              {onboardingSessionId ? 'Processing Neural Handshake...' : 'Finalize Link Center'}
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center text-muted-foreground/30 italic font-bold text-sm">
                        Waiting for Authentication Phase...
                      </div>
                    )}
                  </div>
                </div>
            </div>

            <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-theme-background rounded-full -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
