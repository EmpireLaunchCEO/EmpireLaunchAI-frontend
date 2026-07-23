"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';

export function FeedbackInbox() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews/inbox`);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data || []);
        }
      } catch (e) {
        console.warn('Failed to fetch feedback inbox');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
    // Auto-refresh every 30 seconds so new client messages appear
    const interval = setInterval(fetchFeedback, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="bg-theme-surface border-2 border-theme rounded-[32px] p-6 md:p-8 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] -z-10" />
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Feedback Inbox</h3>
          <p className="text-[10px] text-muted-foreground font-medium">
            {feedbacks.length} message{feedbacks.length !== 1 ? 's' : ''} from users
          </p>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-xs text-muted-foreground/50 font-bold text-center py-6">No feedback yet</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {feedbacks.map((fb: any) => (
            <div key={fb.id} className="p-4 rounded-2xl bg-theme-background border border-theme space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  <User className="w-3 h-3" />
                  {fb.userEmail || fb.userId?.slice(0, 8)}
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={cn('w-3 h-3', s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600')} />
                  ))}
                </div>
              </div>
              {fb.comment && (
                <p className="text-xs text-foreground/80 font-medium leading-relaxed">{fb.comment}</p>
              )}
              <p className="text-[8px] text-muted-foreground/40 font-bold">
                {new Date(fb.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}