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
        <style>{`
          html, body { background-color: #0a0519 !important; }
        `}</style>
        <link rel="canonical" href="https://empire-launch-ai-frontend.vercel.app" />
        <link rel="manifest" href="/manifest.json?v=1022" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=22" />
        <link rel="icon" href="/favicon.ico?v=22" />
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png?v=22" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=22" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png?v=22" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="EmpireLaunch AI" />
        <meta name="theme-color" content="#0a0519" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // SERVICE WORKER TERMINATOR - Prevent cached service workers
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                  });
                }

                // RELOAD LOOP GUARD
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
                    console.log('Reload activity detected, maintaining stability.');
                    return;
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
