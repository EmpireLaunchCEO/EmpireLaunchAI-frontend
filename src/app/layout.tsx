import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EmpireProvider } from "@/lib/EmpireContext";
import { SetupAssistant } from "@/components/SetupAssistant";
import { ToastContainer } from "@/components/Dashboard/ToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EmpireLaunch AI - AI Business Partner",
  description: "Automate your business with AI",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0519',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // PWA CACHE BUSTER - Force fresh load if cached version is stale
              try {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    regs.forEach(function(reg) { reg.unregister(); });
                  });
                }
                // Clear all caches
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    names.forEach(function(name) { caches.delete(name); });
                  });
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
        <link rel="manifest" href="/manifest.json?v=1025" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-v1024.png" />
        <link rel="icon" href="/favicon.ico?v=1024" />
        <link rel="apple-touch-startup-image" href="/apple-touch-icon-v1024.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192-v1024.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512-v1024.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="EmpireLaunch AI" />
        <meta id="theme-color-meta" name="theme-color" content="#0a0519" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // SERVICE WORKER TERMINATOR - Prevent cached service workers from conflicting with new builds
                if ('serviceWorker' in navigator && !sessionStorage.getItem('empire_sw_cleaned')) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                    sessionStorage.setItem('empire_sw_cleaned', 'true');
                  });
                }

                // SELF-HEALING CACHE - Clear legacy keys that cause hydration mismatches
                if (!sessionStorage.getItem('empire_cache_purged_v1')) {
                   const legacyKeys = ['platformPermissions', 'spendingPermissions', 'slotStatus', 'onboardedByEmpire'];
                   legacyKeys.forEach(key => {
                     try {
                       const val = localStorage.getItem(key);
                       if (val && (val === 'undefined' || val === 'null' || val.includes('mismatch'))) {
                         localStorage.removeItem(key);
                       }
                     } catch(e) {}
                   });
                   sessionStorage.setItem('empire_cache_purged_v1', 'true');
                }

                // RELOAD LOOP GUARD - Prevents rapid refresh cycles
                try {
                  var now = Date.now();
                  var lastReload = parseInt(localStorage.getItem('last_empire_reload') || '0');
                  var reloadCount = parseInt(localStorage.getItem('empire_reload_count') || '0');

                  if (now - lastReload < 3000) {
                    reloadCount++;
                  } else {
                    reloadCount = 0;
                  }

                  localStorage.setItem('last_empire_reload', now.toString());
                  localStorage.setItem('empire_reload_count', reloadCount.toString());

                  if (reloadCount > 5) {
                    console.warn('Excessive reload activity detected. Maintaining last stable state.');
                    // If we're looping, stop the redirect behavior
                    window.EMPIRE_LOOP_PROTECTION = true;
                    // Reset count after a delay to allow future valid reloads
                    setTimeout(function() { localStorage.setItem('empire_reload_count', '0'); }, 10000);
                  }
                } catch(e) {}
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
