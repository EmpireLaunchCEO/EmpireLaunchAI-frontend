"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Lock, ExternalLink, Copy, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { paymentService } from '@/lib/api-service';

export interface ProtectedButtonConfig {
  /** Unique button identifier */
  buttonId: string;
  /** Product name shown on checkout */
  productName: string;
  /** Price string e.g. "$24.99" */
  price: string;
  /** Price in cents for Stripe */
  priceInCents: number;
  /** Button label text */
  label?: string;
  /** Button color hex */
  color?: string;
  /** Seller/merchant display name */
  sellerName?: string;
  /** Product description (short) */
  description?: string;
  /** Pre-generated Stripe payment URL (if available) */
  directUrl?: string;
  /** Product ID for proxy generation */
  productId?: string;
  /** User/Owner ID for proxy generation */
  userId?: string;
  /** Social media post ID for attribution tracking */
  postId?: string;
  /** Platform source (e.g. 'tiktok', 'instagram', 'youtube') */
  platform?: string;
}

interface ProtectedPaymentButtonProps {
  config: ProtectedButtonConfig;
  /** Called when payment flow starts */
  onPaymentStart?: () => void;
  /** Called on successful payment redirect */
  onPaymentComplete?: () => void;
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'social-preview';
}

/**
 * ProtectedPaymentButton
 * 
 * A self-contained, secure payment button that bridges social media traffic
 * to Stripe Checkout sessions. Handles:
 * - Creating real Stripe Checkout sessions via the backend API
 * - Secure redirect to Stripe's hosted payment page
 * - Loading states with animated indicators
 * - Copy-to-clipboard for shareable URLs
 * - Multiple visual variants (default, minimal, social-preview)
 */
export function ProtectedPaymentButton({
  config,
  onPaymentStart,
  onPaymentComplete,
  className,
  variant = 'default',
}: ProtectedPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePurchase = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    onPaymentStart?.();

    try {
      if (config.directUrl) {
        // If we already have a direct Stripe Payment Link, open it
        window.open(config.directUrl, '_blank');
        onPaymentComplete?.();
      } else if (config.productId && config.userId && config.platform) {
        // Generate a protected proxy URL via the backend and open it directly
        const result = await paymentService.generateProtectedUrl({
          userId: config.userId,
          productId: config.productId,
          platform: config.platform,
          isSingleUse: true,
        });
        // Open the full proxy URL — the backend resolves it to a real Stripe session
        window.open(result.proxyUrl, '_blank');
        onPaymentComplete?.();
      } else {
        // Fallback: create a payment link via the standard API
        const result = await paymentService.createPaymentLink(
          config.productName,
          config.description || config.productName,
          config.priceInCents
        );
        window.open(result.url, '_blank');
        onPaymentComplete?.();
      }
    } catch (err) {
      console.error('Payment button error:', err);
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, config, onPaymentStart, onPaymentComplete]);

  const handleCopyLink = useCallback(() => {
    const url = config.directUrl || `${window.location.origin}/p/${config.buttonId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [config]);

  // Minimal variant — just the button, no decoration
  if (variant === 'minimal') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={cn(
            'w-full py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all',
            'flex items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            config.color
              ? 'text-white shadow-lg'
              : 'bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20'
          )}
          style={{ backgroundColor: config.color || undefined }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {config.label || 'Buy Now'} — {config.price}
            </>
          )}
        </button>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-bold text-red-400 mt-2 text-center"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }

  // Social preview variant — styled for embedding in social media posts
  if (variant === 'social-preview') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden',
          'max-w-sm w-full mx-auto',
          className
        )}
      >
        {/* Product preview area */}
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Protected Checkout
              </p>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {config.productName}
              </h3>
            </div>
            <div className="bg-emerald-50 rounded-xl p-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {config.description && (
            <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2">
              {config.description}
            </p>
          )}
        </div>

        {/* Price and CTA */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {config.sellerName || 'Empire Creator'}
            </span>
            <span className="text-2xl font-black text-slate-900">
              {config.price}
            </span>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className={cn(
              'w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all',
              'flex items-center justify-center gap-2 shadow-lg',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              config.color
                ? 'text-white hover:brightness-110'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            )}
            style={{ backgroundColor: config.color || undefined }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Secure Session...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {config.label || 'Secure Purchase'} — {config.price}
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            <span>Secured by EmpireLaunch Payment Gateway</span>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] font-bold text-red-500 text-center"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant — full-featured button with copy link
  return (
    <div className={cn('space-y-3', className)}>
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={cn(
          'w-full py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all',
          'flex items-center justify-center gap-3 shadow-xl',
          'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:scale-[1.02]',
          config.color
            ? 'text-white hover:brightness-110'
            : 'bg-primary text-slate-950 hover:bg-primary/90 shadow-primary/20'
        )}
        style={{ backgroundColor: config.color || undefined }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating Secure Checkout...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>
              {config.label || 'Buy Now'} — {config.price}
            </span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </>
        )}
      </button>

      {/* Security badges + copy link */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          <span>AES-256 Encrypted</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <ShieldCheck className="w-3 h-3" />
          <span>Stripe Protected</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[9px] font-bold text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Helper to generate a preview-optimized share card for social media.
 * Returns HTML-like object for embedding in social posts.
 */
export function generateShareCard(config: ProtectedButtonConfig) {
  return {
    title: config.productName,
    description: config.description || `Secure purchase — ${config.price}`,
    buttonUrl: config.directUrl || `/p/${config.buttonId}`,
    price: config.price,
    seller: config.sellerName || 'Empire Creator',
    securityBadge: 'Protected by Stripe',
  };
}