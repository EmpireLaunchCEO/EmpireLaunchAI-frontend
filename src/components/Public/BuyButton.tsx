"use client";

import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStripeStatus } from '@/lib/hooks/useStripeStatus';

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: string;
  sellerName: string;
  className?: string;
}

export function BuyButton({ productId, productName, price, sellerName, className }: BuyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const { isLinked: isStripeLinked } = useStripeStatus();

  const handlePurchase = () => {
    setStep('processing');
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setStep('details'), 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95",
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
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
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
                        <span className="text-2xl font-black text-blue-600">{price}</span>
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
                        <div className="flex items-center justify-between p-4 bg-white border-2 border-blue-600 rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-sm">•••• •••• •••• 4242</span>
                          </div>
                          {isStripeLinked ? (
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live Gateway</span>
                          ) : (
                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Demo Mode</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handlePurchase}
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      {isStripeLinked ? `Pay ${price}` : `Test Purchase (${price})`} <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-[10px] text-center font-bold text-slate-400 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> Encrypted by EmpireLaunch Secure Gateway
                    </p>
                  </div>
                )}

                {step === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-black uppercase italic tracking-tight">Processing.</h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verifying with Bank...</p>
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="text-center space-y-2 px-4">
                      <h3 className="text-2xl font-black tracking-tight">Purchase Complete!</h3>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">
                        The transaction was successful. The funds have been routed to <strong>{sellerName}</strong>. 
                      </p>
                      <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Receipt Number</p>
                         <p className="text-xs font-mono font-bold text-slate-600">EMP-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Return to Store
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
