"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Edit2, Check, X, Building2, Target, Compass, Users, Goal, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { empireService } from '@/lib/api-service';
import { useEmpire } from '@/lib/EmpireContext';

interface EmpireIdentityCardProps {
  empireData: any;
  onUpdate: () => void;
}

interface EditableField {
  key: string;
  label: string;
  icon: React.ElementType;
  value: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

export function EmpireIdentityCard({ empireData, onUpdate }: EmpireIdentityCardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const editValuesRef = useRef<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeEmpire } = useEmpire();

  const fields: EditableField[] = [
    { key: 'name', label: 'Business Name', icon: Building2, value: empireData?.title || '', type: 'text' },
    { key: 'niche', label: 'Niche', icon: Target, value: empireData?.description?.match(/Empire Niche:\s*(.*?)(?:\.|$)/)?.[1] || empireData?.niche || '', type: 'text' },
    { key: 'angle', label: 'Angle', icon: Compass, value: empireData?.description?.match(/Angle:\s*(.*?)(?:\.|$)/)?.[1] || empireData?.angle || '', type: 'text' },
    { key: 'targetCustomers', label: 'Target Customers', icon: Users, value: empireData?.targetCustomers || '', type: 'textarea' },
    { key: 'businessGoals', label: 'Business Goals', icon: Goal, value: empireData?.businessGoals || '', type: 'textarea' },
    { key: 'archetype', label: 'Archetype', icon: Cpu, value: empireData?.archetype || 'SELLER', type: 'select', options: ['SELLER', 'CONTENT_CREATOR'] },
  ];

  const startEditing = (field: EditableField) => {
    setError(null);
    setEditingField(field.key);
    setEditValues(prev => {
      const next = { ...prev, [field.key]: field.value };
      editValuesRef.current = next;
      return next;
    });
  };

  const updateEditValue = (fieldKey: string, value: string) => {
    setEditValues(prev => {
      const next = { ...prev, [fieldKey]: value };
      editValuesRef.current = next;
      return next;
    });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValues({});
    editValuesRef.current = {};
    setError(null);
  };

  // Stable save handler — uses refs so it never goes stale between renders
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  const handleSave = useCallback(async (fieldKey: string) => {
    const newValue = (editValuesRef.current[fieldKey] ?? '').trim();
    setError(null);
    setSaving(true);

    try {
      // Read empire ID from localStorage (persisted by dashboard on every fetch)
      let empireId = (typeof window !== 'undefined' && localStorage.getItem('empire_active_id')) || '';
      if (!empireId) {
        try {
          const latest = await empireService.getLatestEmpire();
          if (latest?.id) empireId = latest.id;
        } catch (e) { /* fall through */ }
      }
      if (!empireId) empireId = '1';

      // Save with single retry on failure
      let result = await empireService.updateEmpire(empireId, { [fieldKey]: newValue });
      if (!result.ok) {
        await new Promise(r => setTimeout(r, 500));
        result = await empireService.updateEmpire(empireId, { [fieldKey]: newValue });
      }

      if (result.ok) {
        // Update localStorage cache immediately so edits survive page reloads
        try {
          if (typeof window !== 'undefined') {
            const cached = JSON.parse(localStorage.getItem('empire_data_cache') || 'null');
            if (cached) {
              // Map frontend field keys to backend response fields
              const fieldMap: Record<string, string> = {
                name: 'title',
                targetCustomers: 'targetCustomers',
                businessGoals: 'businessGoals',
                archetype: 'archetype',
              };
              const mappedKey = fieldMap[fieldKey] || fieldKey;
              if (fieldKey === 'niche' || fieldKey === 'angle') {
                // Update the description field for niche/angle
                if (fieldKey === 'niche') {
                  cached.description = cached.description?.replace(/Empire Niche:\s*(.*?)(?:\.|$)/, `Empire Niche: ${newValue}.`) || `Empire Niche: ${newValue}.`;
                } else {
                  cached.description = cached.description?.replace(/Angle:\s*(.*?)(?:\.|$)/, `Angle: ${newValue}.`) || `Angle: ${newValue}.`;
                }
              } else {
                cached[mappedKey] = newValue;
              }
              localStorage.setItem('empire_data_cache', JSON.stringify(cached));
            }
          }
        } catch (e) { /* cache update failed — non-critical */ }
        
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setEditingField(null);
        setEditValues({});
        editValuesRef.current = {};
        onUpdateRef.current();
      } else {
        setError(`Save failed. HTTP ${result.status}: ${result.body || 'no body'}`);
      }
    } catch (e: any) {
      setError(`Network error: ${e.message || 'unknown'}`);
    } finally {
      setSaving(false);
    }
  }, []); // Empty deps — all dynamic values come from refs

  const handleKeyDown = (e: React.KeyboardEvent, fieldKey: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave(fieldKey);
    }
    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="bg-theme-surface border-2 border-theme rounded-[32px] p-6 md:p-8 space-y-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] -z-10" />
      
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Empire Identity</h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Onboarding Configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const isEditing = editingField === field.key;
          const currentValue = isEditing ? editValues[field.key] ?? '' : field.value;

          return (
            <div
              key={field.key}
              className={cn(
                "relative p-4 rounded-2xl border transition-all",
                isEditing
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-theme bg-theme-background/50 hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                    isEditing ? "bg-primary/20 text-primary" : "bg-slate-800/50 text-slate-400"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">
                      {field.label}
                    </p>
                    {isEditing ? (
                      field.type === 'select' ? (
                        <select
                          value={currentValue}
                          onChange={(e) => updateEditValue(field.key, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, field.key)}
                          className="w-full bg-theme-background border border-theme rounded-lg p-2 text-xs font-bold text-foreground outline-none focus:border-primary transition-colors"
                          autoFocus
                        >
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={currentValue}
                          onChange={(e) => updateEditValue(field.key, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, field.key)}
                          className="w-full bg-theme-background border border-theme rounded-lg p-2 text-xs font-bold text-foreground outline-none focus:border-primary transition-colors resize-none min-h-[60px]"
                          autoFocus
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => updateEditValue(field.key, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, field.key)}
                          className="w-full bg-theme-background border border-theme rounded-lg p-2 text-xs font-bold text-foreground outline-none focus:border-primary transition-colors"
                          autoFocus
                        />
                      )
                    ) : (
                      <p className="text-sm font-bold text-foreground truncate">
                        {field.value || <span className="text-slate-500 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(field.key)}
                        disabled={saving}
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                          saving ? "bg-slate-800 text-slate-500" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        )}
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-all"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(field)}
                      className="w-7 h-7 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                      title={`Edit ${field.label}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save indicator */}
      {saved && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Empire Identity Updated</span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
}