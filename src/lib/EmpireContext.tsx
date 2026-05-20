"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface EmpireContextType {
  activeEmpireId: string;
  setActiveEmpireId: (id: string) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
  activeSetupPlatform: string | null;
  startSetup: (platform: string) => void;
  finishSetup: () => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export function EmpireProvider({ children }: { children: React.ReactNode }) {
  const [activeEmpireId, setActiveEmpireId] = useState('1');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeSetupPlatform, setActiveSetupPlatform] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedEmpireId = localStorage.getItem('activeEmpireId');
    const savedOnboarded = localStorage.getItem('isOnboarded');
    const savedSetup = localStorage.getItem('activeSetupPlatform');

    if (savedEmpireId) setActiveEmpireId(savedEmpireId);
    if (savedOnboarded === 'true') setIsOnboarded(true);
    if (savedSetup) setActiveSetupPlatform(savedSetup);
  }, []);

  const handleSetActiveEmpireId = (id: string) => {
    setActiveEmpireId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeEmpireId', id);
    }
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOnboarded', 'true');
    }
  };

  const startSetup = (platform: string) => {
    setActiveSetupPlatform(platform);
    localStorage.setItem('activeSetupPlatform', platform);
  };

  const finishSetup = () => {
    setActiveSetupPlatform(null);
    localStorage.removeItem('activeSetupPlatform');
  };

  return (
    <EmpireContext.Provider value={{ 
      activeEmpireId, 
      setActiveEmpireId: handleSetActiveEmpireId,
      isOnboarded,
      completeOnboarding,
      activeSetupPlatform,
      startSetup,
      finishSetup
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
