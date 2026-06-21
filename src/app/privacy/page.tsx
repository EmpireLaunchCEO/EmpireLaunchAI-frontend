import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert prose-sm prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary prose-strong:text-white prose-code:text-primary/80">
        <h1>EmpireLaunch AI — Privacy Policy</h1>
        <p className="text-slate-400 text-sm italic mb-8"><strong>Last Updated:</strong> June 20, 2026</p>

        <p>Welcome to EmpireLaunch AI ("we," "our," or "us"). We are committed to protecting your privacy and securing the data you trust us with. This Privacy Policy describes how EmpireLaunch AI collects, uses, shares, and secures information when you use our Web Dashboard (Progressive Web App / PWA), our native mobile application wrapper, and our associated services (collectively, the "Platform").</p>

        <p>Please read this Privacy Policy carefully to understand our practices regarding your personal data. By accessing or using the Platform, you agree to the practices described in this Privacy Policy.</p>

        <hr className="border-slate-800 my-8" />

        <h2>1. Information We Collect</h2>

        <p>To run your autonomous digital business empire, EmpireLaunch AI collects and processes different types of information, including Personally Identifiable Information (PII) and highly sensitive integration credentials.</p>

        <h3 className="text-lg">1.1 Personal Data You Provide Directly</h3>
        <ul>
          <li><strong>Account Registration:</strong> Name, email address, username, password, and billing preferences.</li>
          <li><strong>Business Profile:</strong> Business name, target niche, pricing preferences, and visual branding assets.</li>
          <li><strong>Communications:</strong> Information you provide when communicating with our support or AI consultants.</li>
        </ul>

        <h3 className="text-lg">1.2 Integration Credentials & Platform Tokens (Ownership Vault)</h3>
        <p>To automate content creation, market research, and multi-platform publishing, you link your third-party commerce and social accounts via our <strong>Neural Link Center</strong>:</p>
        <ul>
          <li><strong>OAuth Access and Refresh Tokens:</strong> Secure API keys and tokens for API-based integrations including <strong>Etsy, TikTok, Shopify, Canva, Google (YouTube/Gmail), Meta (Instagram/Facebook), WooCommerce, and Fiverr</strong>.</li>
          <li><strong>Browser Session Cookies & Shared States:</strong> For platforms lacking robust public API networks (e.g., <strong>GoDaddy, Systeme.io, Behance, Figma, Kittl, and Redbubble</strong>), our Onboarding Orchestrator uses secure browser-assisted automation to collect session tokens, DNS configurations, and account identity markers.</li>
          <li><strong>Ownership Vault Storage:</strong> All tokens, cookies, and secret API credentials are encrypted immediately upon ingestion using <strong>AES-256-GCM zero-knowledge encryption</strong> within our secure Ownership Vault. We cannot access or decrypt your raw external passwords or private API tokens; they are utilized solely in an automated, headless execution loop.</li>
        </ul>

        <h3 className="text-lg">1.3 Financial Data & Payment Processing</h3>
        <ul>
          <li><strong>Stripe Connect & Financial Connections:</strong> We use Stripe Connect for processing subscription fees and tracking success-share revenue. Your banking details, account ownership, and financial credentials are secure and tokenized directly by Stripe. EmpireLaunch AI never stores raw bank routing/account numbers or credit card details on our servers.</li>
          <li><strong>Transaction Metadata:</strong> We track transaction volumes and payouts solely to calculate success-share fees. These calculations utilize PII-blind transaction hashes to prevent tracking back to individual consumers.</li>
        </ul>

        <h3 className="text-lg">1.4 AI Interaction & Style DNA Data</h3>
        <ul>
          <li><strong>Generative AI Inputs:</strong> Content briefs, creative prompts, uploaded assets (images/video clips), and feedback given to our Inline AI Consultants.</li>
          <li><strong>Harvested Style DNA:</strong> Digital product styling patterns, layouts, color palettes, and copywriting structures scraped from public bestseller listings (Etsy/Fiverr) to seed your creative projects.</li>
        </ul>

        <hr className="border-slate-800 my-8" />

        <h2>2. How We Use Your Information</h2>
        <p>We process your data for the following essential business purposes:</p>
        <ol>
          <li><strong>Autonomous Core Execution:</strong> Operating background trend-harvesters, Mass DNA Ingestion workers, and our Gemini Creative Engine to build digital products, draft social campaigns, and schedule videos.</li>
          <li><strong>Platform Integration:</strong> Fetching account metrics, verifying account ownership (via our Neural Handshake protocol), and executing publishing requests to your connected platforms.</li>
          <li><strong>Human-in-the-Loop Approval:</strong> Delivering real-time push notifications, email drafts, and design proposals to your dashboard or mobile device for manual review.</li>
          <li><strong>Transaction Fees Monitoring:</strong> Tracking business revenue milestones to apply our success-share fee protocol (4% on platform-attributed earnings).</li>
          <li><strong>Analytics and Optimization:</strong> Aggregating data to display your stoplight "Empire Health Status" and generate ROI-driven featured recommendations.</li>
        </ol>

        <hr className="border-slate-800 my-8" />

        <h2>3. Third-Party Data Sharing & AI Pipeline Transparency</h2>

        <h3 className="text-lg">3.1 Sharing Data with Generative AI Models</h3>
        <p>To generate unique templates, copywriting, videos, and automation scripts, EmpireLaunch AI transmits data to third-party Large Language Model (LLM) and Creative API providers, including:</p>
        <ul>
          <li><strong>Google Gemini (1.5 / 3.5 Flash / Pro):</strong> For text analysis, reasoning, script synthesis, and inline consultants.</li>
          <li><strong>OpenAI (GPT models) & Anthropic (Claude models):</strong> For copywriting and advanced strategic evaluation.</li>
          <li><strong>Creative Assets Platforms (e.g., Canva, Bannerbear):</strong> For programmatic template generation.</li>
        </ul>

        <h3 className="text-lg">3.2 Service Providers & Partners</h3>
        <ul>
          <li><strong>Database Sync Engine (Turso / libSQL):</strong> For syncing your team configuration and task boards securely across edge devices.</li>
          <li><strong>Stripe Connect:</strong> For secure billing, bank tokenization, and transaction ledgering.</li>
          <li><strong>Notification Dispatchers (Expo Push / FCM / APNS):</strong> To deliver push alerts.</li>
        </ul>

        <hr className="border-slate-800 my-8" />

        <h2>4. International Regulatory Compliance</h2>

        <h3 className="text-lg">4.1 CAN-SPAM Act (United States)</h3>
        <p>Our automated customer outreach tools enforce the following rules:</p>
        <ul>
          <li>Every email sent through the Platform includes the mandatory footer tags <code>[[BUSINESS_PHYSICAL_ADDRESS]]</code> and <code>[[UNSUBSCRIBE_LINK]]</code>.</li>
          <li>All opt-out requests are processed and synced automatically within 10 business days.</li>
        </ul>

        <h3 className="text-lg">4.2 GDPR & CCPA (European Union & California)</h3>
        <p>If you reside in the EEA, UK, or California, you hold specific data rights:</p>
        <ul>
          <li><strong>Right to Access & Portability:</strong> You can request a copy of your stored business data.</li>
          <li><strong>Right to Erasure:</strong> You can request complete account deletion and token purge.</li>
          <li><strong>Right to Object:</strong> You can withdraw platform linkages at any time.</li>
        </ul>
        <p>To exercise these rights, submit a request to: <a href="mailto:privacy@empirelaunch.ai">privacy@empirelaunch.ai</a>.</p>

        <hr className="border-slate-800 my-8" />

        <h2>5. Security & Encryption Standards</h2>
        <ul>
          <li><strong>Zero-Knowledge Enclaves:</strong> Raw tokens encrypted before storage.</li>
          <li><strong>AES-256-GCM Encryption:</strong> For all data-at-rest.</li>
          <li><strong>SSL/TLS 1.3:</strong> Enforced for all data-in-transit.</li>
        </ul>

        <hr className="border-slate-800 my-8" />

        <h2>6. Contact Us</h2>
        <p>For privacy-related questions, contact our Data Protection Officer:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:privacy@empirelaunch.ai">privacy@empirelaunch.ai</a></li>
        </ul>
      </div>
    </div>
  );
}