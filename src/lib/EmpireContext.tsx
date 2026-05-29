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
  platformPermissions: Record<string, 'co-pilot' | 'empire'>;
  updatePlatformPermission: (platform: string, level: 'co-pilot' | 'empire') => void;
  autoSendRetention: boolean;
  setAutoSendRetention: (enabled: boolean) => void;

  // Notifications
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

  // Toast System
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'sale' | 'approval' | 'system' | 'success' | 'error';
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

  const [aiMode, setAiModeState] = useState<'co-pilot' | 'empire'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('empireAiMode') as 'co-pilot' | 'empire') || 'co-pilot';
    }
    return 'co-pilot';
  });

  const [platformPermissions, setPlatformPermissions] = useState<Record<string, 'co-pilot' | 'empire'>>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('platformPermissions') || '{}');
      } catch {
        return {};
      }
    }
    return {};
  });

  const updatePlatformPermission = (platform: string, level: 'co-pilot' | 'empire') => {
    setPlatformPermissions(prev => {
      const next = { ...prev, [platform]: level };
      if (typeof window !== 'undefined') {
        localStorage.setItem('platformPermissions', JSON.stringify(next));
      }
      return next;
    });
  };

  const setAiMode = (mode: 'co-pilot' | 'empire') => {
    setAiModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireAiMode', mode);
    }
  };

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

  const [isNotificationModalDismissed, setIsNotificationModalDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isNotificationModalDismissed') === 'true';
    }
    return false;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const dismissNotificationModal = () => {
    setIsNotificationModalDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isNotificationModalDismissed', 'true');
    }
  };

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

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('empireNotificationSettings');
      return saved ? JSON.parse(saved) : { sales: true, approvals: true };
    }
    return { sales: true, approvals: true };
  });

  const updateNotificationSettings = (settings: { sales?: boolean; approvals?: boolean }) => {
    const newSettings = { ...notificationSettings, ...settings };
    setNotificationSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireNotificationSettings', JSON.stringify(newSettings));
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate incoming notifications for demo purposes
  useEffect(() => {
    if (isLinkingComplete && isInitialized) {
      const demoNotifications: Notification[] = [
        {
          id: '1',
          title: 'New Sale!',
          message: 'Someone just ordered your "Digital Zen Planner" on Etsy. +$24.99',
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
    if (!platform) return;
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
      return localStorage.getItem('empireTheme') || 'empire-cyan';
    }
    return 'empire-cyan';
  });

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireTheme', newTheme);
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

  const [autoSendRetention, setAutoSendRetentionState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('autoSendRetention') === 'true';
    }
    return false;
  });

  const setAutoSendRetention = (enabled: boolean) => {
    setAutoSendRetentionState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoSendRetention', enabled ? 'true' : 'false');
    }
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
      setIsPaid,
      aiMode,
      setAiMode,
      platformPermissions,
      updatePlatformPermission,
      autoSendRetention,
      setAutoSendRetention,

      // Notifications
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      notificationSettings,
      updateNotificationSettings,
      isNotificationModalDismissed,
      dismissNotificationModal,

      toasts,
      addToast,
      removeToast
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
