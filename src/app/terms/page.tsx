import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert prose-sm prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary prose-strong:text-white prose-code:text-primary/80">
        <h1>EmpireLaunch AI — Terms of Service</h1>
        <p className="text-slate-400 text-sm italic mb-8"><strong>Last Updated:</strong> June 20, 2026</p>

        <p>These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you," "user," or "Entrepreneur"), and EmpireLaunch AI ("we," "us," or "our"), concerning your access to and use of our Web Dashboard (Progressive Web App / PWA), native mobile application wrappers, associated application programming interfaces (APIs), and automated tools (collectively, the "Platform").</p>

        <p>By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these Terms, you are prohibited from using the Platform, and you must discontinue use immediately.</p>

        <hr className="border-slate-800 my-8" />

        <h2>1. Description of Service</h2>
        <p>EmpireLaunch AI is an autonomous, high-intelligence business builder designed to help users launch, manage, and scale digital products and social commerce brands. The Platform aggregates market trend analysis, extracts design patterns ("Style DNA"), generates creative media assets (video, graphics, and copy), and automates publishing workflows across connected third-party marketplaces and social networks.</p>

        <hr className="border-slate-800 my-8" />

        {/* SUCCESS-SHARE PROTOCOL — Highlighted for App Store compliance */}
        <div className="bg-primary/5 border-2 border-primary/30 rounded-[24px] p-6 my-8 not-prose">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-sm font-black text-primary uppercase tracking-widest m-0">Revenue Model & Success-Share Protocol</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            To align our incentives directly with your entrepreneurial success and minimize initial barrier costs, EmpireLaunch AI operates on a <strong className="text-white">Success-Share subscription model</strong>.
          </p>
          <div className="space-y-3">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <p className="font-black text-white text-xs uppercase tracking-widest mb-1">Base Subscription</p>
              <p className="text-slate-400 text-sm">A monthly recurring fee of <strong className="text-white">$40/month</strong> to maintain core platform access, pipeline automation workers, and active database synchronization.</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <p className="font-black text-white text-xs uppercase tracking-widest mb-1">Success-Share Fee (4%)</p>
              <p className="text-slate-400 text-sm">A success fee of <strong className="text-white">4%</strong> ($40 per every $1,000 earned) is applied <strong className="text-white">solely and strictly</strong> to revenues generated through products, designs, listings, social campaigns, or automated email lists created or published via EmpireLaunch AI tools. The 4% success fee is calculated and ledgered as you earn, billed in arrears upon reaching consecutive <strong className="text-white">$1,000 revenue milestones</strong>.</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
              <p className="font-black text-white text-xs uppercase tracking-widest mb-1">Payment Processing</p>
              <p className="text-slate-400 text-sm">Payments are managed via <strong className="text-white">Stripe Connect</strong>. You agree to establish and maintain an active Stripe account linked to your Platform workspace to handle subscription billing, billing of milestone-based success fees, and payouts.</p>
            </div>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        <h2>2. Intellectual Property & Anti-Copycat Engine</h2>

        <h3 className="text-lg">2.1 Ownership of AI-Generated Content</h3>
        <ul>
          <li><strong>User Ownership:</strong> Subject to your full compliance with these Terms and payment of all due fees, you own the intellectual property rights to the unique final product designs, digital layouts, copywriting, and video scripts synthesized for you.</li>
          <li><strong>Base Materials License:</strong> You are granted a license to use, adapt, and sell generated structures.</li>
        </ul>

        <h3 className="text-lg">2.2 Mandatory Anti-Copycat Verification Gate</h3>
        <p>Before any generated product design, planner layout, or thumbnail is cleared for export or publication, it must undergo automated uniqueness validation via <strong>difference hashing (dHash)</strong>. A generated asset is cleared only if it registers a <strong>Hamming distance of greater than 20 (>20)</strong> against marketplace bestsellers. If you bypass this verification, <strong>you assume all legal and financial liability</strong>.</p>

        <hr className="border-slate-800 my-8" />

        <h2>3. Linked Platforms & Account Standing</h2>
        <p>Our <strong>Neural Link Center</strong> allows you to link platforms (Etsy, TikTok, YouTube, Instagram, GoDaddy, Systeme.io, Behance, Figma, Shopify, and others) via OAuth 2.0 or secure browser-assisted automation. You acknowledge that <strong>you are solely responsible</strong> for maintaining your linked store accounts in good standing. EmpireLaunch AI is not liable for shop suspensions, account terminations, or platform penalties.</p>

        <hr className="border-slate-800 my-8" />

        <h2>4. Human-in-the-Loop (HITL) & Automated Execution</h2>
        <p>The Platform enforces a strict <strong>Human-in-the-Loop (HITL)</strong> protocol. No automated action — posting content, publishing listings, running campaigns, or charging accounts — occurs without your <strong>explicit manual approval</strong> in the Neural Dispatch Center. Because you maintain ultimate manual approval control, <strong>EmpireLaunch AI holds zero liability</strong> for the outcomes of published assets.</p>

        <hr className="border-slate-800 my-8" />

        <h2>5. Prohibited Activities</h2>
        <p>You agree not to use the Platform for deceptive, illegal, or abusive purposes. Violations result in immediate termination.</p>

        <hr className="border-slate-800 my-8" />

        <h2>6. Limitation of Liability</h2>
        <p>Our total aggregate liability shall never exceed the total monthly subscription fees paid by you during the three (3) month period immediately preceding the event giving rise to liability.</p>

        <hr className="border-slate-800 my-8" />

        <h2>7. Contact Us</h2>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:legal@empirelaunch.ai">legal@empirelaunch.ai</a></li>
        </ul>
      </div>
    </div>
  );
}