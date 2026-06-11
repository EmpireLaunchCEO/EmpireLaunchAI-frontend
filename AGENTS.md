<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HARD LOCK: ONBOARDING FLOW
The Onboarding flow is declared PERFECT. No modifications to files in `src/app/onboarding/`, `src/components/Onboarding/`, or onboarding-related styles in `src/app/globals.css` are permitted. Do not "improve," "optimize," or "refactor" these areas. They are locked for branding consistency.

# HARD LOCK: THEME ARCHITECTURE
The "High-Fidelity Dark" theme architecture is now HARD-LOCKED. 
1. All themes MUST maintain the midnight-dark background (`bg-slate-950`).
2. Interactive elements MUST inherit the `--primary` and `--secondary` CSS variables.
3. NEVER revert themes to light mode or change the core gradient logic in `globals.css`.
4. The vibrancy and saturation filters on gradients are intentional; do not reduce them.
Any request to change the fundamental theme behavior must be explicitly approved by the Lead/Owner.

# HARD LOCK: FINANCIAL LOGIC
The Success-Share logic is HARD-LOCKED at **$40 per $1,000 revenue (4%)**. 
1. Any display of empire growth fees or success-sharing MUST calculate based on this 4% rate.
2. The UI must remain transparent about this rate, explicitly stating "$40 fee per $1,000 revenue" where appropriate.
3. Total revenue figures should be derived from the actual connected Stripe/Platform data.

# HARD LOCK: REALITY GROUNDING (NO FALSE INFO)
1. DO NOT display manufactured success, mock revenue, or fake "available" funds. 
2. Default financial figures (Revenue, Sales, Success-Shares, Growth Score) MUST be 0.00 or "—" until real data is fetched from a connected and verified platform.
3. If no accounts are linked, the UI must prompt for account linking rather than showing "demo" success numbers.
4. "Growth Score" must be 0% if no sales or marketing activity has occurred. Do not "pad" stats for aesthetics.
