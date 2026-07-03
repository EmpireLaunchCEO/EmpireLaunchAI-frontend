"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, Star, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';

export function NotificationBell() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews/inbox`);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data || []);
          setUnread((data || []).length);
        }
      } catch {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl bg-theme-surface border border-theme flex items-center justify-center hover:border-primary/50 transition-all"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-theme-surface border-2 border-theme rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {feedbacks.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 font-bold text-center py-8">No notifications yet</p>
            ) : (
              feedbacks.slice(0, 20).map((fb: any) => (
                <div key={fb.id} className="p-3 rounded-xl hover:bg-theme-background transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                      <User className="w-2.5 h-2.5" />
                      {fb.userEmail || fb.userId?.slice(0, 8)}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn('w-2 h-2', s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600')} />
                      ))}
                    </div>
                  </div>
                  {fb.comment && (
                    <p className="text-[11px] text-foreground/80 font-medium leading-relaxed line-clamp-2">{fb.comment}</p>
                  )}
                  <p className="text-[7px] text-muted-foreground/40 font-bold">{new Date(fb.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}