"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ChevronDown, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';

/**
 * Home Base inline "Link your social apps" connect panel (owner direction, Aug 26).
 *
 * Renders a real inline connect panel directly on the Home Base (Dashboard) page —
 * NOT just a shortcut to the Link Center. It reuses the existing GuidedLinking
 * composer (AvailablePlatforms search, OAuth / Neural Handshake connect, platform
 * permissions, user-scoped connected_platforms updates) so linking stays consistent
 * with the rest of the app.
 *
 * The panel is collapsible so it doesn't crowd the Home Base, and it shows a quick
 * connected-platform summary in its header so connect state is visible at a glance.
 */
export function HomeBaseConnectPanel() {
  const { connectedPlatforms } = useEmpire();
  const [isOpen, setIsOpen] = useState(connectedPlatforms.length === 0);

  const count = connectedPlatforms.length;

  return (
    <section className="space-y-6">
      {/* Panel Header / Toggle */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 bg-theme-surface border-2 border-theme rounded-[32px] text-left transition-all hover:border-primary/40 group"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-foreground">
              Link your social apps
            </h3>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              {count > 0
                ? `${count} connected — add or manage your platforms here`
                : 'Connect the platforms you use so every video matches their formats'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {count > 0 && (
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" />
              {count} Connected
            </span>
          )}
          <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
        </div>
      </motion.button>

      {/* Panel Body — the real inline connect surface (reuses GuidedLinking) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="homebase-connect-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-theme-surface rounded-[40px] p-6 md:p-10 border-2 border-theme relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    Connect &amp; Manage
                  </span>
                </div>
                <GuidedLinking
                  headerTitle="Connect Your Social Apps"
                  headerSubtitle={(hasNoPlatforms) =>
                    hasNoPlatforms
                      ? "Search for an app to connect your empire"
                      : "Search and connect more platforms"
                  }
                />
              </div>

              {/* Background glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full blur-[120px] opacity-5 -mr-40 -mt-40" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-5 -ml-32 -mb-32" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
