"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface SignUpFormProps {
  onSuccess: (userId: string, email: string) => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onSuccess(data.userId, email);
      } else {
        setError(data.error || 'Failed to initialize identity.');
      }
    } catch (err) {
      setError('Neural connection failed. Check your link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight uppercase italic">Neural Identity.</h2>
        <p className="text-muted-foreground text-xs md:text-sm font-medium italic">
          "Create your secure access point to the Empire Matrix."
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
            <Mail className="w-3 h-3 text-primary" />
            Email Address
          </label>
          <div className="relative group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@IDENTITY.COM"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold placeholder:text-slate-700 focus:border-primary/60 transition-all outline-none text-white shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-1">
            <Lock className="w-3 h-3 text-primary" />
            Secure Access Key
          </label>
          <div className="relative group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold placeholder:text-slate-700 focus:border-primary/60 transition-all outline-none text-white shadow-inner"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest italic">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-theme-gradient text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 group border-none disabled:opacity-50"
        >
          {isLoading ? 'Synchronizing...' : 'Initialize Identity'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};
