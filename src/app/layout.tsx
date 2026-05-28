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
        <link rel="manifest" href="/manifest.json?v=4.2.6" />
        <link rel="apple-touch-icon" href="/branded-globe.png?v=4.2.6" />
        <link rel="icon" href="/branded-globe.png?v=4.2.6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#2563eb" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var version = '4.2.6';
                  var lastVersion = localStorage.getItem('app_version');
                  if (lastVersion !== version) {
                    localStorage.setItem('app_version', version);
                    
                    // NUCLEAR RESET OF STUCK SETUP STATE (BUT PRESERVE ONBOARDING)
                    localStorage.removeItem('activeSetupPlatform');
                    
                    // Reset tour keys to force welcome tour if they want it
                    localStorage.removeItem('empire_tour_v418');
                    
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations().then(function(regs) {
                        for(var i=0; i<regs.length; i++) regs[i].unregister();
                      });
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} transition-colors duration-500`}>
        <EmpireProvider>
          {children}
          <SetupAssistant />
          <ToastContainer />
        </EmpireProvider>
      </body>
    </html>
  );
}
