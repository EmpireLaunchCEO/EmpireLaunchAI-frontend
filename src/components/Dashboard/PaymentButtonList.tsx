"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  MousePointer2,
  Plus,
  Loader2,
  Link2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, paymentService, PaymentButton, StripeAccountStatus } from '@/lib/api-service';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { CreatePaymentButtonModal } from '@/components/Dashboard/CreatePaymentButtonModal';

interface PaymentButtonListProps {
  /** Compact variant for embedding in other sections */
  variant?: 'full' | 'compact';
  /** Override stripe status if known */
  stripeStatus?: StripeAccountStatus;
}

export function PaymentButtonList({ variant = 'full', stripeStatus: knownStatus }: PaymentButtonListProps) {
  const [buttons, setButtons] = useState<PaymentButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<StripeAccountStatus>({ connected: false });

  const loadButtons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, status] = await Promise.all([
        analyticsService.getPaymentButtons(),
        knownStatus || paymentService.getStripeStatus(),
      ]);
      setButtons(data);
      if (!knownStatus) setStripeStatus(status);
    } catch (err) {
      console.error('Failed to load payment buttons:', err);
      setError('Failed to load payment buttons');
    } finally {
      setLoading(false);
    }
  }, [knownStatus]);

  useEffect(() => {
    loadButtons();
  }, [loadButtons]);

  const handleCopy = (id: string, url?: string) => {
    setCopiedId(id);
    if (url) {
      navigator.clipboard.writeText(url);
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreated = () => {
    setShowCreateModal(false);
    loadButtons();
  };

  const handleOpenInNewTab = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <BrandedGlobe size="sm" animate={true} />
      </div>
    );
  }

  // Compact variant for embedding
  if (variant === 'compact') {
    return (
      <div className="bg-theme-surface border border-theme rounded-[24px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black text-foreground uppercase tracking-tight">Payment Buttons</h3>
          </div>
          <span className="text-[8px] font-black text-muted-foreground">{buttons.length} active</span>
        </div>

        <div className="space-y-2">
          {buttons.slice(0, 3).map((button) => (
            <div key={button.id} className="p-3 bg-theme-background rounded-xl border border-theme flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <MousePointer2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-[10px] font-bold text-foreground truncate">{button.label}</span>
              </div>
              <span className="text-[9px] font-black text-primary shrink-0">${button.price}</span>
            </div>
          ))}
          {buttons.length === 0 && (
            <p className="text-[9px] text-center text-muted-foreground py-4">No buttons yet</p>
          )}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full py-3 bg-primary/10 border border-primary/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
        >
          <Plus className="w-3 h-3 inline mr-1" />
          Create Button
        </button>

        <CreatePaymentButtonModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
          stripeStatus={stripeStatus}
        />
      </div>
    );
  }

  // Full variant
  return (
    <>
      <div className="bg-theme-surface border border-theme rounded-[40px] p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-slate-950">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic">Payment Buttons</h3>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                {stripeStatus.connected ? 'Stripe Connected • Live' : 'Complete Stripe onboarding to go live'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!stripeStatus.connected}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center gap-1.5",
              stripeStatus.connected
                ? "bg-primary text-slate-950 hover:bg-white shadow-lg shadow-primary/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Create New
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-[9px] font-bold text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {buttons.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">No payment buttons yet</p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {stripeStatus.connected 
                    ? 'Create your first button to start accepting payments'
                    : 'Complete Stripe Connect onboarding in Finances to create buttons'}
                </p>
              </div>
              {stripeStatus.connected && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-primary/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create First Button
                </button>
              )}
            </div>
          ) : (
            buttons.map((button) => (
              <div key={button.id} className="p-5 border border-theme rounded-[24px] hover:border-white/30 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-theme-background flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <MousePointer2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm truncate max-w-[200px]">{button.label}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{button.productName}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-[10px] font-bold text-primary">${button.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-4 hidden sm:block">
                    <p className="text-xs font-black text-foreground">{button.usageCount} Clicks</p>
                    <p className={cn(
                      "text-[9px] font-bold",
                      button.status === 'active' ? "text-emerald-500" : "text-slate-500"
                    )}>
                      {button.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(button.id, `/p/${button.id}`)}
                    className="p-3 hover:bg-theme-background rounded-xl transition-colors relative"
                    title="Copy button link"
                  >
                    {copiedId === button.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenInNewTab(`/p/${button.id}`)}
                    className="p-3 hover:bg-theme-background rounded-xl transition-colors"
                    title="Open public page"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stripe connection hint */}
        {!stripeStatus.connected && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
              ⚠ To create payment buttons, complete Stripe Connect onboarding in the Finances section.
            </p>
          </div>
        )}
      </div>

      <CreatePaymentButtonModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
        stripeStatus={stripeStatus}
      />
    </>
  );
}