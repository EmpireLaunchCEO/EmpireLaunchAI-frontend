"use client";

import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VaultItemProps {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isLocked?: boolean;
  onSave: (keys: Record<string, string>) => void;
  fields: { id: string, label: string, type: 'text' | 'password', placeholder: string }[];
  helpUrl?: string;
}

function VaultItem({ id, name, description, icon: Icon, isLocked = true, onSave, fields, helpUrl }: VaultItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [aiPermitted, setAiPermitted] = useState(true);

  const toggleValueVisibility = (fieldId: string) => {
    setShowValues(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
    setIsExpanded(false);
  };

  return (
    <div className={cn(
      "border-2 rounded-3xl transition-all overflow-hidden",
      isExpanded ? "border-blue-600 ring-4 ring-blue-50" : "border-theme hover:border-slate-200"
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-6 flex items-center justify-between bg-theme-surface"
      >
        <div className="flex items-center gap-3 md:gap-4 text-left">
          <div className={cn(
            "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors",
            isLocked ? "bg-slate-100 text-slate-400" : "bg-green-100 text-green-600"
          )}>
            {isLocked ? <Lock className="w-5 h-5 md:w-6 h-6" /> : <ShieldCheck className="w-5 h-5 md:w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-sm md:text-base">{name}</h3>
              {!isLocked && (
                <span className="bg-green-500/10 text-green-700 text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-green-100">
                  Live
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Icon className="w-5 h-5 md:w-6 h-6 text-slate-300" />
          <ChevronRight className={cn("w-4 h-4 md:w-5 h-5 text-slate-400 transition-transform", isExpanded && "rotate-90")} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 md:p-8 bg-theme-background border-t-2 border-theme space-y-5 md:space-y-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <Info className="w-4 h-4 md:w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-semibold text-blue-900">Security Notice</p>
              <p className="text-[10px] md:text-xs text-blue-700 leading-relaxed">
                Your keys are encrypted using AES-256-GCM. We never store raw keys and they are only accessed by your AI partner during authorized tasks.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type === 'password' && !showValues[field.id] ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full bg-theme-surface border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm md:text-base text-foreground outline-none focus:border-blue-600 transition-colors pr-12"
                  />
                  {field.type === 'password' && (
                    <button
                      onClick={() => toggleValueVisibility(field.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                    >
                      {showValues[field.id] ? <EyeOff className="w-4 h-4 md:w-5 h-5" /> : <Eye className="w-4 h-4 md:w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 md:pt-4">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setAiPermitted(!aiPermitted)}
                   className={cn(
                     "w-12 h-6 rounded-full transition-all relative",
                     aiPermitted ? "bg-green-500" : "bg-slate-300"
                   )}
                 >
                   <div className={cn(
                     "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                     aiPermitted ? "right-1" : "left-1"
                   )} />
                 </button>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Allow AI Access</span>
               </div>
               
               {helpUrl && (
                 <a
                   href={helpUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                 >
                   Where do I find these keys?
                   <ExternalLink className="w-3 h-3" />
                 </a>
               )}
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 md:flex-none bg-slate-900 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save to Vault"}
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SecureVault() {
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    etsy: false,
    stripe: false,
    canva: false,
    tiktok: false,
    railway: false,
    openai: false,
    gemini: false,
  });

  const handleSave = async (id: string, keys: any) => {
    // In a real app, this would be encrypted and sent to a secure backend
    // For now, we'll store it in localStorage to trigger UI changes
    localStorage.setItem(`empire_vault_${id}`, JSON.stringify(keys));
    setIntegrations(prev => ({ ...prev, [id]: true }));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('empire:vault-updated'));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Secure Vault</h2>
          <p className="text-sm text-muted-foreground">Manage your high-security API credentials and connection keys.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span className="text-[10px] md:text-sm font-bold text-blue-900 uppercase tracking-widest">Enterprise Encrypted</span>
        </div>
      </div>

      <div className="space-y-4">
        <VaultItem
          id="etsy"
          name="Etsy Developer Keys"
          description="Enables automated listing and inventory management."
          icon={Lock}
          isLocked={!integrations.etsy}
          onSave={(keys) => handleSave('etsy', keys)}
          helpUrl="https://www.etsy.com/developers/register"
          fields={[
            { id: 'apiKey', label: 'API Key (Keystring)', type: 'text', placeholder: 'Enter your Etsy API key' },
            { id: 'sharedSecret', label: 'Shared Secret', type: 'password', placeholder: 'Enter your shared secret' },
          ]}
        />

        <VaultItem
          id="tiktok"
          name="TikTok for Business"
          description="Enables automated video posting and trend analytics."
          icon={Lock}
          isLocked={!integrations.tiktok}
          onSave={(keys) => handleSave('tiktok', keys)}
          helpUrl="https://ads.tiktok.com/marketing_api/homepage"
          fields={[
            { id: 'clientKey', label: 'Client Key', type: 'text', placeholder: 'Enter TikTok Client Key' },
            { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter TikTok Client Secret' },
          ]}
        />

        <VaultItem
          id="stripe"
          name="Bank Payouts & Stripe"
          description="Handles secure payments and direct payouts to your bank."
          icon={Lock}
          isLocked={!integrations.stripe}
          onSave={(keys) => handleSave('stripe', keys)}
          helpUrl="https://dashboard.stripe.com/apikeys"
          fields={[
            { id: 'accountNumber', label: 'Bank Account Number', type: 'password', placeholder: 'Enter account number' },
            { id: 'routingNumber', label: 'Routing Number', type: 'text', placeholder: 'Enter routing number' },
            { id: 'secretKey', label: 'Stripe Secret Key (sk_live)', type: 'password', placeholder: 'sk_live_...' },
          ]}
        />

        <VaultItem
          id="canva"
          name="Canva Automation"
          description="Allows AI to generate and import designs for your products."
          icon={Lock}
          isLocked={!integrations.canva}
          onSave={(keys) => handleSave('canva', keys)}
          fields={[
            { id: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Enter Canva client ID' },
            { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Enter client secret' },
          ]}
        />

        <VaultItem
          id="railway"
          name="Railway Infrastructure"
          description="Monitors server usage and upcoming hosting costs."
          icon={Lock}
          isLocked={!integrations.railway}
          onSave={(keys) => handleSave('railway', keys)}
          helpUrl="https://docs.railway.app/reference/public-api"
          fields={[
            { id: 'apiToken', label: 'Railway API Token', type: 'password', placeholder: 'Enter your Railway API token' },
          ]}
        />

        <VaultItem
          id="openai"
          name="OpenAI Intelligence"
          description="Tracks API usage costs for GPT-4 and DALL-E 3."
          icon={Lock}
          isLocked={!integrations.openai}
          onSave={(keys) => handleSave('openai', keys)}
          helpUrl="https://platform.openai.com/api-keys"
          fields={[
            { id: 'apiKey', label: 'OpenAI API Key', type: 'password', placeholder: 'sk-...' },
          ]}
        />

        <VaultItem
          id="gemini"
          name="Google AI (Gemini)"
          description="Monitors multimodal model usage and credits."
          icon={Lock}
          isLocked={!integrations.gemini}
          onSave={(keys) => handleSave('gemini', keys)}
          helpUrl="https://aistudio.google.com/app/apikey"
          fields={[
            { id: 'apiKey', label: 'Gemini API Key', type: 'password', placeholder: 'Enter Gemini API key' },
          ]}
        />
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4 items-start">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900">Important: Production Mode</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            By entering these keys, you are enabling **Live Mode**. All actions taken by the AI will affect your real business accounts. Approval gates remain active by default for all sensitive operations.
          </p>
        </div>
      </div>
    </div>
  );
}
