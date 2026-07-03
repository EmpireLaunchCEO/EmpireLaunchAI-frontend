"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';

interface AuditStatement {
  id: string;
  month: number;
  year: number;
  totalRevenue: number;
  aiAttributedRevenue: number;
  successShareDue: number;
  lifetimeSurchargesPaid: number;
  contentCreated: number;
  activeCampaigns: number;
  milestoneHit: number;
  generatedAt: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthlyAuditStatements() {
  const [statements, setStatements] = useState<AuditStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatements();
  }, []);

  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('empire_userId');
    }
    return null;
  };

  const fetchStatements = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const res = await fetch(`${API_URL}/api/audit/statements`, {
        headers: userId ? { 'x-user-id': userId } : {}
      });
      if (!res.ok) {
        if (res.status === 401) {
          setError('Please log in to view audit statements.');
        } else {
          setError('Unable to load audit statements.');
        }
        setStatements([]);
        return;
      }
      const data = await res.json();
      setStatements(data.statements || []);
    } catch (e) {
      console.warn('[AuditStatements] Fetch failed:', e);
      setError('Unable to connect to the audit service.');
      setStatements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (statement: AuditStatement) => {
    setDownloadingId(statement.id);
    try {
      const userId = getUserId();
      const res = await fetch(
        `${API_URL}/api/audit/statement/download?statementId=${statement.id}`,
        {
          headers: userId ? { 'x-user-id': userId } : {}
        }
      );
      if (!res.ok) throw new Error('Download failed');
      
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `empire-audit-${MONTH_NAMES[statement.month - 1].toLowerCase()}-${statement.year}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('[AuditStatements] Download failed:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic">
            Monthly Audit Statements
          </h3>
          <p className="text-[10px] text-muted-foreground font-medium mt-1">
            Success-Share transparency ledger — 12-month history
          </p>
        </div>
        <button
          onClick={fetchStatements}
          disabled={loading}
          className={cn(
            'px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
            loading
              ? 'bg-theme-surface text-muted-foreground cursor-not-allowed'
              : 'bg-theme-background border border-theme text-foreground hover:border-primary/50'
          )}
        >
          <Loader2 className={cn('w-3 h-3', loading && 'animate-spin')} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Loading statements...
          </span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-bold text-amber-400">{error}</p>
        </div>
      ) : statements.length === 0 ? (
        <div className="p-6 rounded-2xl bg-theme-background border border-theme text-center">
          <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            No statements yet
          </p>
          <p className="text-[9px] text-muted-foreground/50 mt-1">
            Statements are generated monthly as revenue is tracked.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {statements.map((statement, index) => (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-2xl bg-theme-background border border-theme hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Month + Key Stats */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-foreground uppercase tracking-tight">
                      {MONTH_NAMES[statement.month - 1]} {statement.year}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                        <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                        Rev: {formatCurrency(statement.totalRevenue)}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                        <TrendingUp className="w-2.5 h-2.5 text-primary" />
                        AI: {formatCurrency(statement.aiAttributedRevenue)}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                        <BarChart3 className="w-2.5 h-2.5 text-cyan-400" />
                        {statement.contentCreated} posts
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                        <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                        4%: {formatCurrency(statement.successShareDue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Download Button */}
                <button
                  onClick={() => handleDownload(statement)}
                  disabled={downloadingId === statement.id}
                  className={cn(
                    'px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 shrink-0',
                    downloadingId === statement.id
                      ? 'bg-theme-surface text-muted-foreground cursor-not-allowed'
                      : 'bg-foreground text-background hover:bg-foreground/90 active:scale-95'
                  )}
                >
                  {downloadingId === statement.id ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      ...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}