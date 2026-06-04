const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  // If we are in production (Vercel), we should ideally have the env var.
  // If not, we might be hitting a localtunnel which is likely dead.
  // Default to a relative path if we expect the backend to be on the same domain (not our case)
  // or use the known production backend URL if available.
  
  return 'https://fine-buses-learn.loca.lt';
};

export const API_URL = getApiUrl();
