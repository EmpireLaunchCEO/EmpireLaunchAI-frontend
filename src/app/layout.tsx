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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json?v=3.7.2" />
        <link rel="apple-touch-icon" href="/branded-globe.png?v=3.7.2" />
        <link rel="icon" href="/branded-globe.png?v=3.7.2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#2563eb" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Cache-Busting: Clear legacy service workers and local storage if on old version
                  var currentVersion = '3.7.2';
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
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500`}>
        <EmpireProvider>
          {children}
          <SetupAssistant />
          <ToastContainer />
        </EmpireProvider>
      </body>
    </html>
  );
}
