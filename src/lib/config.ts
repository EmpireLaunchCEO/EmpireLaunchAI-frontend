const getApiUrl = () => {
  // 1. Check if we are in a browser
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    
    // 2. If we are on the sandbox, go to the sandbox backend
    if (host.includes('e2b.local-3000.e2b.dev')) {
      return 'https://e2b.local-3001.e2b.dev';
    }
    
    // 3. If we are on Vercel, use relative paths (vercel.json rewrites proxy to Railway)
    if (host.includes('vercel.app')) {
      return '';
    }
  }

  // 4. Fallback for build-time or other environments
  return 'https://backend-production-56123.up.railway.app';
};

export const API_URL = getApiUrl();
console.log('[CONFIG] System API Path Established:', API_URL);
