const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Use relative path for web to ensure it works across different hostnames in the sandbox
  if (typeof window !== 'undefined') {
    return '';
  }
  // Fallback for local development / SSR
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
