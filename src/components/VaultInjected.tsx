"use client";

import React from 'react';
import { Database, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VaultInjectedProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function VaultInjected({ size = 'sm', className }: VaultInjectedProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-widest border backdrop-blur-sm",
        size === 'sm' 
          ? "px-2 py-0.5 text-[7px] border-cyan-400/20 bg-cyan-400/5 text-cyan-400"
          : "px-3 py-1 text-[8px] border-cyan-400/30 bg-cyan-400/10 text-cyan-400",
        className
      )}
    >
      <Database className={size === 'sm' ? "w-2.5 h-2.5" : "w-3 h-3"} />
      Vault-Injected
      <Shield className={size === 'sm' ? "w-2.5 h-2.5" : "w-3 h-3"} />
    </div>
  );
}