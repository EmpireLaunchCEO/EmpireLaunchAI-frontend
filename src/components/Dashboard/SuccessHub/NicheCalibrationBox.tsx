"use client";

import React from 'react';
import { Target } from 'lucide-react';

interface NicheBoxProps {
  niche?: string;
}

export const NicheCalibrationBox = ({ niche }: NicheBoxProps) => {
  return (
    <div className="bg-theme-surface border border-theme rounded-[32px] p-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
           </div>
           <div>
              <h3 className="text-xl font-black text-foreground uppercase italic tracking-tight">Empire Niche</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neural Calibration Status</p>
           </div>
        </div>
        <div className="text-right">
           <p className="text-sm font-black text-foreground uppercase italic">{niche || "CALIBRATION PENDING"}</p>
           <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Sync Active</p>
        </div>
      </div>
    </div>
  );
};
