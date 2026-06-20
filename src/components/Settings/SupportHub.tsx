"use client";

import React from 'react';
import { HelpCircle, LifeBuoy, FileText, ChevronRight, MessageCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RateApp } from './RateApp';

const supportTickets = [
  { id: 'TIC-1234', subject: 'Etsy API Sync Delay', status: 'AI Investigating', date: '2h ago' },
  { id: 'TIC-1190', subject: 'Billing Question', status: 'Resolved', date: '2d ago' },
];

const faqContent: Record<string, string> = {
  "Understanding Success Fees": "EmpireLaunch AI operates on a success-share model. We charge a flat 4% fee ($40 per $1,000 earned) only on revenue generated through content created by our AI. This aligns our interests with your growth—we only win when you win.",
  "AI Video Posting Schedules": "Our Neural Dispatch Center monitors real-time engagement data across platforms. When a video is ready, we suggest 'Golden Windows'—the specific hours when your target audience is most active and algorithms are most receptive to new content.",
  "Setting up Payouts": "Connect your Stripe account in the Financials tab. Once verified, all revenue from social commerce 'Buy' buttons is routed directly to your bank account. Hardware-level encryption and PCI-DSS compliance ensure your financial data is never exposed.",
  "Scaling with Neural Twins": "Neural Twins allow you to clone successful business models into new niches instantly. The AI replicates your brand DNA, high-converting style, and marketing logic into a new 'Expansion Slot' for multi-channel dominance."
};

export function SupportHub() {
  const [activeFAQ, setActiveFAQ] = React.useState<string | null>(null);

  const handlePrioritySupport = () => {
    const message = prompt("Direct line to Technical Assistants. Describe your issue:");
    if (message) {
      window.dispatchEvent(new CustomEvent('empire:new-user-feedback', { 
        detail: { rating: 'PRIORITY', review: message, userName: 'User_' + Math.floor(Math.random()*1000) } 
      }));
      alert("Ticket transmitted. An assistant will investigate the logic sync immediately.");
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Rate the App */}
      <RateApp />

      {/* 2. Contact & Issue Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[40px] bg-theme-surface text-white space-y-8 shadow-xl border-2 border-theme">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Need Assistance?</h3>
              <p className="text-sm font-medium text-muted-foreground">Our engineers are standing by.</p>
            </div>
          </div>

          <button 
            onClick={handlePrioritySupport}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group"
          >
            Priority Support Line <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Tickets</p>
            <div className="space-y-3">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-2xl bg-theme-background border border-theme hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-bold">{ticket.subject}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">{ticket.id} • {ticket.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    ticket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-theme-background flex items-center justify-center text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight">FAQ & Documents</h3>
              <p className="text-sm font-medium text-muted-foreground">Master the Empire Engine.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Understanding Success Fees",
              "AI Video Posting Schedules",
              "Setting up Payouts",
              "Scaling with Neural Twins"
            ].map((item) => (
              <button 
                key={item} 
                onClick={() => setActiveFAQ(item)}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-theme-background border-2 border-theme hover:border-primary/20 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-foreground/80 group-hover:text-primary">{item}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-primary/30 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeFAQ && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setActiveFAQ(null)}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-lg bg-theme-surface border-4 border-theme p-8 rounded-[40px] shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveFAQ(null)}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Info className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-black text-foreground italic uppercase tracking-tight">{activeFAQ}</h4>
                    </div>
                    
                    <p className="text-base font-medium text-muted-foreground leading-relaxed">
                      {faqContent[activeFAQ]}
                    </p>

                    <button 
                      onClick={() => setActiveFAQ(null)}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
                    >
                      Understood
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors">
            View Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
}
