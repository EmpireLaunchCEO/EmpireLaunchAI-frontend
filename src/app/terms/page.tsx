import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-500/10">
        <div className="mb-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Terms of Service</h1>
          <p className="mt-2 text-slate-400">Last Updated: June 20, 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <p>These Terms of Service ("Terms") constitute a legally binding agreement made between you ("Entrepreneur") and EmpireLaunch AI ("we," "us," or "our"), concerning your access to and use of our Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Description of Service</h2>
            <p>EmpireLaunch AI is an autonomous business builder designed to help users launch, manage, and scale digital products and social commerce brands via market analysis and AI-driven creative generation.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Revenue Model & Success-Share</h2>
            <p className="mb-4">EmpireLaunch AI operates on a Success-Share subscription model to align our incentives with your success.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Base Subscription:</strong> $40/month for core platform access.</li>
              <li><strong>Expansion Slots:</strong> $40 one-time unlock + $40/month per active additional business.</li>
              <li><strong>Success Fee:</strong> A 4% fee is applied strictly to revenues generated through products or campaigns created via our tools.</li>
              <li><strong>Milestone Billing:</strong> Fees are billed in arrears upon reaching consecutive $1,000 revenue milestones.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Intellectual Property</h2>
            <p className="mb-4"><strong>User Ownership:</strong> You own the intellectual property rights to the unique final product designs and copywriting synthesized for you, subject to compliance with these Terms.</p>
            <p><strong>Anti-Copycat Engine:</strong> The system enforces a hard-coded uniqueness threshold. You assume all liability for copyright claims if you bypass or manually modify designs to mimic third-party products.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. HITL Disclaimer</h2>
            <p>EmpireLaunch AI operates as an intelligent automated virtual co-pilot. No automated action—including posting or publishing—will occur without your <strong>explicit manual approval</strong> in the Neural Dispatch Center. You maintain ultimate control and hold zero liability for the outcomes of published assets.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Contact Us</h2>
            <p>If you have any questions regarding these Terms, please reach out to us at: <a href="mailto:legal@empirelaunch.ai" className="text-indigo-400 hover:underline">legal@empirelaunch.ai</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">© 2026 EmpireLaunch AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
