"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to check if the user has linked their Stripe account
 * based on the keys stored in the Secure Vault (localStorage)
 */
export function useStripeStatus() {
  const [isLinked, setIsLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      if (typeof window === 'undefined') return;
      
      try {
        // This simulates checking the encrypted vault for keys
        // In the real app, we check if the publishable key exists
        const stripeKeys = localStorage.getItem('empire_vault_stripe');
        if (stripeKeys) {
          const keys = JSON.parse(stripeKeys);
          if (keys.publishableKey && keys.publishableKey.startsWith('pk_')) {
            setIsLinked(true);
          }
        }
      } catch (e) {
        console.error("Error checking Stripe status", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    
    // Listen for vault updates
    window.addEventListener('storage', checkStatus);
    window.addEventListener('empire:vault-updated', checkStatus);
    
    return () => {
      window.removeEventListener('storage', checkStatus);
      window.removeEventListener('empire:vault-updated', checkStatus);
    };
  }, []);

  return { isLinked, isLoading };
}
