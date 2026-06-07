"use client";

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Calendar,
  RefreshCcw,
  Send,
  Clock,
  Stars,
  ChevronDown,
  Camera,
  Video,
  ShieldCheck,
  ArrowLeftRight,
  ExternalLink
} from 'lucide-react';
import { BuyButton } from '../Public/BuyButton';
import { SecureIndicator } from './SecureIndicator';
import { ComparisonMode } from './ComparisonMode';
import { HighlightedText } from './HighlightedText';

interface ReviewCardProps {
  id: string;
  platform: 'Etsy' | 'TikTok' | 'Instagram';
  title: string;
  scheduledTime: string;
  description: string;
  previousVersion?: { title: string, description: string };
  onApprove?: (id: string) => void;
  onRegenerate?: (id: string) => void;
}

const platformConfig = {
  Etsy: { icon: ShoppingBag, color: 'text-orange-600', label: 'Listing' },
  TikTok: { icon: Video, color: 'text-pink-600', label: 'Video' },
  Instagram: { icon: Camera, color: 'text-purple-600', label: 'Post' },
};

export function ReviewCard({ id, platform, title, scheduledTime, description, previousVersion, onApprove, onRegenerate }: ReviewCardProps) {
  const [tone, setTone] = useState('Professional');
  const [isComparing, setIsComparing] = useState(false);

  // Local state to handle AI refinements while allowing user edits
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentDescription, setCurrentDescription] = useState(description);

  // Update local state when props change (AI refinement)
  React.useEffect(() => {
    setCurrentTitle(title);
    setCurrentDescription(description);
  }, [title, description]);

  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <div className="bg-theme-surface rounded-3xl shadow-sm border border-theme overflow-hidden">
      <div className="p-4 md:p-6 border-b border-theme flex flex-col md:flex-row justify-between items-start md:items-center bg-theme-background/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-theme-surface p-2 rounded-xl shadow-sm">
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{platform} {config.label}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">{scheduledTime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <SecureIndicator variant="minimal" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Score:</span>
            <div className="w-16 md:w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-green-500" />
            </div>
            <span className="text-xs font-bold text-green-600">85%</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="aspect-video bg-slate-100 rounded-2xl mb-6 flex items-center justify-center relative group cursor-pointer overflow-hidden border-2 border-theme shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center gap-4 p-6 text-center">
             <div className="flex items-center gap-1">
               {[1, 2, 3, 4, 5].map((i) => (
                 <Stars key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
               ))}
             </div>
             <div className="space-y-1">
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">Live Preview</p>
               <h4 className="font-bold text-slate-800 text-sm">{currentTitle}</h4>
             </div>
             
             {/* THE PAYMENT BUTTON PREVIEW */}
             <div className="scale-75 origin-center">
                <BuyButton 
                  productId={id}
                  productName={currentTitle}
                  price="$24.99"
                  sellerName="Your Empire"
                />
             </div>
          </div>

          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
            <span className="text-white font-black uppercase tracking-widest bg-theme-surface/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-xs">Edit Preview Visuals</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Title</label>
            <div className="relative">
              <HighlightedText text={currentTitle} isNew={!!previousVersion} />
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="w-full bg-theme-background/50 border border-theme rounded-xl px-4 py-3 font-semibold text-foreground outline-none focus:border-blue-600 transition-colors absolute inset-0 bg-transparent"
              />
              {/* Spacer to maintain height since input is absolute */}
              <div className="px-4 py-3 font-semibold opacity-0 pointer-events-none">{currentTitle || ' '}</div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
            <div className="relative">
              <HighlightedText text={currentDescription} isNew={!!previousVersion} />
              <textarea
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                rows={4}
                className="w-full bg-theme-background/50 border border-theme rounded-xl px-4 py-3 text-slate-600 text-sm leading-relaxed outline-none focus:border-blue-600 transition-colors resize-none absolute inset-0 bg-transparent"
              />
              {/* Spacer */}
              <div className="px-4 py-3 text-sm leading-relaxed opacity-0 pointer-events-none whitespace-pre-wrap min-h-[112px]">{currentDescription || ' '}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onRegenerate?.(id)}
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors shrink-0"
            >
              <RefreshCcw className="w-4 h-4" />
              Regenerate
            </button>
            {previousVersion && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <button
                  onClick={() => setIsComparing(true)}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100 shrink-0"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Compare
                </button>
                <div className="relative shrink-0">
                  <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                    Tone: {tone}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 md:flex-none bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
              Save Draft
            </button>
            <button
              onClick={() => onApprove?.(id)}
              className="flex-[2] md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <Send className="w-4 h-4" />
              Approve
            </button>
          </div>
        </div>
      </div>

      {previousVersion && (
        <ComparisonMode
          isOpen={isComparing}
          onClose={() => setIsComparing(false)}
          originalTitle={previousVersion.title}
          originalDescription={previousVersion.description}
          proposedTitle={title}
          proposedDescription={description}
          onAccept={() => {
            setIsComparing(false);
            // Approval logic will be handled by the parent
          }}
          onReject={() => setIsComparing(false)}
        />
      )}
    </div>
  );
}
