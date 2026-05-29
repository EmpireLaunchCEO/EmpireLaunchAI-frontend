"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  Target,
  Calendar,
  ShoppingBag,
  Edit3,
  Check,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlueprintGateProps {
  payload: {
    niche: string;
    products: Array<{ name: string; price: number; type: string }>;
    roadmap: Array<{ day: number; action: string }>;
  };
  onApprove: (updatedPayload: any) => void;
  onReject: () => void;
}

export function BlueprintGate({ payload, onApprove, onReject }: BlueprintGateProps) {
  const [editedPayload, setEditedPayload] = useState(payload);
  const [isEditing, setIsEditing] = useState(false);

  const handlePriceChange = (index: number, newPrice: string) => {
    const updatedProducts = [...editedPayload.products];
    updatedProducts[index].price = parseFloat(newPrice) || 0;
    setEditedPayload({ ...editedPayload, products: updatedProducts });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-blue-600/5 p-6 rounded-[32px] border border-blue-600/10">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground leading-tight">Strategy Roadmap.</h3>
          <p className="text-sm text-muted-foreground font-medium italic">"I've found a high-growth niche in {payload?.niche ?? 'your business sector'}. Proceed with this plan?"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Strategy */}
        <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-blue-600" />
               <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Product Lineup</h4>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-theme-background rounded-xl transition-colors text-slate-400"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {(editedPayload?.products ?? []).map((product, i) => (
              <div key={i} className="p-4 bg-theme-background rounded-2xl flex items-center justify-between group">
                <div className="space-y-1">
                   <p className="text-sm font-bold text-foreground">{product.name}</p>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.type}</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handlePriceChange(i, e.target.value)}
                      className="w-20 bg-theme-surface border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:border-blue-600"
                    />
                  </div>
                ) : (
                  <p className="text-sm font-black text-blue-600">${(product.price ?? 0).toFixed(2)}</p>
                )}
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-200 hover:text-blue-400 transition-all">
               <Plus className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Add Product</span>
            </button>
          </div>
        </div>

        {/* 30-Day Roadmap */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 relative z-10">
             <Calendar className="w-5 h-5 text-blue-400" />
             <h4 className="font-black uppercase tracking-widest text-xs">Expansion Roadmap</h4>
          </div>

          <div className="space-y-6 relative z-10 border-l-2 border-white/5 ml-2">
             {(editedPayload?.roadmap ?? []).map((item, i) => (
               <div key={i} className="relative pl-6">
                  <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500" />
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Day {item.day}</span>
                     <p className="text-sm font-medium text-slate-300">{item.action}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Target className="w-48 h-48 -mr-12 -mb-12 rotate-12" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onReject}
          className="flex-1 py-5 border-2 border-theme rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Request New Pivot
        </button>
        <button
          onClick={() => onApprove(editedPayload)}
          className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
        >
          Activate Strategy
          <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
