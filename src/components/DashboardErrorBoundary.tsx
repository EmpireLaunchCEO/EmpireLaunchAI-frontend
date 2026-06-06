"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Crash Caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-8 bg-slate-900 p-12 rounded-[48px] border border-red-500/20 shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white uppercase italic">Neural Link Failure</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                A temporary error occurred while rendering your Command Center. This is often caused by a sync timeout or a visual rendering mismatch.
              </p>
              <div className="p-4 bg-black/40 rounded-2xl font-mono text-[10px] text-red-400 overflow-hidden text-left border border-white/5">
                {this.state.error?.message || "Unknown Runtime Exception"}
              </div>
            </div>
            <button
              onClick={() => {
                  window.location.href = '/dashboard';
              }}
              className="w-full py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reconnect to Center
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
