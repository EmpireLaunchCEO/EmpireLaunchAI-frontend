"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, FileText, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialMetricProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const Metric = ({ label, value, change, isPositive, icon: Icon, color }: FinancialMetricProps) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
        isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      )}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div className="space-y-1">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
  </div>
);

export function FinancialOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Metric 
        label="Total Revenue" 
        value="$12,450.00" 
        change="+14.5%" 
        isPositive={true} 
        icon={DollarSign} 
        color="bg-blue-600"
      />
      <Metric 
        label="Pending Invoices" 
        value="18" 
        change="-2" 
        isPositive={true} 
        icon={FileText} 
        color="bg-indigo-600"
      />
      <Metric 
        label="Profit Margin" 
        value="68%" 
        change="+4.2%" 
        isPositive={true} 
        icon={PieChart} 
        color="bg-emerald-600"
      />
    </div>
  );
}
