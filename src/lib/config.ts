const getApiUrl = () => {
  // If we are on Vercel production, prioritize the Railway backend URL
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://empirelaunchai-backend-production.up.railway.app';
  }
  
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  return 'https://fine-buses-learn.loca.lt';
};

export const API_URL = getApiUrl();
