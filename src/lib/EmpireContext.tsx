"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  platformPermissions: Record<string, 'read-only' | 'co-pilot' | 'empire'>;
  updatePlatformPermission: (platform: string, level: 'read-only' | 'co-pilot' | 'empire') => void;
  spendingPermissions: Record<string, boolean>;
  updateSpendingPermission: (platform: string, allowed: boolean) => void;
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
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  userEmail: string | null;
  triggerRefresh: () => Promise<void>;
  registerRefreshHandler: (handler: () => Promise<void>) => () => void;
  disconnectPlatform: (platform: string) => void;

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
  
  // Scoped Data Maps
  const [platformsByEmpire, setPlatformsByEmpire] = useState<Record<string, string[]>>({});
  const [notesByEmpire, setNotesByEmpire] = useState<Record<string, string>>({});
  const [onboardedByEmpire, setOnboardedByEmpire] = useState<Record<string, boolean>>({});
  const [linkingCompleteByEmpire, setLinkingCompleteByEmpire] = useState<Record<string, boolean>>({});

  // Shared States
  const [isAdmin, setIsAdminState] = useState(false);
  const [isPaid, setIsPaidState] = useState(false);
  const [slotStatus, setSlotStatus] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true });
  const [aiMode, setAiModeState] = useState<'co-pilot' | 'empire'>('co-pilot');
  const [platformPermissions, setPlatformPermissions] = useState<Record<string, 'read-only' | 'co-pilot' | 'empire'>>({});
  const [spendingPermissions, setSpendingPermissions] = useState<Record<string, boolean>>({});
  const [isHandoverComplete, setIsHandoverComplete] = useState(false);
  const [isNotificationModalDismissed, setIsNotificationModalDismissed] = useState(false);
  const [theme, setThemeState] = useState('blue');
  const [language, setLanguageState] = useState('en-US');
  const [currency, setCurrencyState] = useState('USD');
  const [autoSendRetention, setAutoSendRetentionState] = useState(false);
  const [isProtocolAccepted, setIsProtocolAccepted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDashboardLoaded, setDashboardLoaded] = useState(false);
  const [userEmpires, setUserEmpires] = useState<any[]>([]);
  const [activeEmpire, setActiveEmpire] = useState<any | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [activeSetupPlatform, setActiveSetupPlatform] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({ sales: true, approvals: true });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [refreshHandlers, setRefreshHandlers] = useState<(() => Promise<void>)[]>([]);

  // Session helper — get the actual logged-in user from localStorage
  const getStoredUserId = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('empire_userId');
  };

  const getOwnerBrandingForId = (id: string) => {
    if (id === '2') {
      return {
        id: '2',
        title: 'Empire 2',
        name: 'Empire 2',
        niche: 'E-commerce Business Builders',
        description: 'Empire Niche: E-commerce Business Builders.'
      };
    }
    if (id === '3') {
      return {
        id: '3',
        title: 'Empire 3',
        name: 'Empire 3',
        niche: 'Digital Marketing Studio',
        description: 'Empire Niche: Digital Marketing Studio.'
      };
    }
    return {
      id: '1',
      title: 'EmpireLaunch AI',
      name: 'EmpireLaunch AI',
      niche: 'AI Business Automation',
      description: 'Empire Niche: AI Business Automation. Angle: The No-Subscription Empire. Target: Entrepreneurs.'
    };
  };

  const registerRefreshHandler = useCallback((handler: () => Promise<void>) => {
    setRefreshHandlers(prev => [...prev, handler]);
    return () => {
      setRefreshHandlers(prev => prev.filter(h => h !== handler));
    };
  }, []);

  const triggerRefresh = useCallback(async () => {
    if (refreshHandlers.length === 0) return;
    await Promise.all(refreshHandlers.map(handler => handler()));
  }, [refreshHandlers]);

  // Scoped Computed Values
  const connectedPlatforms = platformsByEmpire[activeEmpireId] || [];
  const empireNotes = notesByEmpire[activeEmpireId] || '';
  const isLinkingComplete = linkingCompleteByEmpire[activeEmpireId] || false;
  const isOnboarded = onboardedByEmpire[activeEmpireId] || false;

  const unlockSlot = (index: number) => {
    setSlotStatus(prev => {
      const next = { ...prev, [index]: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('slotStatus', JSON.stringify(next));
      }
      return next;
    });
  };

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

  const updatePlatformPermission = (platform: string, level: 'read-only' | 'co-pilot' | 'empire') => {
    setPlatformPermissions(prev => {
      const next = { ...prev, [platform]: level };
      if (typeof window !== 'undefined') {
        localStorage.setItem('platformPermissions', JSON.stringify(next));
        fetch(`${API_URL}/api/settings/platformPermissions`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': getStoredUserId()
          },
          body: JSON.stringify({ value: next })
        }).catch(err => console.error('Failed to sync platform permissions', err));
      }
      return next;
    });
  };

  const updateSpendingPermission = (platform: string, allowed: boolean) => {
    setSpendingPermissions(prev => {
      const next = { ...prev, [platform]: allowed };
      if (typeof window !== 'undefined') {
        localStorage.setItem('spendingPermissions', JSON.stringify(next));
        fetch(`${API_URL}/api/settings/spendingPermissions`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': getStoredUserId()
          },
          body: JSON.stringify({ value: next })
        }).catch(err => console.error('Failed to sync spending permissions', err));
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

  const setIsAdmin = (admin: boolean) => {
    setIsAdminState(admin);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', admin ? 'true' : 'false');
    }
  };

  const setIsPaid = (paid: boolean) => {
    setIsPaidState(paid);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPaid', paid ? 'true' : 'false');
      fetch(`${API_URL}/api/settings/isPaid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getStoredUserId()
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
    setDashboardLoaded(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeEmpireId', id);
    }
    // Ensure each empire keeps its own locked name when switching
    const branding = getOwnerBrandingForId(id);
    setActiveEmpire(prev => {
      if (!prev || prev.id !== id) {
        return { ...prev, id, name: branding.name, title: branding.title, niche: branding.niche, description: branding.description };
      }
      return { ...prev, name: branding.name, title: branding.title, niche: branding.niche, description: branding.description };
    });
  };

  const setHandoverComplete = (complete: boolean) => {
    setIsHandoverComplete(complete);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isHandoverComplete', complete ? 'true' : 'false');
    }
  };

  const completeOnboarding = (updatedEmpire?: any) => {
    setOnboardedByEmpire(prev => {
      const next = { ...prev, [activeEmpireId]: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardedByEmpire', JSON.stringify(next));
      }
      return next;
    });

    if (updatedEmpire) {
      setActiveEmpire(updatedEmpire);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_step');
      fetch(`${API_URL}/api/settings/onboardingComplete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': getStoredUserId()
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
      fetch(`${API_URL}/api/settings/linkingComplete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getStoredUserId()
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

  const disconnectPlatform = (platform: string) => {
    setPlatformsByEmpire(prev => {
      const current = prev[activeEmpireId] || [];
      const next = { ...prev, [activeEmpireId]: current.filter(p => p !== platform) };
      if (typeof window !== 'undefined') {
        localStorage.setItem('platformsByEmpire', JSON.stringify(next));
        localStorage.removeItem(`empire_vault_${platform}`);
        
        // Notify backend
        fetch(`${API_URL}/api/integrations/${platform}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': getStoredUserId()
          }
        }).catch(err => console.error('Failed to notify backend of disconnect', err));
      }
      return next;
    });
    
    addToast({
      title: "Link Severed",
      message: `${platform.toUpperCase()} connection has been removed.`,
      type: 'system'
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
    const currentNotes = notesByEmpire[activeEmpireId] || '';
    const newNotes = currentNotes ? `${currentNotes}\n\n• ${note}` : `• ${note}`;
    setEmpireNotes(newNotes);
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empireTheme', newTheme);
      document.body.classList.forEach(cls => {
        if (cls.startsWith('theme-')) document.body.classList.remove(cls);
      });
      document.body.classList.add(`theme-${newTheme}`);
      document.documentElement.setAttribute('data-theme', newTheme);

      // DYNAMIC STATUS BAR / THEME COLOR UPDATE
      const meta = document.getElementById('theme-color-meta');
      if (meta) {
        meta.setAttribute('content', '#0a0519');
      }
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
      fetch(`${API_URL}/api/settings/protocolAccepted`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getStoredUserId()
        },
        body: JSON.stringify({ value: true })
      }).catch(err => console.error('Failed to sync protocol acceptance', err));
    }
  };

  useEffect(() => {
    const hydrateAndSync = async () => {
      if (typeof window === 'undefined') return;

      // Safety timeout for initialization
      const initTimeout = setTimeout(() => {
        setIsInitialized(current => {
          if (!current) {
            console.warn("Global initialization timeout - forcing initialized state");
            return true;
          }
          return current;
        });
      }, 6000);

      const savedActiveEmpireId = localStorage.getItem('activeEmpireId');
      if (savedActiveEmpireId) {
        setActiveEmpireId(savedActiveEmpireId);
      }
      
      const savedSlotStatus = localStorage.getItem('slotStatus');
      if (savedSlotStatus) {
        setSlotStatus(JSON.parse(savedSlotStatus));
      }
      
      try {
        // Fallback hydration for when backend is slow
        const localAiMode = localStorage.getItem('empireAiMode');
        if (localAiMode) setAiModeState(localAiMode as any);

        const localTheme = localStorage.getItem('empireTheme');
        if (localTheme) setThemeState(localTheme);

        const localIsPaid = localStorage.getItem('isPaid');
        if (localIsPaid === 'true') setIsPaidState(true);

        const localOnboarded = localStorage.getItem('onboardedByEmpire');
        if (localOnboarded) setOnboardedByEmpire(JSON.parse(localOnboarded));

        const localProtocol = localStorage.getItem('isProtocolAccepted');
        if (localProtocol === 'true') setIsProtocolAccepted(true);

        const localActiveId = localStorage.getItem('activeEmpireId') || '1';
        setActiveEmpireId(localActiveId);

        // EMERGENCY BYPASS: Only if the user has manually entered the Master ID or it's saved from a previous session
        const storedUserId = localStorage.getItem('empire_userId');
                    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
                    if (storedIsAdmin) {
                         setIsAdmin(true);
                    }
                    if (localStorage.getItem('isPaid') === 'true') {
                         setIsPaidState(true);
                    }

                    // Fetch user settings from backend using the actual stored userId
                    if (storedUserId) {
                      const settingsRes = await fetch(`${API_URL}/api/settings/hydrate`, {
                        headers: {
                          'Authorization': 'Bearer mock-mobile-token',
                          'x-user-id': storedUserId
                        }
                      }).catch(() => null);

                      if (settingsRes && settingsRes.ok) {
                         const data = await settingsRes.json();

                         // Apply standard settings from backend
                         if (data.isPaid) setIsPaidState(true);
                         if (data.theme) setTheme(data.theme);
                         if (data.aiMode) setAiModeState(data.aiMode);
                         if (data.email) setUserEmail(data.email);
                         if (data.protocolAccepted) setIsProtocolAccepted(true);
                         if (data.spendingPermissions) {
                           setSpendingPermissions(data.spendingPermissions);
                           localStorage.setItem('spendingPermissions', JSON.stringify(data.spendingPermissions));
                         } else {
                           const localSpending = localStorage.getItem('spendingPermissions');
                           if (localSpending) setSpendingPermissions(JSON.parse(localSpending));
                         }

                         if (data.platformPermissions) {
                           setPlatformPermissions(data.platformPermissions);
                           localStorage.setItem('platformPermissions', JSON.stringify(data.platformPermissions));
                         } else {
                           const localPlatformPerms = localStorage.getItem('platformPermissions');
                           if (localPlatformPerms) setPlatformPermissions(JSON.parse(localPlatformPerms));
                         }

                         // Standard user sync — no hardcoded owner checks
                         if (data.onboardingComplete) {
                           const nextOnboarded = { ...onboardedByEmpire, [localActiveId]: true };
                           setOnboardedByEmpire(nextOnboarded);
                           localStorage.setItem('onboardedByEmpire', JSON.stringify(nextOnboarded));
                         }
                         if (data.linkingComplete) {
                           const nextLinking = { ...linkingCompleteByEmpire, [localActiveId]: true };
                           setLinkingCompleteByEmpire(nextLinking);
                           localStorage.setItem('linkingCompleteByEmpire', JSON.stringify(nextLinking));
                         }
                      }
        }

        // Fetch actual connected platforms from backend and populate platformsByEmpire
        if (storedUserId) {
          const integRes = await fetch(`${API_URL}/api/integrations/status`, {
            headers: {
                'Authorization': 'Bearer mock-mobile-token',
                'x-user-id': storedUserId
              }
          }).catch(() => null);

          if (integRes && integRes.ok) {
            const integData = await integRes.json();
            const connected: string[] = (integData.integrations || [])
              .filter((i: any) => i.isConnected !== false)
              .map((i: any) => i.platform);

            if (connected.length > 0) {
              setPlatformsByEmpire(prev => {
                const next = { ...prev, [localActiveId]: connected };
                localStorage.setItem('platformsByEmpire', JSON.stringify(next));
                return next;
              });
            }
          }
        }

        // Fetch empire data
        const empire = await empireService.getEmpire(localActiveId).catch(() => null);
        if (empire) {
          setActiveEmpire(empire);
        } else {
          const goal = await empireService.getLatestEmpire().catch(() => null);
          if (goal && goal.id) {
            setActiveEmpireId(goal.id);
            setActiveEmpire(goal);
            localStorage.setItem('activeEmpireId', goal.id);
          }
        }
      } catch (e) {
        console.error('Initial backend sync failed', e);
      } finally {
        clearTimeout(initTimeout);
        setIsInitialized(true);
      }
    };

    hydrateAndSync();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Construct userEmpires list based on active slots
    const activeSlots = Object.keys(slotStatus).filter(key => slotStatus[parseInt(key)]);
    const empires = activeSlots.map(key => {
      const id = (parseInt(key) + 1).toString();
      return getOwnerBrandingForId(id);
    });
    
    setUserEmpires(empires);
  }, [slotStatus, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    const updateActiveEmpireData = async () => {
      // Standard fetch for the active empire
      const empire = await empireService.getEmpire(activeEmpireId).catch(() => null);
      if (empire) {
        setActiveEmpire(empire);
      }
    };

    updateActiveEmpireData();
  }, [activeEmpireId, isInitialized, userEmail]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.forEach(cls => {
        if (cls.startsWith('theme-')) document.body.classList.remove(cls);
      });
      document.body.classList.add(`theme-${theme}`);
      document.documentElement.setAttribute('data-theme', theme);

      // DYNAMIC STATUS BAR / THEME COLOR UPDATE ON HYDRATION
      const meta = document.getElementById('theme-color-meta');
      if (meta) {
        meta.setAttribute('content', '#0a0519');
      }
    }
  }, [theme]);

  useEffect(() => {
    if (isLinkingComplete && isInitialized) {
      // Fetch real notifications from backend
      fetch(`${API_URL}/api/notifications`, {
        headers: {
          'x-user-id': getStoredUserId()
        }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(err => console.error('Failed to fetch notifications', err));
    }
  }, [isLinkingComplete, isInitialized]);

  useEffect(() => {
    const handleNewFeedback = (e: any) => {
      const { rating, review, userName } = e.detail;
      const newNotification: Notification = {
        id: Math.random().toString(36).substring(2, 9),
        title: `Feedback from ${userName}`,
        message: `[${rating} Stars] ${review}`,
        type: 'approval', // Using approval type so it catches the lead's eye
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      addToast({
        title: "New User Feedback",
        message: `${userName} sent a ${rating}-star review.`,
        type: 'system'
      });
    };

    window.addEventListener('empire:new-user-feedback', handleNewFeedback);
    return () => window.removeEventListener('empire:new-user-feedback', handleNewFeedback);
  }, []);

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
      isAdmin,
      setIsAdmin,
      userEmail,
      triggerRefresh,
      registerRefreshHandler,
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
      removeToast,
      spendingPermissions,
      updateSpendingPermission,
      disconnectPlatform
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
