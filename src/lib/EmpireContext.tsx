"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'sale' | 'approval' | 'system';
  timestamp: Date;
  read: boolean;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'sale' | 'approval' | 'system' | 'success' | 'error';
}

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
  aiMode: 'co-pilot' | 'empire';
  setAiMode: (mode: 'co-pilot' | 'empire') => void;
  
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  notificationSettings: {
    sales: boolean;
    approvals: boolean;
  };
  updateNotificationSettings: (settings: { sales?: boolean; approvals?: boolean }) => void;
  isNotificationModalDismissed: boolean;
  dismissNotificationModal: () => void;
  
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export function EmpireProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeEmpireId, setActiveEmpireIdState] = useState('1');
  const [isPaid, setIsPaidState] = useState(false);
  const [aiMode, setAiModeState] = useState<'co-pilot' | 'empire'>('co-pilot');
  const [isOnboarded, setIsOnboardedState] = useState(false);
  const [isLinkingComplete, setIsLinkingCompleteState] = useState(false);
  const [isNotificationModalDismissed, setIsNotificationModalDismissedState] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeSetupPlatform, setActiveSetupPlatformState] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatformsState] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettingsState] = useState({ sales: true, approvals: true });
  const [empireNotes, setEmpireNotesState] = useState('');
  const [theme, setThemeState] = useState('classic-blue');
  const [language, setLanguageState] = useState('en-US');
  const [currency, setCurrencyState] = useState('USD');

  // HYDRATION SAFE INITIALIZATION
  useEffect(() => {
    try {
      const safeGet = (key: string) => {
        if (typeof window === 'undefined') return null;
        try {
          return localStorage.getItem(key);
        } catch(e) { return null; }
      };

      const savedEmpireId = safeGet('activeEmpireId');
      if (savedEmpireId) setActiveEmpireIdState(savedEmpireId);

      const savedIsPaid = safeGet('isPaid');
      if (savedIsPaid === 'true') setIsPaidState(true);

      const savedAiMode = safeGet('empireAiMode');
      if (savedAiMode === 'co-pilot' || savedAiMode === 'empire') {
        setAiModeState(savedAiMode as 'co-pilot' | 'empire');
      }

      const savedIsOnboarded = safeGet('isOnboarded');
      if (savedIsOnboarded === 'true') setIsOnboardedState(true);

      const savedIsLinkingComplete = safeGet('isLinkingComplete');
      if (savedIsLinkingComplete === 'true') setIsLinkingCompleteState(true);

      const savedDismissed = safeGet('isNotificationModalDismissed');
      if (savedDismissed === 'true') setIsNotificationModalDismissedState(true);

      const savedSetupPlatform = safeGet('activeSetupPlatform');
      if (savedSetupPlatform) setActiveSetupPlatformState(savedSetupPlatform);

      const savedPlatforms = safeGet('connectedPlatforms');
      if (savedPlatforms) {
        try {
          const parsed = JSON.parse(savedPlatforms);
          if (Array.isArray(parsed)) setConnectedPlatformsState(parsed);
        } catch(e) {}
      }

      const savedSettings = safeGet('empireNotificationSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setNotificationSettingsState(prev => ({ ...prev, ...parsed }));
        } catch(e) {}
      }

      const savedNotes = safeGet('empireNotes');
      if (savedNotes) setEmpireNotesState(savedNotes);

      const savedTheme = safeGet('empireTheme');
      if (savedTheme) {
        setThemeState(savedTheme);
      }

      const savedLang = safeGet('empireLanguage');
      if (savedLang) setLanguageState(savedLang);

      const savedCurr = safeGet('empireCurrency');
      if (savedCurr) setCurrencyState(savedCurr);

    } catch (e) {
      console.error("Critical failure loading state from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Set body class after initialization and theme change
  useEffect(() => {
    if (isInitialized && typeof document !== 'undefined') {
      document.body.className = `theme-${theme}`;
    }
  }, [isInitialized, theme]);

  const setActiveEmpireId = (id: string) => {
    setActiveEmpireIdState(id);
    if (typeof window !== 'undefined') localStorage.setItem('activeEmpireId', id);
  };

  const setIsPaid = (paid: boolean) => {
    setIsPaidState(paid);
    if (typeof window !== 'undefined') localStorage.setItem('isPaid', paid ? 'true' : 'false');
  };

  const setAiMode = (mode: 'co-pilot' | 'empire') => {
    setAiModeState(mode);
    if (typeof window !== 'undefined') localStorage.setItem('empireAiMode', mode);
  };

  const completeOnboarding = () => {
    setIsOnboardedState(true);
    if (typeof window !== 'undefined') localStorage.setItem('isOnboarded', 'true');
  };

  const completeLinkingPhase = () => {
    setIsLinkingCompleteState(true);
    if (typeof window !== 'undefined') localStorage.setItem('isLinkingComplete', 'true');
  };

  const startSetup = (platform: string) => {
    setActiveSetupPlatformState(platform);
    if (typeof window !== 'undefined') localStorage.setItem('activeSetupPlatform', platform);
  };

  const finishSetup = () => {
    setActiveSetupPlatformState(null);
    if (typeof window !== 'undefined') localStorage.removeItem('activeSetupPlatform');
  };

  const connectPlatform = (platform: string) => {
    const newPlatforms = [...new Set([...connectedPlatforms, platform])];
    setConnectedPlatformsState(newPlatforms);
    if (typeof window !== 'undefined') localStorage.setItem('connectedPlatforms', JSON.stringify(newPlatforms));
  };

  const setEmpireNotes = (notes: string) => {
    setEmpireNotesState(notes);
    if (typeof window !== 'undefined') localStorage.setItem('empireNotes', notes);
  };

  const addNote = (note: string) => {
    const newNotes = empireNotes ? `${empireNotes}\n\n• ${note}` : `• ${note}`;
    setEmpireNotes(newNotes);
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') localStorage.setItem('empireTheme', newTheme);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') localStorage.setItem('empireLanguage', lang);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') localStorage.setItem('empireCurrency', curr);
  };

  const updateNotificationSettings = (settings: { sales?: boolean; approvals?: boolean }) => {
    const newSettings = { ...notificationSettings, ...settings };
    setNotificationSettingsState(newSettings);
    if (typeof window !== 'undefined') localStorage.setItem('empireNotificationSettings', JSON.stringify(newSettings));
  };

  const dismissNotificationModal = () => {
    setIsNotificationModalDismissedState(true);
    if (typeof window !== 'undefined') localStorage.setItem('isNotificationModalDismissed', 'true');
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (isLinkingComplete && isInitialized) {
      const demoNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Sale!',
          message: 'Someone just purchased your "Digital Zen Planner" on Etsy. +$24.99',
          type: 'sale',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          title: 'Content Ready',
          message: '3 TikTok marketing videos are ready for your approval in the Review Queue.',
          type: 'approval',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false
        }
      ];
      setNotifications(demoNotifications);
    }
  }, [isLinkingComplete, isInitialized]);

  return (
    <EmpireContext.Provider value={{ 
      activeEmpireId, setActiveEmpireId,
      isOnboarded, isInitialized, completeOnboarding,
      activeSetupPlatform, startSetup, finishSetup,
      connectedPlatforms, connectPlatform,
      isLinkingComplete, completeLinkingPhase,
      empireNotes, setEmpireNotes, addNote,
      theme, setTheme,
      language, setLanguage,
      currency, setCurrency,
      isPaid, setIsPaid,
      aiMode, setAiMode,
      notifications, unreadCount, markAsRead, markAllAsRead,
      notificationSettings, updateNotificationSettings,
      isNotificationModalDismissed, dismissNotificationModal,
      toasts, addToast, removeToast
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
