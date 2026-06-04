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
  const [toolkitPage, setToolkitPage] = React.useState(1);
  const allTools = getToolRecommendations(businessAngle);
  
  // Split tools into 2 pages: Essential and Growth
  const tools = toolkitPage === 1 
    ? allTools.filter((t: any) => t.type === 'Essential')
    : allTools.filter((t: any) => t.type !== 'Essential');

  const canvaCost = (wisdomData.cost_analysis as any).Canva.Pro;

  return (
    <div className="space-y-10 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-foreground tracking-tight">
          {toolkitPage === 1 ? "Essential Core." : "Growth Engine."}
        </h2>
        <p className="text-muted-foreground text-sm uppercase font-black tracking-widest">
          Toolkit Phase {toolkitPage} of 2
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tools.map((tool: any, i: number) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 md:p-8 rounded-[32px] border-2 border-theme bg-theme-surface shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-4 rounded-2xl", tool.bg)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                tool.type === 'Essential' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
              )}>
                {tool.type}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white italic">{tool.name}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{tool.purpose}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Investment</span>
                <span className="text-sm font-bold text-white">{tool.cost}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {toolkitPage === 1 ? (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setToolkitPage(2);
          }}
          className="w-full bg-primary text-slate-950 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(0,229,255,0.2)]"
        >
          View Growth Toolkit
        </button>
      ) : (
        <div className="space-y-6">
          <div className="p-8 rounded-[40px] bg-slate-900 border border-primary/20 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-start gap-6">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold italic text-primary">Neural Optimization Active.</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  These tools have been mapped to your specific business angle for maximum automation efficiency.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onToolkitComplete}
            className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
          >
            Finalize Activation
          </button>
        </div>
      )}
    </div>
  );
}
