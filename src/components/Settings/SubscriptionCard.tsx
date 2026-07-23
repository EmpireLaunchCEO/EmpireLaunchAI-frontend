"use client";

import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface SubscriptionCardProps {
  brandName: string;
  price: string;
  renewsIn: string;
  isActive: boolean;
}

export function SubscriptionCard({ brandName, price, renewsIn, isActive }: SubscriptionCardProps) {
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 30);
  const formattedDate = renewalDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-5 bg-theme-background border-2 border-theme rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-foreground uppercase tracking-tight text-sm">{brandName}</h4>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Active</span>
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-foreground">{price}</span>
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <Clock className="w-3 h-3" />
          Renews {formattedDate}
        </span>
      </div>
    </div>
  );
}
