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
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="bg-theme-surface border border-theme rounded-[40px] p-8 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-foreground">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-foreground">Payment Buttons</h3>
        </div>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl">
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {buttons.map((button) => (
          <div key={button.id} className="p-5 border border-theme rounded-[24px] hover:border-primary/30 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-theme-background flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                 <MousePointer2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-foreground">{button.label}</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{button.productName}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-[10px] font-bold text-primary">${button.price}</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right mr-4 hidden md:block">
                 <p className="text-sm font-black text-foreground">{button.usageCount} Clicks</p>
                 <p className="text-[10px] font-bold text-green-500">Active</p>
              </div>
              <button 
                onClick={() => handleCopy(button.id)}
                className="p-3 hover:bg-theme-background rounded-xl transition-colors relative"
              >
                {copiedId === button.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
              <button className="p-3 hover:bg-theme-background rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
