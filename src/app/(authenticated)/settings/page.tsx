"use client";

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Share2, 
  CreditCard, 
  Bell, 
  Shield, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SecureVault } from '@/components/Financial/SecureVault';

const tabs = [
  { id: 'integrations', name: 'Integrations', icon: Share2 },
  { id: 'billing', name: 'Billing & Payouts', icon: CreditCard },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security & Privacy', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiWalking, setIsAiWalking] = useState(false);
  const [walkthroughApp, setWalkthroughApp] = useState('');

  const startWalkthrough = (app: string) => {
    setWalkthroughApp(app);
    setIsAiWalking(true);
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
            Settings
          </h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg font-medium">
            Manage your EmpireLaunchAI configuration and account security.
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Navigation Sidebar / Horizontal Scroll on Mobile */}
        <aside className="flex md:flex-col overflow-x-auto no-scrollbar md:overflow-visible w-full md:w-64 shrink-0 gap-2 pb-2 md:pb-0 border-b md:border-b-0 border-slate-100 md:border-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <tab.icon className="w-5 h-5 shrink-0" />
              {tab.name}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'integrations' && (
            <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Search Bar for Apps */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search for apps you want to link (e.g. Etsy, TikTok, Shopify, Pinterest...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-[28px] bg-white border-2 border-slate-100 focus:border-blue-600 outline-none transition-all text-lg font-bold text-slate-900 shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => startWalkthrough(searchQuery)}
                    className="absolute right-3 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Link App
                  </button>
                )}
              </div>

              {/* Integrations Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold italic flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-400" /> Etsy Marketplace
                    </h3>
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-widest">
                      <AlertCircle className="w-4 h-4" /> Setup Required
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Connect your Etsy account to allow the AI to research trends and manage your shop listings automatically.
                  </p>

                  <button 
                    onClick={() => {
                      // Open Etsy in one tab
                      window.open('https://www.etsy.com/developers/register', '_blank');
                      // Open the Teacher in a side-popout
                      window.open('/setup-helper/etsy', 'EmpireAssistant', 'width=380,height=700,left=100,top=100');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 group"
                  >
                    Launch Guided Setup <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="p-8 rounded-[32px] border-2 border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Payouts</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Sales from Etsy and social media are routed directly to your bank account via Stripe.
                    </p>
                  </div>
                  <button className="flex items-center gap-2 text-blue-600 font-bold mt-6 hover:gap-3 transition-all">
                    View Stripe Dashboard <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Secure Vault Section */}
              <SecureVault />
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-20 text-center space-y-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <div className="bg-white p-4 rounded-3xl w-fit mx-auto shadow-sm">
                <CreditCard className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Billing is centralized</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                No external subscriptions needed. EmpireLaunchAI handles all tool fees in one monthly payment.
              </p>
            </div>
          )}

          {/* Other tabs placeholders */}
          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div className="p-20 text-center text-slate-400 italic">
              Configuration for {activeTab} will be available in the next release.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
