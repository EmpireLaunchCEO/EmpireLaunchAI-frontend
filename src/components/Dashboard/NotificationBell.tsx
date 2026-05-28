"use client";

import React, { useState } from 'react';
import { Bell, CheckCircle2, ShoppingBag, Bot, Info, X } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell({ id }: { id?: string }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useEmpire();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        id={id || "notification-bell"}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-theme-surface border-2 border-theme hover:border-blue-600 transition-all group shadow-sm"
      >
        <Bell className={cn("w-6 h-6 transition-colors", unreadCount > 0 ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600")} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 md:w-96 bg-theme-surface rounded-[32px] shadow-2xl border-2 border-theme z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-theme-background/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-foreground tracking-tight">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-theme-background rounded-full flex items-center justify-center mx-auto">
                      <Bell className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">Your empire is quiet. No new alerts.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={cn(
                          "p-5 hover:bg-theme-background transition-colors relative group",
                          !n.read && "bg-blue-50/30"
                        )}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="flex gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            n.type === 'sale' ? "bg-emerald-100 text-emerald-600" :
                            n.type === 'approval' ? "bg-blue-100 text-blue-600" :
                            "bg-slate-100 text-slate-600"
                          )}>
                            {n.type === 'sale' ? <ShoppingBag className="w-5 h-5" /> :
                             n.type === 'approval' ? <Bot className="w-5 h-5" /> :
                             <Info className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-foreground text-sm truncate">{n.title}</h4>
                            <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 block">
                              {formatDistanceToNow(n.timestamp)} ago
                            </span>
                          </div>
                          {!n.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 bg-theme-background/50 border-t border-slate-50 text-center">
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                    View All History
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
