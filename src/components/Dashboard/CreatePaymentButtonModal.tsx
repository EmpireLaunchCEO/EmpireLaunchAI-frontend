"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  X,
  Sparkles,
  DollarSign,
  Palette,
  Type,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { paymentService, StripeAccountStatus } from '@/lib/api-service';

interface CreatePaymentButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (button: { id: string; url: string; productName: string }) => void;
  stripeStatus: StripeAccountStatus;
}

type Step = 'details' | 'creating' | 'success';

export function CreatePaymentButtonModal({
  isOpen,
  onClose,
  onCreated,
  stripeStatus,
}: CreatePaymentButtonModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [buttonText, setButtonText] = useState('Buy Now');
  const [buttonColor, setButtonColor] = useState('#000000');
  const [createdButton, setCreatedButton] = useState<{ id: string; url: string; productName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !price.trim()) return;

    setStep('creating');

    // Parse price to cents (handle $ prefix, decimals)
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
    const priceInCents = Math.round(priceNum * 100);

    try {
      const result = await paymentService.createPaymentButton({
        name: name.trim(),
        description: description.trim(),
        priceInCents,
        buttonText: buttonText.trim() || 'Buy Now',
        buttonColor: buttonColor,
      });

      setCreatedButton({
        id: result.id,
        url: result.url,
        productName: name.trim(),
      });
      setStep('success');
      onCreated({ id: result.id, url: result.url, productName: name.trim() });
    } catch (err) {
      console.error('Failed to create payment button:', err);
      setStep('details');
    }
  };

  const handleCopyUrl = () => {
    if (!createdButton?.url) return;
    navigator.clipboard.writeText(createdButton.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setStep('details');
    setName('');
    setDescription('');
    setPrice('');
    setButtonText('Buy Now');
    setButtonColor('#000000');
    setCreatedButton(null);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-theme-surface w-full max-w-lg rounded-[32px] shadow-2xl relative overflow-hidden border border-theme"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-theme-background border border-theme text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Details Form */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">
                          Create Payment Button
                        </h2>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                          Stripe Protected • Secure Checkout
                        </p>
                      </div>
                    </div>

                    {/* Stripe Connection Status */}
                    {!stripeStatus.connected && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                          ⚠ Stripe account not connected. Please complete Stripe onboarding in Finances first.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Product Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-primary" />
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Digital Empire Zen Planner"
                          className="w-full bg-theme-background border border-theme rounded-2xl px-4 py-3 text-xs font-medium outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-slate-600"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Type className="w-3 h-3 text-primary" />
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Brief description of your product..."
                          rows={2}
                          className="w-full bg-theme-background border border-theme rounded-2xl px-4 py-3 text-xs font-medium outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-slate-600 resize-none"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-primary" />
                          Price (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0.50"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="24.99"
                            className="w-full bg-theme-background border border-theme rounded-2xl pl-8 pr-4 py-3 text-xs font-medium outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      {/* Button Styling */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Type className="w-3 h-3 text-primary" />
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Buy Now"
                            className="w-full bg-theme-background border border-theme rounded-2xl px-4 py-3 text-xs font-medium outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-slate-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Palette className="w-3 h-3 text-primary" />
                            Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={buttonColor}
                              onChange={(e) => setButtonColor(e.target.value)}
                              className="w-10 h-10 rounded-xl border border-theme cursor-pointer bg-transparent"
                            />
                            <span className="text-[9px] font-mono font-bold text-muted-foreground">
                              {buttonColor}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Create button */}
                    <button
                      onClick={handleCreate}
                      disabled={!name.trim() || !price.trim() || !stripeStatus.connected}
                      className={cn(
                        'w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all',
                        'flex items-center justify-center gap-2 shadow-lg',
                        name.trim() && price.trim() && stripeStatus.connected
                          ? 'bg-primary text-slate-950 hover:bg-white'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      Create Secure Button
                    </button>

                    {/* Price Note */}
                    <p className="text-[8px] font-bold text-center text-muted-foreground/60 uppercase tracking-widest">
                      Protected by Stripe Connect • 4% Success-Share + Stripe fees apply
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Creating */}
                {step === 'creating' && (
                  <motion.div
                    key="creating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 flex flex-col items-center justify-center space-y-6"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                        Creating Protected Button
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Deploying to Stripe Secure Gateway...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {step === 'success' && createdButton && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col items-center py-6 space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                          Button Created!
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {createdButton.productName} — now live and protected
                        </p>
                      </div>
                    </div>

                    {/* URL display */}
                    <div className="p-4 bg-theme-background border border-theme rounded-2xl space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                        Shareable URL
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-[10px] font-mono font-bold text-foreground truncate bg-theme-surface px-3 py-2 rounded-xl border border-theme">
                          {createdButton.url}
                        </code>
                        <button
                          onClick={handleCopyUrl}
                          className="p-2 rounded-xl bg-theme-surface border border-theme text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Preview hint */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                          Next: Embed on Social Media
                        </p>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Copy this URL and paste it into your TikTok, Instagram, or YouTube bio/link.
                        Buyers will be directed to a secure Stripe checkout page.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-4 border-2 border-theme rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:border-white/30 transition-all"
                      >
                        Done
                      </button>
                      <button
                        onClick={handleCopyUrl}
                        className="flex-[2] py-4 bg-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy & Share
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}