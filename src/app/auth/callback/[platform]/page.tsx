"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';

import { Suspense } from 'react';

function AuthCallbackContent() {
  const router = useRouter();
  const { isOnboarded } = useEmpire();
  const params = useParams();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing connection...');

  const platform = params.platform as string;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if (!code || !platform) {
      setStatus('error');
      setMessage('Missing authorization code or platform info.');
      return;
    }

    const completeConnection = async () => {
      try {
        // Retrieve sessionId and saved state from localStorage
        const savedState = localStorage.getItem(`${platform}_auth_state`);
        const sessionId = localStorage.getItem(`${platform}_oauth_session_id`);

        if (state !== savedState) {
          throw new Error('Invalid state parameter.');
        }

        const response = await fetch(`${API_URL}/api/auth/${platform}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            sessionId,
            userId: '00000000-0000-0000-0000-000000000000', // Mock user ID for now
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
          setMessage(`${platformName} connected successfully${data.handle ? ` as ${data.handle}` : ''}!`);

          // Store connection token for popup detection
          const vaultKey = `empire_vault_${platform}`;
          localStorage.setItem(vaultKey, JSON.stringify({ 
            connected: true, 
            handle: data.handle,
            timestamp: Date.now() 
          }));

          // Clear storage
          localStorage.removeItem(`${platform}_auth_state`);
          localStorage.removeItem(`${platform}_oauth_session_id`);

          // Redirect back after a short delay
          setTimeout(() => {
            if (isOnboarded) {
              router.push('/dashboard');
            } else {
              router.push('/onboarding');
            }
          }, 2000);
        } else {
          throw new Error(data.error || 'Failed to complete connection.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An unexpected error occurred.');
      }
    };

    completeConnection();
  }, [code, platform, state, router, isOnboarded]);

  return (
    <div className="min-h-screen bg-theme-background flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-theme-surface rounded-3xl shadow-xl p-10 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(176,38,255,0.4)]" />
            <h2 className="text-2xl font-bold text-foreground">Connecting...</h2>
            <p className="text-muted-foreground font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Success!</h2>
            <p className="text-muted-foreground font-medium">{message}</p>
            <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Connection Failed</h2>
            <p className="text-muted-foreground font-medium">{message}</p>
            <button
              onClick={() => router.push('/onboarding')}
              className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-theme-background flex items-center justify-center p-8">
        <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(176,38,255,0.4)]" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
