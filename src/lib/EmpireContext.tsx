"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';
import { empireService } from '@/lib/api-service';

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
  isHandoverComplete: boolean;
  isInitialized: boolean;
  completeOnboarding: () => void;
  setHandoverComplete: (complete: boolean) => void;
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
  isProtocolAccepted: boolean;
  acceptProtocols: () => void;
  isDashboardLoaded: boolean;
  setDashboardLoaded: (loaded: boolean) => void;
  userEmpires: any[];
  setUserEmpires: (empires: any[]) => void;
  activeEmpire: any | null;
  setActiveEmpire: (empire: any) => void;
  slotStatus: Record<number, boolean>;
  unlockSlot: (index: number) => void;

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
  const [activeEmpireId, setActiveEmpireId] = useState('1');
  const [platformsByEmpire, setPlatformsByEmpire] = useState<Record<string, string[]>>({});
  const [notesByEmpire, setNotesByEmpire] = useState<Record<string, string>>({});
  const [linkingCompleteByEmpire, setLinkingCompleteByEmpire] = useState<Record<string, boolean>>({});
  const [onboardedByEmpire, setOnboardedByEmpire] = useState<Record<string, boolean>>({});
  const [isPaid, setIsPaidState] = useState(false);
  const [aiMode, setAiModeState] = useState<'co-pilot' | 'empire'>('co-pilot');
  const [platformPermissions, setPlatformPermissions] = useState<Record<string, 'co-pilot' | 'empire'>>({});
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isHandoverComplete, setIsHandoverComplete] = useState(false);
  const [isLinkingComplete, setIsLinkingComplete] = useState(false);
  const [isNotificationModalDismissed, setIsNotificationModalDismissed] = useState(false);
  const [empireNotes, setEmpireNotesState] = useState('');
  const [theme, setThemeState] = useState('blue');
  const [language, setLanguageState] = useState('en-US');
  const [currency, setCurrencyState] = useState('USD');
  const [autoSendRetention, setAutoSendRetentionState] = useState(false);
  const [isProtocolAccepted, setIsProtocolAccepted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDashboardLoaded, setDashboardLoaded] = useState(false);
  const [userEmpires, setUserEmpires] = useState<any[]>([]);
  const [activeEmpire, setActiveEmpire] = useState<any | null>(null);

  const connectedPlatforms = platformsByEmpire[activeEmpireId] || [];
  const empireNotes = notesByEmpire[activeEmpireId] || '';
  const isLinkingComplete = linkingCompleteByEmpire[activeEmpireId] || false;
  const isOnboarded = onboardedByEmpire[activeEmpireId] || false;

  const [slotStatus, setSlotStatus] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false });

  const unlockSlot = (index: number) => {
    setSlotStatus(prev => ({ ...prev, [index]: true }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('slotStatus', JSON.stringify({ ...slotStatus, [index]: true }));
    }
  };
  const [activeSetupPlatform, setActiveSetupPlatform] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({ sales: true, approvals: true });
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

  const setIsPaid = (paid: boolean) => {
    setIsPaidState(paid);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPaid', paid ? 'true' : 'false');
      
      // Sync to backend
      fetch(`${API_URL}/api/settings/isPaid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': '00000000-0000-0000-0000-000000000000'
        },
        body: JSON.stringify({ value: paid })
      }).catch(err => console.error('Failed to sync payment status', err));
    }
  };

  const dismissNotificationModal = () => {
    setIsNotificationModalDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isNotificationModalDismissed', 'true');
    }
  };

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

    const handleSetActiveEmpireId = (id: string) => {
    setActiveEmpireId(id);
    setDashboardLoaded(false); // Trigger dashboard reload
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeEmpireId', id);
    }
  };

  const setHandoverComplete = (complete: boolean) => {
    setIsHandoverComplete(complete);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isHandoverComplete', complete ? 'true' : 'false');
    }
  };

  const completeOnboarding = () => {
    setOnboardedByEmpire(prev => {
      const next = { ...prev, [activeEmpireId]: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardedByEmpire', JSON.stringify(next));
      }
      return next;
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_step');

      // Sync to backend
      fetch(`${API_URL}/api/settings/onboardingComplete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': '00000000-0000-0000-0000-000000000000'
        },
        body: JSON.stringify({ value: true })
      }).catch(err => console.error('Failed to sync onboarding status', err));
    }
  };

  const completeLinkingPhase = () => {
    setLinkingCompleteByEmpire(prev => {
      const next = { ...prev, [activeEmpireId]: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linkingCompleteByEmpire', JSON.stringify(next));
      }
      return next;
    });

    if (typeof window !== 'undefined') {

      // Sync to backend
      fetch(`${API_URL}/api/settings/linkingComplete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': '00000000-0000-0000-0000-000000000000'
        },
        body: JSON.stringify({ value: true })
      }).catch(err => console.error('Failed to sync linking status', err));
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
    setPlatformsByEmpire(prev => {
      const current = prev[activeEmpireId] || [];
      if (current.includes(platform)) return prev;
      const next = { ...prev, [activeEmpireId]: [...current, platform] };
      if (typeof window !== 'undefined') {
        localStorage.setItem('platformsByEmpire', JSON.stringify(next));
      }
      return next;
    });
  };

  const setEmpireNotes = (notes: string) => {
    setNotesByEmpire(prev => {
      const next = { ...prev, [activeEmpireId]: notes };
      if (typeof window !== 'undefined') {
        localStorage.setItem('notesByEmpire', JSON.stringify(next));
      }
      return next;
    });
  };

  const addNote = (note: string) => {
    const newNotes = empireNotes ? `${empireNotes}\n\n• ${note}` : `• ${note}`;
    setEmpireNotes(newNotes);
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireTheme', newTheme);
      // Clean up previous themes
      document.body.classList.forEach(cls => {
        if (cls.startsWith('theme-')) document.body.classList.remove(cls);
      });
      document.body.classList.add(`theme-${newTheme}`);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireLanguage', lang);
    }
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireCurrency', curr);
    }
  };

  const setAutoSendRetention = (enabled: boolean) => {
    setAutoSendRetentionState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoSendRetention', enabled ? 'true' : 'false');
    }
  };

  const acceptProtocols = () => {
    setIsProtocolAccepted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isProtocolAccepted', 'true');
      
      // Notify backend to track acceptance
      fetch(`${API_URL}/api/settings/protocolAccepted`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': '00000000-0000-0000-0000-000000000000'
        },
        body: JSON.stringify({ value: true })
      }).catch(err => console.error('Failed to sync protocol acceptance', err));
    }
  };

  // Sync state from localStorage and backend after mount
  useEffect(() => {
    const hydrateAndSync = async () => {
      if (typeof window === 'undefined') return;

      // 1. Initial Hydration from LocalStorage
      const savedActiveEmpireId = localStorage.getItem('activeEmpireId');
      if (savedActiveEmpireId) setActiveEmpireId(savedActiveEmpireId);

      const savedIsPaid = localStorage.getItem('isPaid') === 'true';
      if (savedIsPaid) setIsPaidState(true);

      const savedAiMode = localStorage.getItem('empireAiMode') as 'co-pilot' | 'empire';
      if (savedAiMode) setAiModeState(savedAiMode);

      try {
        const savedPermissions = JSON.parse(localStorage.getItem('platformPermissions') || '{}');
        setPlatformPermissions(savedPermissions);
      } catch {}

      const savedIsOnboarded = localStorage.getItem('isOnboarded') === 'true';
      if (savedIsOnboarded) setIsOnboarded(true);

      const savedIsHandoverComplete = localStorage.getItem('isHandoverComplete') === 'true';
      if (savedIsHandoverComplete) setIsHandoverComplete(true);

      const savedIsLinkingComplete = localStorage.getItem('isLinkingComplete') === 'true';
      if (savedIsLinkingComplete) setIsLinkingComplete(true);

      const savedIsNotificationModalDismissed = localStorage.getItem('isNotificationModalDismissed') === 'true';
      if (savedIsNotificationModalDismissed) setIsNotificationModalDismissed(true);

      const savedNotes = localStorage.getItem('empireNotes');
      if (savedNotes) setEmpireNotesState(savedNotes);

      const savedTheme = localStorage.getItem('empireTheme');
      if (savedTheme) setThemeState(savedTheme);

      const savedLanguage = localStorage.getItem('empireLanguage');
      if (savedLanguage) setLanguageState(savedLanguage);

      const savedCurrency = localStorage.getItem('empireCurrency');
      if (savedCurrency) setCurrencyState(savedCurrency);

      const savedAutoSend = localStorage.getItem('autoSendRetention') === 'true';
      if (savedAutoSend) setAutoSendRetentionState(true);

      const savedProtocol = localStorage.getItem('isProtocolAccepted') === 'true';
      if (savedProtocol) setIsProtocolAccepted(true);

      const savedSlots = localStorage.getItem('slotStatus');
      if (savedSlots) {
        try {
          setSlotStatus(JSON.parse(savedSlots));
        } catch {}
      }

      try {
        const rawPlatforms = localStorage.getItem('platformsByEmpire');
        if (rawPlatforms) setPlatformsByEmpire(JSON.parse(rawPlatforms));
      } catch {}

      try {
        const rawNotes = localStorage.getItem('notesByEmpire');
        if (rawNotes) setNotesByEmpire(JSON.parse(rawNotes));
      } catch {}

      try {
        const rawOnboarded = localStorage.getItem('onboardedByEmpire');
        if (rawOnboarded) setOnboardedByEmpire(JSON.parse(rawOnboarded));
      } catch {}

      try {
        const rawLinking = localStorage.getItem('linkingCompleteByEmpire');
        if (rawLinking) setLinkingCompleteByEmpire(JSON.parse(rawLinking));
      } catch {}

      try {
        const rawPlatformsOld = localStorage.getItem('connectedPlatforms');
        const savedPlatforms = rawPlatforms ? JSON.parse(rawPlatforms) : [];
        setConnectedPlatforms(Array.isArray(savedPlatforms) ? savedPlatforms : []);
      } catch {
        setConnectedPlatforms([]);
      }

      try {
        const savedNotificationSettings = JSON.parse(localStorage.getItem('empireNotificationSettings') || '{"sales":true,"approvals":true}');
        setNotificationSettings(savedNotificationSettings);
      } catch {}

      // 2. Sync with Backend
      try {
        const settingsRes = await fetch(`${API_URL}/api/settings/hydrate`, {
          headers: { 
            'Authorization': 'Bearer mock-mobile-token',
            'x-user-id': '00000000-0000-0000-0000-000000000000'
          }
        }).catch(() => null);

        if (settingsRes && settingsRes.ok) {
          const contentType = settingsRes.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const settings = await settingsRes.json();
            if (settings.protocolAccepted !== undefined) {
              setIsProtocolAccepted(settings.protocolAccepted);
              localStorage.setItem('isProtocolAccepted', settings.protocolAccepted ? 'true' : 'false');
            }
            if (settings.onboardingComplete) {
              setIsOnboarded(true);
              localStorage.setItem('isOnboarded', 'true');
            }
            if (settings.isPaid !== undefined) {
              setIsPaidState(settings.isPaid);
              localStorage.setItem('isPaid', settings.isPaid ? 'true' : 'false');
            }
          }
        }

        const goal = await empireService.getLatestEmpire().catch(() => null);
        if (goal && goal.id) {
          setActiveEmpireId(goal.id);
          localStorage.setItem('activeEmpireId', goal.id);
          setIsOnboarded(true);
          localStorage.setItem('isOnboarded', 'true');
        }
      } catch (e) {
        console.error('Initial backend sync failed', e);
      } finally {
        setIsInitialized(true);
      }
    };

    hydrateAndSync();
  }, []);

  // Sync theme class
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.forEach(cls => {
        if (cls.startsWith('theme-')) document.body.classList.remove(cls);
      });
      document.body.classList.add(`theme-${theme}`);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Demo Notifications
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

  return (
    <EmpireContext.Provider value={{
      activeEmpireId,
      setActiveEmpireId: handleSetActiveEmpireId,
      isOnboarded,
      isHandoverComplete,
      isInitialized,
      completeOnboarding,
      setHandoverComplete,
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
      isProtocolAccepted,
      acceptProtocols,
      isDashboardLoaded,
      setDashboardLoaded,
      userEmpires,
      setUserEmpires,
      activeEmpire,
      setActiveEmpire,
      slotStatus,
      unlockSlot,
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
