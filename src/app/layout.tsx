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
        <script dangerouslySetInnerHTML={{ "__html": "!function(){try{if('serviceWorker'in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(e){e.unregister()})})}if('caches'in window){caches.keys().then(function(n){n.forEach(function(e){caches.delete(e)})})}}catch(e){}}();!function(){try{if('serviceWorker'in navigator&&!sessionStorage.getItem('_p')){navigator.serviceWorker.getRegistrations().then(function(r){for(var i=0;i<r.length;i++){r[i].unregister()}sessionStorage.setItem('_p','1')})}var n=Date.now(),t=parseInt(localStorage.getItem('_l')||'0');t>0&&n-t<3e3&&(localStorage.clear(),sessionStorage.clear()),localStorage.setItem('_l',n.toString())}catch(e){}}();" }} />
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
