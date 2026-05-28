"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Stars, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';

interface ConversationalInputProps {
  onExecute?: (value: string) => Promise<void>;
  tip?: string;
}

export function ConversationalInput({ onExecute, tip }: ConversationalInputProps) {
  const [value, setValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { addNote } = useEmpire();

  const handleVoiceCommand = useCallback((text: string) => {
    const query = text.toLowerCase().trim();
    
    if (query.startsWith('note') || query.startsWith('notes')) {
      // Extract the note content
      const noteContent = text.replace(/^(note|notes)\s*/i, '');
      if (noteContent) {
        addNote(noteContent);
        // Show a brief visual confirmation?
        return true;
      }
    } else if (query.startsWith('ai')) {
      const aiQuery = text.replace(/^ai\s*/i, '');
      if (aiQuery) {
        setValue(aiQuery);
        // Automatically submit? 
        return false; // Let user review before send
      }
    }
    return false;
  }, [addNote]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const handled = handleVoiceCommand(transcript);
      if (!handled) {
        setValue(prev => prev ? `${prev} ${transcript}` : transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    setIsProcessing(true);
    if (onExecute) {
      await onExecute(value);
    } else {
      // Fallback/Simulate AI processing if no onExecute provided
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setIsProcessing(false);
    setValue('');
  };

  return (
    <div className="fixed bottom-24 lg:bottom-8 left-4 lg:left-80 right-4 lg:right-8 flex flex-col items-center gap-4 z-[40]">
      {tip && !isProcessing && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-theme shadow-sm"
        >
          <p className="text-[10px] font-bold text-theme-background0 uppercase tracking-wider">
            Tip: <span className="text-primary normal-case">{tip}</span>
          </p>
        </motion.div>
      )}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-theme-surface rounded-2xl shadow-2xl border border-theme p-2 flex items-center gap-2 pointer-events-auto"
      >
        <div className="pl-4">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Stars className="w-5 h-5 text-primary animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Stars className="w-5 h-5 text-slate-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask AI to research trends, create listings, or schedule posts..."}
          className={cn(
            "flex-1 py-3 px-2 outline-none text-slate-700 placeholder:text-slate-400 font-medium transition-all",
            isListening ? "placeholder:text-primary animate-pulse" : ""
          )}
          disabled={isProcessing}
        />
        
        <button
          type="button"
          onClick={toggleListening}
          className={cn(
            "p-3 rounded-xl transition-all",
            isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-theme-background0 hover:bg-slate-200"
          )}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          type="submit"
          disabled={!value.trim() || isProcessing}
          className="bg-primary text-white p-3 rounded-xl hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
