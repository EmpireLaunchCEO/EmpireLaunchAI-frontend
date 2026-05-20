"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface EmpireContextType {
  activeEmpireId: string;
  setActiveEmpireId: (id: string) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export function EmpireProvider({ children }: { children: React.ReactNode }) {
  const [activeEmpireId, setActiveEmpireId] = useState('1');
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedEmpireId = localStorage.getItem('activeEmpireId');
    const savedOnboarded = localStorage.getItem('isOnboarded');

    if (savedEmpireId) setActiveEmpireId(savedEmpireId);
    if (savedOnboarded === 'true') setIsOnboarded(true);
  }, []);

  const handleSetActiveEmpireId = (id: string) => {
    setActiveEmpireId(id);
    localStorage.setItem('activeEmpireId', id);
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    localStorage.setItem('isOnboarded', 'true');
  };

  return (
    <EmpireContext.Provider value={{ 
      activeEmpireId, 
      setActiveEmpireId: handleSetActiveEmpireId,
      isOnboarded,
      completeOnboarding
    }}>
      {children}
    </EmpireContext.Provider>
  );
}

export function useEmpire() {
  const context = useContext(EmpireContext);
  if (context === undefined) {
    throw new Error('useEmpire must be used within an EmpireProvider');
  }
  return context;
}
