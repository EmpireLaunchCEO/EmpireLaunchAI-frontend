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
                  // VERSION CHECK DISABLED TO PREVENT REFRESH LOOPS
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
