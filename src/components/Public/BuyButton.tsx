"use client";

import React, { useState, useCallback } from 'react';
import { ShoppingCart, ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStripeStatus } from '@/lib/hooks/useStripeStatus';
import { paymentService } from '@/lib/api-service';

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: string;
  priceInCents?: number;
  sellerName: string;
  description?: string;
  className?: string;
}

/**
 * BuyButton — Stripe Checkout Integration
 * 
 * Opens a Stripe-hosted Checkout session in a new tab for secure payment processing.
 * Falls back to modal-based mock flow if Stripe is not connected (Demo Mode).
 */
export function BuyButton({ 
  productId, 
  productName, 
  price, 
  priceInCents, 
  sellerName, 
  description,
  className 
}: BuyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [error, setError] = useState<string | null>(null);
  const { isLinked: isStripeLinked } = useStripeStatus();

  const handleStripeCheckout = useCallback(async () => {
    setError(null);
    setStep('processing');

    try {
      const cents = priceInCents || Math.round(parseFloat(price.replace(/[^0-9.]/g, '')) * 100);
      const result = await paymentService.createPaymentLink(
        productName,
        description || productName,
        cents
      );
      // Open Stripe Checkout in a new tab
      window.open(result.url, '_blank');
      setStep('success');
    } catch (err) {
      console.error('Stripe checkout error:', err);
      setError('Failed to create checkout. Please try again.');
      setStep('details');
    }
  }, [productName, description, price, priceInCents]);

  const handlePurchase = () => {
    if (isStripeLinked) {
      handleStripeCheckout();
    } else {
      // Demo mode: simulate payment
      setStep('processing');
      setTimeout(() => {
        setStep('success');
      }, 2500);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
    setTimeout(() => setStep('details'), 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "bg-primary hover:bg-white text-white hover:text-slate-950 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95",
          className
        )}
      >
        <ShoppingCart className="w-5 h-5" />
        Buy Now — {price}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative overflow-hidden text-slate-900"
            >
              {/* Header */}
              <div className="p-8 pb-0 flex justify-between items-start">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Checkout</span>
                  <div className="flex gap-1 mt-1">
                    <CreditCard className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="p-8">
                {step === 'details' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">{productName}</h2>
                      <p className="text-sm font-medium text-slate-500">Sold by {sellerName}</p>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-slate-600">Total Price</span>
                        <span className="text-2xl font-black text-primary">{price}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Instant Digital Delivery
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Buyer Protection Active
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Payment Method</label>
                        <div className="flex items-center justify-between p-4 bg-white border-2 border-primary rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <span className="font-bold text-sm">Stripe Secure Checkout</span>
                          </div>
                          {isStripeLinked ? (
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live Gateway</span>
                          ) : (
                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Demo Mode</span>
                          )}
                        </div>
                      </div>
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

                    <button
                      onClick={handlePurchase}
                      disabled={false}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isStripeLinked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay {price} via Stripe <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          {`Test Purchase (${price})`} <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center font-bold text-slate-400 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> Encrypted by EmpireLaunch Secure Gateway
                    </p>
                  </div>
                )}

                {step === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                    <div className="relative">
                      <BrandedGlobe size="xl" animate={true} className="shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary/20 rounded-full animate-ping" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-black uppercase italic tracking-tight">
                        {isStripeLinked ? 'Redirecting to Stripe...' : 'Processing.'}
                      </h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                        {isStripeLinked ? 'Opening secure checkout' : 'Verifying with Bank...'}
                      </p>
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="text-center space-y-2 px-4">
                      <h3 className="text-2xl font-black tracking-tight">Checkout Initiated!</h3>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">
                        {isStripeLinked 
                          ? 'A secure Stripe Checkout tab has been opened. Complete your payment there.'
                          : 'The transaction was successful. The funds have been routed to '}<strong>{sellerName}</strong>. 
                      </p>
                      {isStripeLinked && (
                        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">
                            ⚠ Check your browser tabs — Stripe Checkout is open
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                    >
                      {isStripeLinked ? 'Return to Store' : 'Continue'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}