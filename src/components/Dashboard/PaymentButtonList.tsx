"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ExternalLink, 
  Copy, 
  Check,
  MoreVertical,
  MousePointer2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, PaymentButton } from '@/lib/api-service';

export function PaymentButtonList() {
  const [buttons, setButtons] = useState<PaymentButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await analyticsService.getPaymentButtons();
      setButtons(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    // Real copy logic would go here
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Payment Buttons</h3>
        </div>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl">
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {buttons.map((button) => (
          <div key={button.id} className="p-5 border border-slate-50 rounded-[24px] hover:border-blue-100 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                 <MousePointer2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-slate-900">{button.label}</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{button.productName}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-blue-600">${button.price}</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right mr-4 hidden md:block">
                 <p className="text-sm font-black text-slate-900">{button.usageCount} Clicks</p>
                 <p className="text-[10px] font-bold text-green-500">Active</p>
              </div>
              <button 
                onClick={() => handleCopy(button.id)}
                className="p-3 hover:bg-slate-50 rounded-xl transition-colors relative"
              >
                {copiedId === button.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
              <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
