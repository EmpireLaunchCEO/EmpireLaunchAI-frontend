"use client";

/**
 * ONE place that knows the session.
 *
 * Owner decision (27 Nov): "fix authentication first". The backend no longer
 * believes a caller-supplied identity: every authenticated route wants
 * `Authorization: Bearer <token>` issued by /api/auth/login, /register or
 * /master-login, and a self-minted UUID is refused with 401 AUTH_REQUIRED.
 *
 * So this module NEVER invents a value. It reads the real session token the
 * backend issued, sends it as a Bearer header, and when the server says 401 it
 * clears the dead session and sends the client to the sign-in screen.
 */

import { API_URL } from '@/lib/config';

export const AUTH_TOKEN_KEY = 'empire_auth_token';
/** camelCase is what the rest of the app reads (kept for compatibility). */
export const USER_ID_KEY = 'empire_userId';
/** snake_case key the backend contract names. */
export const LEGACY_USER_ID_KEY = 'empire_user_id';

export const SIGN_IN_PATH = '/onboarding?step=2&mode=login';

const isBrowser = () => typeof window !== 'undefined';

const setUserIdCookie = (id: string) => {
  if (!isBrowser()) return;
  document.cookie = `empire_userId=${id}; path=/; max-age=31536000; SameSite=Lax`;
};

/** The real session token the backend issued, or '' when there is none. */
export const getStoredToken = (): string => {
  if (!isBrowser()) return '';
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

/** `Bearer <token>`, or '' when not signed in — never a made-up value. */
export const getAuthHeader = (): string => {
  const token = getStoredToken();
  return token ? `Bearer ${token}` : '';
};

export const isSignedIn = (): boolean => getStoredToken().length > 0;

/** Headers for an authenticated request. Omits Authorization when there is no session. */
export const authHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = { ...extra };
  const header = getAuthHeader();
  if (header) headers['Authorization'] = header;
  return headers;
};

/**
 * A `<video src>` or a download link cannot send a header, so the session token
 * rides as `?token=`. Only backend API URLs get it — never a third-party URL.
 */
export const withToken = (url: string): string => {
  if (!url) return url;
  const token = getStoredToken();
  if (!token) return url;
  const isApiUrl = url.startsWith('/api/') || url.startsWith(`${API_URL}/api/`);
  if (!isApiUrl) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(token)}`;
};

/** Store the session the backend returned. `userId` goes under both key spellings. */
export const saveSession = (payload: { token?: string; userId?: string } | null | undefined): string => {
  if (!isBrowser() || !payload) return '';
  const token = typeof payload.token === 'string' ? payload.token : '';
  const userId = typeof payload.userId === 'string' ? payload.userId : '';
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
      localStorage.setItem(LEGACY_USER_ID_KEY, userId);
      setUserIdCookie(userId);
    }
  } catch {
    // Private-mode storage failures must not break sign-in.
  }
  return token;
};

/** Forget the session locally. */
export const clearSession = (): void => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(LEGACY_USER_ID_KEY);
  } catch {
    // ignore
  }
  document.cookie = 'empire_userId=; path=/; max-age=0; SameSite=Lax';
};

/**
 * Sign-out: tell the backend to revoke the session, then clear both keys.
 * A failed revoke still clears locally — the client must not stay signed in.
 */
export const signOut = async (): Promise<void> => {
  const header = getAuthHeader();
  if (header) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', headers: { Authorization: header } });
    } catch {
      // offline / already-revoked — clearing locally is still correct
    }
  }
  clearSession();
};

let redirecting = false;

/**
 * A 401 means the session is gone or never existed. Clear it and go to sign-in.
 * Returns true when it handled the response.
 */
export const handleUnauthorized = (): void => {
  clearSession();
  if (!isBrowser() || redirecting) return;
  if (window.location.pathname.startsWith('/onboarding')) return;
  redirecting = true;
  window.location.href = SIGN_IN_PATH;
};

/**
 * Authenticated fetch. Attaches the Bearer token when there is one and routes a
 * 401 to the sign-in screen instead of leaving a dead screen spinning.
 */
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(options.headers || {});
  const header = getAuthHeader();
  if (header && !headers.has('Authorization')) headers.set('Authorization', header);
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) handleUnauthorized();
  return res;
};

let installed = false;

/**
 * Safety net for the call sites that still use plain `fetch`: any 401 from our
 * own API clears the dead session and sends the client to sign-in. Installed
 * once, app-wide, from the root provider.
 */
export const installAuthWatcher = (): void => {
  if (installed || !isBrowser() || typeof window.fetch !== 'function') return;
  installed = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await originalFetch(input, init);
    if (res.status === 401) {
      const raw = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (raw.startsWith('/api/') || raw.startsWith(`${API_URL}/api/`)) handleUnauthorized();
    }
    return res;
  };
};
