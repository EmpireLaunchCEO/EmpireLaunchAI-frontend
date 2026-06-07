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
