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
}

export function ConsultantToolkit({ businessAngle }: ConsultantToolkitProps) {
  const tools = getToolRecommendations(businessAngle);

  const canvaCost = (wisdomData.cost_analysis as any).Canva.Pro;

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-foreground tracking-tight">Consultant's Toolkit.</h2>
        <p className="text-slate-500 text-lg">AI Engines Standing By: These tools will activate automatically in your command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {tools.map((tool: any, i: number) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 border-theme bg-theme-surface hover:border-blue-600 transition-all group"
          >
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl", tool.bg)}>
                <tool.icon className={cn("w-6 h-6 md:w-8 h-8", tool.color)} />
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                tool.type === 'Essential' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              )}>
                {tool.type}
              </span>
            </div>

            <div className="space-y-1 md:space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">{tool.name}</h3>
              <p className="text-sm md:text-base text-slate-500 font-medium leading-tight">{tool.purpose}</p>
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Est. Investment</span>
                <span className="text-xs md:text-sm font-bold text-foreground">{tool.cost}</span>
              </div>
              <button className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-theme-background hover:bg-blue-600 hover:text-white transition-all">
                <ExternalLink className="w-4 h-4 md:w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-blue-600 flex items-center justify-center shrink-0 shadow-2xl shadow-blue-500/20">
            <Zap className="w-6 h-6 md:w-8 h-8 fill-current" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg md:text-xl font-bold italic">“Canva Pro is worth the {canvaCost} investment.”</h4>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Based on your Niche, the background remover and brand kit features will save us 12+ hours of manual design work every month.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
          <Stars className="w-24 h-24 text-blue-400" />
        </div>
      </div>
    </div>
  );
}
