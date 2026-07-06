"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, SkipForward, Sparkles, Volume2, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SongSuggestion {
  id: string;
  title: string;
  artist: string;
  mood: string;
  duration: string;
  bpm: number;
}

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-400/30' },
  { id: 'dramatic', label: 'Dramatic', emoji: '🎭', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'upbeat', label: 'Upbeat', emoji: '🎵', color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/30' },
];

// AI-generated song suggestions per mood
const SONG_DATABASE: Record<string, SongSuggestion[]> = {
  happy: [
    { id: 'happy1', title: 'Sunshine Day', artist: 'AI Composer', mood: 'happy', duration: '2:30', bpm: 120 },
    { id: 'happy2', title: 'Good Vibes', artist: 'AI Composer', mood: 'happy', duration: '3:00', bpm: 110 },
    { id: 'happy3', title: 'Joyful Morning', artist: 'AI Composer', mood: 'happy', duration: '2:45', bpm: 115 },
    { id: 'happy4', title: 'Smile Wave', artist: 'AI Composer', mood: 'happy', duration: '2:15', bpm: 125 },
  ],
  sad: [
    { id: 'sad1', title: 'Gentle Rain', artist: 'AI Composer', mood: 'sad', duration: '3:15', bpm: 70 },
    { id: 'sad2', title: 'Fading Light', artist: 'AI Composer', mood: 'sad', duration: '2:50', bpm: 65 },
    { id: 'sad3', title: 'Quiet Reflection', artist: 'AI Composer', mood: 'sad', duration: '3:30', bpm: 60 },
  ],
  energetic: [
    { id: 'energy1', title: 'Power Surge', artist: 'AI Composer', mood: 'energetic', duration: '2:20', bpm: 140 },
    { id: 'energy2', title: 'Thunder Strike', artist: 'AI Composer', mood: 'energetic', duration: '2:40', bpm: 150 },
    { id: 'energy3', title: 'Blaze Through', artist: 'AI Composer', mood: 'energetic', duration: '2:10', bpm: 145 },
  ],
  calm: [
    { id: 'calm1', title: 'Ocean Breeze', artist: 'AI Composer', mood: 'calm', duration: '4:00', bpm: 80 },
    { id: 'calm2', title: 'Soft Piano', artist: 'AI Composer', mood: 'calm', duration: '3:20', bpm: 75 },
    { id: 'calm3', title: 'Twilight Glow', artist: 'AI Composer', mood: 'calm', duration: '3:45', bpm: 70 },
  ],
  dramatic: [
    { id: 'drama1', title: 'Epic Journey', artist: 'AI Composer', mood: 'dramatic', duration: '3:10', bpm: 130 },
    { id: 'drama2', title: 'Shadow Realm', artist: 'AI Composer', mood: 'dramatic', duration: '2:55', bpm: 135 },
    { id: 'drama3', title: 'Climax Rising', artist: 'AI Composer', mood: 'dramatic', duration: '3:40', bpm: 125 },
  ],
  upbeat: [
    { id: 'upbeat1', title: 'Bouncy Beats', artist: 'AI Composer', mood: 'upbeat', duration: '2:35', bpm: 128 },
    { id: 'upbeat2', title: 'Party Pop', artist: 'AI Composer', mood: 'upbeat', duration: '2:50', bpm: 132 },
    { id: 'upbeat3', title: 'Groove Time', artist: 'AI Composer', mood: 'upbeat', duration: '3:05', bpm: 120 },
  ],
};

interface MusicSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (song: SongSuggestion | null) => void;
  platformName?: string;
}

export function MusicSelectionModal({ isOpen, onClose, onSelect, platformName }: MusicSelectionModalProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<SongSuggestion | null>(null);

  const songs = selectedMood ? SONG_DATABASE[selectedMood] || [] : [];

  const handleConfirm = () => {
    onSelect(selectedSong);
    setSelectedMood(null);
    setSelectedSong(null);
    onClose();
  };

  const handleSkip = () => {
    onSelect(null);
    setSelectedMood(null);
    setSelectedSong(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedMood(null);
    setSelectedSong(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-theme-surface border-2 border-theme rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-theme/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Background Music</h2>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    {platformName ? `Add music to your ${platformName} video` : 'Enhance your video with AI-suggested tracks'}
                  </p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-theme-background border border-theme flex items-center justify-center hover:opacity-80">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Step 1: Choose Mood */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest">1. Choose a Mood</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => {
                        setSelectedMood(mood.id);
                        setSelectedSong(null);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all",
                        selectedMood === mood.id
                          ? mood.bg + ' border-primary'
                          : 'bg-theme-background border-theme hover:border-primary/50'
                      )}
                    >
                      <span className="text-xl">{mood.emoji}</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tight",
                        selectedMood === mood.id ? mood.color : 'text-foreground'
                      )}>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Pick a Song */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest">2. Pick a Track</h3>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {songs.map((song) => (
                      <button
                        key={song.id}
                        onClick={() => setSelectedSong(song)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left",
                          selectedSong?.id === song.id
                            ? 'border-primary bg-primary/10'
                            : 'border-theme bg-theme-background hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          selectedSong?.id === song.id ? 'bg-primary text-slate-950' : 'bg-slate-800 text-muted-foreground'
                        )}>
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-xs font-black truncate",
                            selectedSong?.id === song.id ? 'text-primary' : 'text-foreground'
                          )}>{song.title}</p>
                          <p className="text-[9px] font-bold text-muted-foreground">{song.artist} · {song.duration} · {song.bpm} BPM</p>
                        </div>
                        {selectedSong?.id === song.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-slate-950" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 bg-theme-background border-2 border-theme rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:opacity-80 transition-all flex items-center justify-center gap-2"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Skip Music
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedSong}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    selectedSong
                      ? 'bg-primary text-slate-950 shadow-xl shadow-primary/20 hover:opacity-90'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  )}
                >
                  <Music className="w-3.5 h-3.5" />
                  Add to Video
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
