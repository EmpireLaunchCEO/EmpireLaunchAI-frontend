"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function AuthCallback() {
  const router = useRouter();
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
        // Retrieve codeVerifier and saved state from localStorage
        const savedState = localStorage.getItem(`${platform}_auth_state`);
        const codeVerifier = localStorage.getItem(`${platform}_code_verifier`);

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
            codeVerifier,
            userId: '00000000-0000-0000-0000-000000000000', // Mock user ID for now
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
          
          // Clear storage
          localStorage.removeItem(`${platform}_auth_state`);
          localStorage.removeItem(`${platform}_code_verifier`);

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
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
  }, [code, platform, state, router]);

  return (
    <div className="min-h-screen bg-theme-background flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-theme-surface rounded-3xl shadow-xl p-10 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <h2 className="text-2xl font-bold text-foreground">Connecting...</h2>
            <p className="text-theme-background0 font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Success!</h2>
            <p className="text-theme-background0 font-medium">{message}</p>
            <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Connection Failed</h2>
            <p className="text-theme-background0 font-medium">{message}</p>
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
