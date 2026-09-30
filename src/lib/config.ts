const getApiUrl = () => {
  // 1. Check if we are in a browser
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    
    // 2. If we are on the sandbox, go to the sandbox backend
    if (host.includes('e2b.local-3000.e2b.dev')) {
      return 'https://e2b.local-3001.e2b.dev';
    }
    
    // 3. If we are on Vercel, go to the Railway production backend
    if (host.includes('vercel.app')) {
      return 'https://backend-production-56123.up.railway.app';
    }
  }

  // 4. Fallback for build-time or other environments
  return 'https://backend-production-56123.up.railway.app';
};

export const API_URL = getApiUrl();
console.log('[CONFIG] System API Path Established:', API_URL);

// PWA landing URL for the "Get Started" CTA on completed Operations cards
// (owner Sep 30). Single source of truth — swapping in a custom domain later
// changes exactly this one line.
export const PWA_URL = 'https://empire-launch-ai-frontend.vercel.app';

// Owner account identity (Staci, Sep 30). Single source of truth for the
// owner-only "Get Started" CTA scoping. The owner is ALSO resolved from auth
// via EmpireContext: isAdmin is granted only when the authenticated
// empire_userId is the seeded zero-UUID, and userEmail comes back from the
// backend /api/settings/hydrate response — see EmpireTabs.tsx for the
// established pattern.
export const OWNER_EMAIL = 'stacipeabody@gmail.com';
