"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Key } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface SignUpFormProps {
  onSuccess: (userId: string, email: string) => void;
  initialMode?: 'signup' | 'login';
  masterKey?: string;
}

export const SignUpForm = ({ onSuccess, initialMode = 'signup', masterKey }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [useMasterKey, setUseMasterKey] = useState(!!masterKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let endpoint: string;
      let body: any;

      if (useMasterKey) {
        endpoint = '/api/auth/master-login';
        body = { email, key: masterKey || password };
      } else if (isLogin) {
        endpoint = '/api/auth/login';
        body = { email, password };
      } else {
        endpoint = '/api/auth/register';
        body = { email, password };
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        onSuccess(data.userId, email);
      } else {
        setError(data.error || `Failed to ${isLogin ? 'authenticate' : 'initialize'} identity.`);
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
        <BrandedGlobe size="2xl" className="mx-auto" />
        <h2 className="text-2xl md:text-3xl font-black text-theme-gradient tracking-tight uppercase italic">
          {useMasterKey ? 'Master Access.' : isLogin ? 'Neural Access.' : 'Neural Identity.'}
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm font-medium italic">
          {useMasterKey 
            ? '"Authorize with your Empire Master Key."'
            : isLogin 
              ? '"Re-establish your connection to the Empire Matrix."'
              : '"Create your secure access point to the Empire Matrix."'
          }
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
            {useMasterKey ? <Key className="w-3 h-3 text-primary" /> : <Lock className="w-3 h-3 text-primary" />}
            {useMasterKey ? 'Master Key' : 'Secure Access Key'}
          </label>
          <div className="relative group">
            <input
              type="password"
              required={!useMasterKey}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={useMasterKey ? "••••••••••••" : "••••••••••••"}
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

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-theme-gradient text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 group border-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <BrandedGlobe size="sm" spinning className="bg-transparent shadow-none border-none" />
                Synchronizing...
              </>
            ) : (useMasterKey ? 'Authorize Master Access' : isLogin ? 'Access Command Center' : 'Initialize Identity')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {!useMasterKey && (
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors py-2"
            >
              {isLogin ? "Need to create a new empire? Sign Up" : "Already have an empire? Log In"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};