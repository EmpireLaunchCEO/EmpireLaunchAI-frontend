"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface EmpireContextType {
  activeEmpireId: string;
  setActiveEmpireId: (id: string) => void;
  isOnboarded: boolean;
  isInitialized: boolean;
  completeOnboarding: () => void;
  activeSetupPlatform: string | null;
  startSetup: (platform: string) => void;
  finishSetup: () => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export function EmpireProvider({ children }: { children: React.ReactNode }) {
  const [activeEmpireId, setActiveEmpireId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeEmpireId') || '1';
    }
    return '1';
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isOnboarded') === 'true';
    }
    return false;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSetupPlatform, setActiveSetupPlatform] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeSetupPlatform');
    }
    return null;
  });

  // Keep initialization for things that need to happen after mount
  useEffect(() => {
    setIsInitialized(true);
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
      isInitialized,
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
