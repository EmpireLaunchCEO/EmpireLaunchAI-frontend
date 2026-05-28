"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, X, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';

interface NotificationOnboardingProps {
  onComplete?: () => void;
}

export function NotificationOnboarding({ onComplete }: NotificationOnboardingProps) {
  const { isNotificationModalDismissed, dismissNotificationModal } = useEmpire();
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'subscribing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check if permission is already granted or denied
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default' && !isNotificationModalDismissed) {
        const timer = setTimeout(() => {
          if (Notification.permission === 'default' && !isNotificationModalDismissed) {
            setIsVisible(true);
          }
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isNotificationModalDismissed]);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleActivate = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push notifications are not supported in this browser.');
      dismissNotificationModal();
      setIsVisible(false);
      return;
    }

    setStatus('subscribing');

    try {
      // 1. Request Permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted');
      }

      // 2. Get Service Worker Registration
      const registration = await navigator.serviceWorker.ready;

      // 3. Fetch VAPID Public Key
      const keyRes = await fetch(`${API_URL}/api/v1/push/public-key`);
      const { publicKey } = await keyRes.json();

      // 4. Subscribe to Push Manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // 5. Send Subscription to Backend
      const subscribeRes = await fetch(`${API_URL}/api/v1/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token' // In real app, use actual user token
        },
        body: JSON.stringify({
          subscription,
          userId: '00000000-0000-0000-0000-000000000000' // Mock user ID
        })
      });

      if (!subscribeRes.ok) {
        throw new Error('Failed to save subscription on server');
      }

      // Success State
      setStatus('success');
      
      // Simulate "Ding" visual pulse
      setTimeout(() => {
        dismissNotificationModal();
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 2500);

    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleClose = () => {
    dismissNotificationModal();
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={status === 'subscribing' ? undefined : handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden border border-white/10 min-h-[500px] flex flex-col items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {status === 'idle' || status === 'error' ? (
                <motion.div 
                  key="onboarding"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="pt-12 pb-6 flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full" />
                      <motion.div 
                        animate={{ 
                          rotate: status === 'error' ? [0, -10, 10, -10, 10, 0] : [0, -5, 5, -5, 5, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatDelay: status === 'error' ? 0.5 : 3
                        }}
                        className={cn(
                          "relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-colors",
                          status === 'error' ? "bg-red-500" : "bg-amber-400"
                        )}
                      >
                        <Bell className="w-10 h-10 text-foreground fill-slate-900/10" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="px-8 pb-12 text-center space-y-8">
                    <div className="space-y-3">
                      <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">
                        {status === 'error' ? 'Connection Failed' : <>Your Empire <span className="text-amber-400">Never Sleeps</span></>}
                      </h2>
                      <p className="text-slate-400 font-medium text-sm">
                        {status === 'error' 
                          ? 'We couldn\'t establish the neural link. Please check your browser settings.' 
                          : 'Enable alerts to stay synchronized with your autonomous agents and market velocity.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-left">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-theme-surface/5 border border-white/5 p-5 rounded-3xl flex items-start gap-4"
                      >
                        <div className="bg-amber-400/10 p-2 rounded-xl shrink-0 mt-1">
                          <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                        </div>
                        <div>
                          <h4 className="text-white font-black text-xs uppercase tracking-widest">Sales Pulse</h4>
                          <p className="text-slate-400 text-[11px] leading-relaxed mt-1">Get instant 'Ching' notifications for every new sale across all platforms.</p>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-theme-surface/5 border border-white/5 p-5 rounded-3xl flex items-start gap-4"
                      >
                        <div className="bg-amber-400/10 p-2 rounded-xl shrink-0 mt-1">
                          <ShieldCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                        </div>
                        <div>
                          <h4 className="text-white font-black text-xs uppercase tracking-widest">Strategic Gates</h4>
                          <p className="text-slate-400 text-[11px] leading-relaxed mt-1">Instantly approve AI pivots and content drafts directly from your lock screen.</p>
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <button
                        onClick={handleActivate}
                        disabled={status !== 'idle'}
                        className="w-full py-5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-foreground rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-400/10 active:scale-[0.98]"
                      >
                        Activate Real-Time Pulse
                      </button>
                      
                      <button
                        onClick={handleClose}
                        className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] hover:text-slate-300 transition-colors"
                      >
                        I'll Check Manually
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : status === 'subscribing' ? (
                <motion.div 
                  key="subscribing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-amber-400 animate-spin" />
                    <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Establishing Bridge</h3>
                    <p className="text-slate-400 text-xs font-bold">Synchronizing neural pathways...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center space-y-6 text-center"
                >
                   <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 60px rgba(251,191,36,0.4)", "0 0 0px rgba(251,191,36,0)"]
                    }}
                    transition={{ duration: 1, repeat: 1 }}
                    className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center"
                   >
                      <ShieldCheck className="w-12 h-12 text-foreground" />
                   </motion.div>
                   <div className="space-y-2">
                     <h2 className="text-2xl font-black text-white tracking-tight uppercase">Neural Link Established.</h2>
                     <p className="text-amber-400 font-bold text-sm uppercase tracking-widest">Alerts Active.</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] -ml-24 -mb-24" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
