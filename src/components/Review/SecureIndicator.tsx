import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecureIndicatorProps {
  className?: string;
  variant?: 'minimal' | 'full';
}

export function SecureIndicator({ className, variant = 'full' }: SecureIndicatorProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-1 text-green-600", className)}>
        <ShieldCheck className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Verified Secure</span>
      </div>
    );
  }

  return (
    <div className={cn("bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 flex items-center gap-2", className)}>
      <Lock className="w-3.5 h-3.5 text-green-600" />
      <span className="text-xs font-bold text-green-700 uppercase tracking-widest">End-to-End Encrypted & Secure</span>
    </div>
  );
}
