"use client";

import React from 'react';
import { 
  X, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { SecureIndicator } from '../Review/SecureIndicator';

interface FinancialGateProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  type: 'subscription' | 'transfer' | 'purchase';
  amount: string;
  description: string;
  platform?: string;
  reason?: string;
}

export function FinancialGate({ 
  isOpen, 
  onClose, 
  onApprove, 
  type, 
  amount, 
  description, 
  platform,
  reason 
}: FinancialGateProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Financial Approval Required</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Your AI Partner is requesting approval for a {type}. No funds will be moved without your explicit consent.
          </p>

          {/* Transaction Card */}
          <div className="bg-slate-50 rounded-2xl p-6 mt-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
                <span className="text-3xl font-black text-slate-900">{amount}</span>
              </div>
              {platform && (
                <div className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                  {platform}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                <p className="text-sm font-medium text-slate-700">{description}</p>
              </div>
              {reason && (
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-slate-600 italic">“{reason}”</p>
                </div>
              )}
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 space-y-4">
            {type === 'subscription' && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="flex gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest">Billing Transparency</h4>
                    <p className="text-[11px] text-blue-800 leading-relaxed mt-1">
                      We secure your monthly dues automatically from your business earnings. If your empire hasn't generated profit yet, dues are charged to your primary card until you're in the green.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <SecureIndicator />
          </div>

          {/* Warning */}
          <div className="mt-6 flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Wait!</strong> Always verify the recipient and amount. EmpireLaunchAI will never ask for your password in this popup.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={onApprove}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              Approve <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
            View full security details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
