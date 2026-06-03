import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EmpireProvider } from "@/lib/EmpireContext";
import { SetupAssistant } from "@/components/SetupAssistant";
import { ToastContainer } from "@/components/Dashboard/ToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EmpireLaunchAI - AI Business Partner",
  description: "Automate your business with AI",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbbf24',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://empire-launch-ai-frontend.vercel.app" />
        <link rel="manifest" href="/manifest.json?v=515" />
        <link rel="apple-touch-icon" href="/branded-globe.png?v=515" />
        <link rel="icon" href="/branded-globe.png?v=515" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EmpireLaunch" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. SERVICE WORKER TERMINATOR
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister().then(function(boolean) {
                         if(boolean) console.log('Legacy Service Worker Terminated');
                      });
                    }
                  }).catch(function(err) {
                    console.log('Service Worker termination failed: ', err);
                  });
                }

                // 2. SCROLL RECOVERY SCRIPT
                function forceScroll() {
                  document.documentElement.style.overflow = 'auto';
                  document.documentElement.style.height = 'auto';
                  document.body.style.overflow = 'visible';
                  document.body.style.height = 'auto';
                }
                
                window.addEventListener('load', forceScroll);
                window.addEventListener('resize', forceScroll);
                setInterval(forceScroll, 2000); // Periodic check to fight dynamic scroll locks

                // 3. RELOAD LOOP GUARD
                try {
                  var now = Date.now();
                  var lastReload = parseInt(localStorage.getItem('last_empire_reload') || '0');
                  var reloadCount = parseInt(localStorage.getItem('empire_reload_count') || '0');
                  
                  if (now - lastReload < 5000) {
                    reloadCount++;
                  } else {
                    reloadCount = 0;
                  }
                  
                  localStorage.setItem('last_empire_reload', now.toString());
                  localStorage.setItem('empire_reload_count', reloadCount.toString());
                  
                  if (reloadCount > 3) {
                    console.error('CRITICAL: Reload loop detected. Stabilizing engine...');
                    // STOP RELOADING - if we were about to reload, we don't.
                    return;
                  }
                } catch(e) {}

                // 3. ONBOARDING REDIRECT
                try {
                  var onboarded = localStorage.getItem('isOnboarded');
                  var path = window.location.pathname;
                  if (onboarded === 'true' && (path === '/' || path === '/onboarding')) {
                    window.location.replace('/dashboard');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-theme-background text-foreground`}>
        <EmpireProvider>
          {children}
          <SetupAssistant />
          <ToastContainer />
        </EmpireProvider>
      </body>
    </html>
  );
}
