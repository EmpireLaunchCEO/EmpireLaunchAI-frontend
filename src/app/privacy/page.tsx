import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-500/10">
        <div className="mb-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Privacy Policy</h1>
          <p className="mt-2 text-slate-400">Last Updated: June 20, 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <p>Welcome to EmpireLaunch AI ("we," "our," or "us"). We are committed to protecting your privacy and securing the data you trust us with. This Privacy Policy describes how EmpireLaunch AI collects, uses, shares, and secures information when you use our Web Dashboard (Progressive Web App / PWA), our native mobile application wrapper, and our associated services (collectively, the "Platform").</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">To run your autonomous digital business empire, EmpireLaunch AI collects and processes different types of information, including Personally Identifiable Information (PII) and highly sensitive integration credentials.</p>
            
            <h3 className="text-lg font-medium text-slate-100 mb-2">1.1 Personal Data You Provide Directly</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><strong>Account Registration:</strong> Name, email address, username, password, and billing preferences.</li>
              <li><strong>Business Profile:</strong> Business name, target niche, pricing preferences, and visual branding assets.</li>
              <li><strong>Communications:</strong> Information you provide when communicating with our support or AI consultants.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-100 mb-2">1.2 Integration Credentials & Platform Tokens (Ownership Vault)</h3>
            <p className="mb-2">To automate content creation, market research, and multi-platform publishing, you link your third-party commerce and social accounts via our Neural Link Center:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>OAuth Access and Refresh Tokens:</strong> Secure API keys and tokens for API-based integrations including Etsy, TikTok, Shopify, Canva, Google (YouTube/Gmail), Meta (Instagram/Facebook), WooCommerce, and Fiverr.</li>
              <li><strong>Ownership Vault Storage:</strong> All tokens, cookies, and secret API credentials are encrypted immediately using AES-256-GCM zero-knowledge encryption.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Autonomous Core Execution:</strong> Operating background trend-harvesters and our Gemini Creative Engine.</li>
              <li><strong>Platform Integration:</strong> Executing publishing requests to your connected platforms.</li>
              <li><strong>Human-in-the-Loop Approval:</strong> Delivering design proposals for your manual review.</li>
              <li><strong>Transaction Fees Monitoring:</strong> Tracking revenue milestones for success-share protocol.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Third-Party Data Sharing</h2>
            <p>To generate unique templates and copywriting, EmpireLaunch AI transmits data to third-party providers including Google Gemini, OpenAI, and Anthropic. We strip out direct personal identifiers before processing through AI APIs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. International Compliance</h2>
            <p>We strictly enforce CAN-SPAM Act rules for automated outreach and respect GDPR & CCPA rights for residents in applicable regions, including the right to access, portability, and erasure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
            <p>For privacy-related questions or data removal requests, please contact our Data Protection Officer at: <a href="mailto:privacy@empirelaunch.ai" className="text-indigo-400 hover:underline">privacy@empirelaunch.ai</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">© 2026 EmpireLaunch AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
