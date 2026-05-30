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
  maximumScale: 1,
  userScalable: false,
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
        <link rel="manifest" href="/manifest.json?v=4.6.0" />
        <link rel="apple-touch-icon" href="/branded-globe.png?v=4.6.0" />
        <link rel="icon" href="/branded-globe.png?v=4.6.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var currentVersion = '4.6.5-STABLE';
                  
                  // Check server version
                  fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                      if (data.version && data.version !== currentVersion) {
                        console.log('New version detected:', data.version);
                        localStorage.clear();
                        sessionStorage.clear();
                        if ('serviceWorker' in navigator) {
                          navigator.serviceWorker.getRegistrations().then(function(regs) {
                            for(var r of regs) r.unregister();
                          });
                        }
                        window.location.reload(true);
                      }
                    }).catch(function() {});

                  var installedVersion = localStorage.getItem('app_version');
                  if (installedVersion !== currentVersion) {
                    localStorage.clear();
                    sessionStorage.clear();
                    localStorage.setItem('app_version', currentVersion);
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(function(registrations) {
                        for(var registration of registrations) {
                          registration.unregister();
                        }
                      });
                    }
                    window.location.reload(true);
                  }

                  // Register Service Worker
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                      }, function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                      });
                    });
                  }

                  var onboarded = localStorage.getItem('isOnboarded');
                  var path = window.location.pathname;
                  if (onboarded === 'true' && (path === '/' || path === '/onboarding')) {
                    document.documentElement.style.display = 'none';
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
