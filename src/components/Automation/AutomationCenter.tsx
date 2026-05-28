"use client";

import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  History, 
  Eye, 
  Settings2,
  Heart,
  Star,
  Activity,
  ToggleLeft as Toggle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sentLog = [
  { id: '1', recipient: 'sarah.j@example.com', subject: 'A special thank you from Celestial Journals', date: '10m ago', type: 'Gratitude' },
  { id: '2', recipient: 'mike_p@provider.net', subject: 'How is your Zen Journal doing?', date: '1h ago', type: 'Social Proof' },
  { id: '3', recipient: 'creativelady@blog.com', subject: 'Your download is ready!', date: '3h ago', type: 'Fulfillment' },
];

const flows = [
  { 
    id: 'gratitude', 
    name: 'The "Gratitude" Flow', 
    description: 'Triggered 1 hour after purchase. A sincere "Thank You" email.',
    status: 'active',
    icon: Heart,
    color: 'text-rose-500'
  },
  { 
    id: 'social-proof', 
    name: 'The "Social Proof" Request', 
    description: 'Triggered 7 days after purchase. Asks for a review on Etsy.',
    status: 'active',
    icon: Star,
    color: 'text-amber-500'
  }
];

export function AutomationCenter() {
  const [hitlMode, setHitlMode] = useState(false);
  const [tone, setTone] = useState(50);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-theme-surface p-8 rounded-[40px] border border-theme shadow-sm">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">Automation Control</h3>
          <p className="text-sm text-theme-background0">Manage how AI communicates with your customers.</p>
        </div>
        <div className="flex items-center gap-4 bg-theme-background px-6 py-4 rounded-3xl">
          <span className="text-sm font-bold text-slate-700">Manual Review (HITL)</span>
          <button 
            onClick={() => setHitlMode(!hitlMode)}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative",
              hitlMode ? "bg-primary" : "bg-slate-300"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-theme-surface rounded-full transition-all",
              hitlMode ? "left-7" : "left-1"
            )} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Sequences */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-4">Automated Sequences</h4>
          {flows.map((flow) => (
            <div key={flow.id} className="bg-theme-surface p-8 rounded-[40px] border border-theme shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="bg-theme-background p-3 rounded-2xl">
                    <flow.icon className={cn("w-6 h-6", flow.color)} />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">{flow.name}</h5>
                    <p className="text-xs text-theme-background0 mt-1">{flow.description}</p>
                  </div>
                </div>
                <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                  Active
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400">Tone: {tone < 33 ? 'Professional' : tone < 66 ? 'Balanced' : 'Warm & Personal'}</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={tone}
                    onChange={(e) => setTone(parseInt(e.target.value))}
                    className="w-32 accent-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-theme-background text-foreground py-3 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> Preview Draft
                  </button>
                  <button className="bg-theme-background text-foreground p-3 rounded-2xl hover:bg-slate-100 transition-all">
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sent Log & Trust Pulse */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <h4 className="font-bold">Customer Sentiment Pulse</h4>
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">High Trust</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">88</span>
              <span className="text-white/40 font-bold mb-1">/100</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              "Customers love your fast response times and the personalized touch in follow-up emails."
            </p>
          </div>

          <div className="bg-theme-surface rounded-[40px] border border-theme shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-theme-background">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Sent Log</h4>
            </div>
            <div className="divide-y divide-theme-background">
              {sentLog.map((log) => (
                <div key={log.id} className="p-6 hover:bg-theme-background transition-colors flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{log.recipient}</p>
                      <p className="text-[10px] text-theme-background0 truncate max-w-[200px]">{log.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.type}</p>
                    <p className="text-[10px] text-slate-400">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="p-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors text-center">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
