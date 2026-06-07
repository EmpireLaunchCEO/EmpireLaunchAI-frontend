"use client";

import React, { useState } from 'react';
import { StickyNote, Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NeuralNotes() {
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

  return (
    <section className="bg-theme-surface rounded-[40px] p-8 border border-theme shadow-xl">
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
