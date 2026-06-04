const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  // Hardcoded production fallback for Vercel builds where env vars might be missing
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://empirelaunchai-backend-production.up.railway.app';
  }
  
  return 'https://fine-buses-learn.loca.lt';
};

export const API_URL = getApiUrl();
