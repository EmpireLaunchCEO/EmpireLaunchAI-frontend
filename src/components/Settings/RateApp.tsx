"use client";

import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { socialProofService } from '@/lib/api-service';

export function RateApp() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmittedLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittedLoading(true);
    
    try {
      const success = await socialProofService.submitRating(rating, review);
      if (success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmittedLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 rounded-[40px] bg-emerald-50 border-4 border-emerald-100 text-center space-y-6 relative overflow-hidden"
      >
        {rating >= 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-emerald-200/20 to-amber-200/20"
          />
        )}
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-foreground italic">Neural Sync Complete!</h3>
            <p className="text-sm font-bold text-slate-600 max-w-sm mx-auto leading-relaxed">
              {rating >= 4 
                ? "Your 5-star insight has been transmitted. The engineers are celebrating this milestone! 🚀"
                : "Thank you for the data. We're already optimizing the engine based on your feedback."}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Star className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight">Rate EmpireLaunch AI</h3>
          <p className="text-sm font-medium text-theme-background0">Share your thoughts with the engineers.</p>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className="p-2 transition-transform hover:scale-125 active:scale-95"
          >
            <Star 
              className={cn(
                "w-10 h-10 transition-colors",
                (hoveredRating || rating) >= star 
                  ? "fill-amber-400 text-amber-400" 
                  : "text-slate-200"
              )} 
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {rating > 0 && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6 overflow-hidden"
          >
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                {rating >= 4 ? "What do you love most?" : "How can we improve?"}
              </label>
              <div className="relative">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder={rating >= 4 ? "Tell us about your success..." : "What's missing from your workflow?"}
                  className="w-full p-5 rounded-3xl bg-theme-background border-2 border-theme focus:border-primary outline-none transition-all font-bold text-base min-h-[120px] resize-none"
                />
                <MessageSquare className="absolute right-5 bottom-5 w-5 h-5 text-slate-300" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {isSubmitting ? "Transmitting..." : (
                <>
                  Submit Feedback <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
