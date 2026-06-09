"use client";

import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Save, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NeuralNotes() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-neural-notes');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-neural-notes', String(newState));
  };
  const [notes, setNotes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neural_notes');
      return saved ? JSON.parse(saved) : ["Initial Strategy: Focus on Etsy high-velocity keywords for Q4."];
    }
    return ["Initial Strategy: Focus on Etsy high-velocity keywords for Q4."];
  });
  const [newNote, setNewNote] = useState('');

  const saveNotes = (updatedNotes: string[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('neural_notes', JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    saveNotes([newNote, ...notes]);
    setNewNote('');
  };

  const deleteNote = (index: number) => {
    saveNotes(notes.filter((_, i) => i !== index));
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <StickyNote className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Neural Notes</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <section className="bg-theme-surface rounded-[40px] p-8 border border-theme shadow-xl relative">
      {/* Minimize Toggle */}
      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <StickyNote className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground uppercase italic tracking-tight">Neural Notes</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Strategy & Ideas Vault</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
            placeholder="Record a new strategy insight..."
            className="flex-1 bg-theme-background border border-theme rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            onClick={addNote}
            className="w-14 h-14 rounded-2xl bg-primary text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {notes.map((note, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 bg-theme-background border border-theme rounded-3xl relative group hover:border-primary/30 transition-colors"
              >
                <p className="text-sm text-slate-300 leading-relaxed italic">{note}</p>
                <button 
                  onClick={() => deleteNote(idx)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
