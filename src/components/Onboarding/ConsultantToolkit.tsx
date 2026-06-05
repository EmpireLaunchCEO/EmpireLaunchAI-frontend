"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Smartphone,
  Layout,
  Mail,
  Layers,
  BarChart,
  CheckCircle2,
  Info,
  ExternalLink,
  Zap,
  Stars,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import wisdomData from '@/data/business_wisdom.json';

const getToolRecommendations = (businessAngle: string) => {
  const angleKey = businessAngle === 'physical' ? 'Print-on-Demand' :
                   businessAngle === 'services' ? 'Dropshipping' : 'Digital Marketing';

  const recommendations = (wisdomData.tool_recommendations as any)[angleKey] || [];

  return recommendations.map((tool: any) => {
    const costInfo = (wisdomData.cost_analysis as any)[tool.name];
    let cost = tool.type === 'Essential' ? "Pay per order" : "Free tier";
    if (costInfo) {
      cost = costInfo.Pro ? `Free / ${costInfo.Pro}` : (costInfo.Free === "$0" ? "Free" : costInfo.Free);
    }

    const icons: any = {
      'Canva': Layout,
      'CapCut': Smartphone,
      'Bannerbear': Stars,
      'Mailchimp': Mail,
      'Printful': Layers,
      'Printify': Layers,
      'Gelato': Globe,
      'HubSpot': BarChart,
      'Buffer': Smartphone
    };

    const colors: any = {
      'Canva': { color: "text-blue-600", bg: "bg-blue-50" },
      'CapCut': { color: "text-pink-600", bg: "bg-pink-50" },
      'Bannerbear': { color: "text-blue-900", bg: "bg-slate-100" },
      'Mailchimp': { color: "text-yellow-600", bg: "bg-yellow-50" },
      'Printful': { color: "text-orange-600", bg: "bg-orange-50" },
      'Printify': { color: "text-blue-600", bg: "bg-blue-50" },
      'Gelato': { color: "text-green-600", bg: "bg-green-50" },
      'HubSpot': { color: "text-orange-500", bg: "bg-orange-50" },
      'Buffer': { color: "text-blue-500", bg: "bg-blue-50" }
    };

    const style = colors[tool.name] || { color: "text-slate-600", bg: "bg-theme-background" };

    return {
      ...tool,
      cost,
      icon: icons[tool.name] || Wrench,
      ...style
    };
  });
};

interface ConsultantToolkitProps {
  businessAngle: string;
  onToolkitComplete: () => void;
}

export function ConsultantToolkit({ businessAngle, onToolkitComplete }: ConsultantToolkitProps) {
  return (
    <div className="space-y-10 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-foreground tracking-tight italic uppercase">
          Empire Harvest.
        </h2>
        <p className="text-muted-foreground text-sm uppercase font-black tracking-widest">
          Synchronizing 1,000,000 DNA Codes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[
          {
            name: "Synthesis Engine",
            tech: "Canva & Bannerbear",
            purpose: "Harvesting design DNA and automatically implementing winning styles into the Global Vault for immediate use.",
            icon: Layout,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
          },
          {
            name: "Viral Harvester",
            tech: "TikTok & Trend Data",
            purpose: "Scraping viral content patterns and synthesizing them into the Vault as actionable marketing blueprints.",
            icon: Smartphone,
            color: "text-pink-500",
            bg: "bg-pink-500/10"
          },
          {
            name: "Neural Pulse",
            tech: "Internet & Marketplace Scrapers",
            purpose: "Analyzing 500,000+ best-seller data points across Etsy and the web to feed your autonomous creation cycle.",
            icon: Globe,
            color: "text-primary",
            bg: "bg-primary/10"
          }
        ].map((engine, i) => (
          <motion.div
            key={engine.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 md:p-8 rounded-[32px] border-2 border-theme bg-theme-surface shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl", engine.bg)}>
                <engine.icon className={cn("w-8 h-8", engine.color)} />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">
                CORE HARVEST
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white italic">{engine.name}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{engine.tech}</p>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{engine.purpose}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="p-8 rounded-[40px] bg-slate-900 border border-primary/20 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold italic text-primary uppercase">Global Vault Active.</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                1,000,000+ harvested DNA codes are now syncing to your Studio for autonomous execution.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            console.log("Toolkit complete, triggering activation...");
            onToolkitComplete();
          }}
          className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl active:scale-95"
        >
          Initialize Command Center
        </button>
      </div>
    </div>
  );
}
