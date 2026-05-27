"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Zap, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { API_URL } from '@/lib/config';

const MOCK_THOUGHTS = [
  "Analyzing Etsy trends for 'digital journals'...",
  "Identifying high-velocity tags in digital marketing niche...",
  "Generating content blueprint for TikTok...",
  "Neural sync established with Etsy API...",
  "Optimizing listing for search visibility...",
  "Scanning Fiverr competitors for pricing arbitrage...",
  "Drafting 5 TikTok scripts based on #productivity trend...",
  "Scheduling social posts for peak engagement window...",
  "Processing customer review sentiment analysis...",
  "Calculating ROI projection for next 30 days..."
];

export const NeuralActivityFeed = ({ logs: initialLogs, status: initialStatus }: { logs?: string[], status?: string }) => {
  const [logs, setLogs] = useState<{ id: number; text: string; status: 'processing' | 'done' }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const socket = io(API_URL);
    const userId = '00000000-0000-0000-0000-000000000000'; // Real apps would use auth
    
    socket.on('connect', () => {
      console.log('Connected to Neural Pulse');
      socket.emit('subscribe', userId);
    });

    socket.on('ai-log', (data: { message: string }) => {
      setLogs(prev => {
        const nextLogs = [...prev, { id: Date.now(), text: data.message, status: 'processing' }];
        if (nextLogs.length > 1) {
          nextLogs[nextLogs.length - 2].status = 'done';
        }
        return nextLogs.slice(-10); // Keep more logs if they are real
      });
    });

    socket.on('job-started', (data: { goal: string }) => {
      setLogs(prev => [
        ...prev, 
        { id: Date.now(), text: `[SYSTEM] Goal Received: ${data.goal}`, status: 'done' }
      ].slice(-10));
    });

    socket.on('job-completed', (data: { resultSummary: string }) => {
      setLogs(prev => [
        ...prev, 
        { id: Date.now(), text: `[SYSTEM] Success: ${data.resultSummary}`, status: 'done' }
      ].slice(-10));
    });

    if (initialLogs && initialLogs.length > 0) {
      setLogs(initialLogs.map((text, i) => ({
        id: i,
        text,
        status: i === initialLogs.length - 1 ? 'processing' : 'done'
      })));
    } else {
      let logId = 0;
      const addLog = () => {
        const newThought = MOCK_THOUGHTS[Math.floor(Math.random() * MOCK_THOUGHTS.length)];
        setLogs(prev => {
          // If we have real logs coming in, maybe slow down mock logs or stop them
          const nextLogs = [...prev, { id: logId++, text: newThought, status: 'processing' }];
          if (nextLogs.length > 1) {
            nextLogs[nextLogs.length - 2].status = 'done';
          }
          return nextLogs.slice(-6);
        });
      };

      const interval = setInterval(addLog, 8000); // Slower mocks if idling
      addLog();
      
      return () => {
        clearInterval(interval);
        socket.disconnect();
      };
    }

    return () => {
      socket.disconnect();
    };
  }, [initialLogs]);

  return (
    <div className="bg-slate-900 rounded-[32px] p-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Cpu className="w-24 h-24 text-blue-500 animate-pulse" />
      </div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg tracking-tight">Neural Activity</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI Reasoning: Online</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          SECURE_V3.4
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs relative z-10 min-h-[180px]">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-3 py-1"
            >
              <div className="mt-0.5">
                {log.status === 'processing' ? (
                  <Zap className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className={log.status === 'processing' ? "text-blue-100" : "text-slate-400"}>
                  {log.text}
                </span>
                {log.status === 'processing' && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="inline-block w-1.5 h-3 bg-blue-400 ml-1 translate-y-0.5"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Cycles</span>
            <span className="text-white font-mono text-sm">1,242</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Stability</span>
            <span className="text-emerald-400 font-mono text-sm">99.9%</span>
          </div>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
          Expand Console
        </button>
      </div>
    </div>
  );
};
