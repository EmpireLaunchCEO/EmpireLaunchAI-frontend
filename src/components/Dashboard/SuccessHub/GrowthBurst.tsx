"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars } from 'lucide-react';

export const GrowthBurst = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        color: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)]
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1, 0.5], 
              x: p.x, 
              y: p.y, 
              opacity: 0 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        ))}
        {active && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
            className="absolute"
          >
            <Stars className="w-12 h-12 text-amber-400 fill-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
