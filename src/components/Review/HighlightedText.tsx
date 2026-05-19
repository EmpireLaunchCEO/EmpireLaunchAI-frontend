"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HighlightedTextProps {
  text: string;
  isNew?: boolean;
}

export function HighlightedText({ text, isNew = false }: HighlightedTextProps) {
  const [showHighlight, setShowHighlight] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setShowHighlight(true);
      const timer = setTimeout(() => setShowHighlight(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [text, isNew]);

  return (
    <div className="relative">
      <AnimatePresence>
        {showHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-500/10 rounded-sm pointer-events-none"
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{text}</span>
    </div>
  );
}
