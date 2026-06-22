const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Auto-detect sandbox environment
    if (host.includes('e2b.local-3000.e2b.dev')) {
      return 'https://e2b.local-3001.e2b.dev';
    }
    // Production/Vercel fallback to Railway backend
    if (host.includes('vercel.app')) {
      return 'https://bizrunner-backend-production.up.railway.app';
    }
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Default to the known Railway production backend for testing
  return 'https://bizrunner-backend-production.up.railway.app';
};

export const API_URL = getApiUrl();
