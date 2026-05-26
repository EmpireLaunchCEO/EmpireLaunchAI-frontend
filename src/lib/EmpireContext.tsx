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
  connectedPlatforms: string[];
  connectPlatform: (platform: string) => void;
  isLinkingComplete: boolean;
  completeLinkingPhase: () => void;
  empireNotes: string;
  setEmpireNotes: (notes: string) => void;
  addNote: (note: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export function EmpireProvider({ children }: { children: React.ReactNode }) {
  const [activeEmpireId, setActiveEmpireId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeEmpireId') || '1';
    }
    return '1';
  });
  const [isPaid, setIsPaidState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isPaid') === 'true';
    }
    return false;
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isOnboarded') === 'true';
    }
    return false;
  });

  const setIsPaid = (paid: boolean) => {
    setIsPaidState(paid);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPaid', paid ? 'true' : 'false');
    }
  };
  const [isLinkingComplete, setIsLinkingComplete] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLinkingComplete') === 'true';
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
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('connectedPlatforms') || '[]');
      } catch {
        return [];
      }
    }
    return [];
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

  const completeLinkingPhase = () => {
    setIsLinkingComplete(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLinkingComplete', 'true');
    }
  };

  const startSetup = (platform: string) => {
    setActiveSetupPlatform(platform);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeSetupPlatform', platform);
    }
  };

  const finishSetup = () => {
    setActiveSetupPlatform(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeSetupPlatform');
    }
  };

  const connectPlatform = (platform: string) => {
    const newPlatforms = [...new Set([...connectedPlatforms, platform])];
    setConnectedPlatforms(newPlatforms);
    if (typeof window !== 'undefined') {
      localStorage.setItem('connectedPlatforms', JSON.stringify(newPlatforms));
    }
  };

  const [empireNotes, setEmpireNotesState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('empireNotes') || '';
    }
    return '';
  });

  const setEmpireNotes = (notes: string) => {
    setEmpireNotesState(notes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireNotes', notes);
    }
  };

  const addNote = (note: string) => {
    const newNotes = empireNotes ? `${empireNotes}\n\n• ${note}` : `• ${note}`;
    setEmpireNotes(newNotes);
  };

  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('empireTheme') || 'classic-blue';
    }
    return 'classic-blue';
  });

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireTheme', newTheme);
      // Apply theme class to document body
      document.body.className = `theme-${newTheme}`;
    }
  };

  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('empireLanguage') || 'en-US';
    }
    return 'en-US';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireLanguage', lang);
    }
  };

  const [currency, setCurrencyState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('empireCurrency') || 'USD';
    }
    return 'USD';
  });

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireCurrency', curr);
    }
  };

  // Sync theme class on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = `theme-${theme}`;
    }
  }, [theme]);

  return (
    <EmpireContext.Provider value={{ 
      activeEmpireId, 
      setActiveEmpireId: handleSetActiveEmpireId,
      isOnboarded,
      isInitialized,
      completeOnboarding,
      activeSetupPlatform,
      startSetup,
      finishSetup,
      connectedPlatforms,
      connectPlatform,
      isLinkingComplete,
      completeLinkingPhase,
      empireNotes,
      setEmpireNotes,
      addNote,
      theme,
      setTheme,
      language,
      setLanguage,
      currency,
      setCurrency,
      isPaid,
      setIsPaid
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
