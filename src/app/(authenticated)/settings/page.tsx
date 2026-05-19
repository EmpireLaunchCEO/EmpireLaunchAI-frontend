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
  AlertCircle
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

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            Settings
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Manage your EmpireLaunchAI configuration and account security.
          </p>
        </div>
      </header>

      <div className="flex gap-12">
        {/* Navigation Sidebar */}
        <aside className="w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          {activeTab === 'integrations' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Integrations Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6">
                  <h3 className="text-xl font-bold">Integration Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Etsy</span>
                      <span className="flex items-center gap-1.5 text-green-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Instagram</span>
                      <span className="flex items-center gap-1.5 text-green-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">TikTok</span>
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                        <AlertCircle className="w-4 h-4" /> Setup Required
                      </span>
                    </div>
                  </div>
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
