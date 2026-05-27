// Detect if we are in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get the current hostname to determine if we're on a production/preview URL
const getBaseUrl = () => {
  if (!isBrowser) return 'http://localhost:3001';
  
  const hostname = window.location.hostname;
  
  // If we're on localhost, use the standard backend port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // For E2B/Preview environments, the backend is usually on the same host but a different port
  // or managed by a proxy. We'll use a relative path /api and let the server proxy handle it,
  // or construct the 3001 URL based on the current host.
  // In this specific sandbox environment, the ports are often mapped to subdomains or different ports on the same IP.
  
  // Check if we have a custom API URL in env
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // Fallback: try to reach 3001 on the same host
  return `${window.location.protocol}//${hostname}:3001`;
};

export const API_URL = getBaseUrl();
