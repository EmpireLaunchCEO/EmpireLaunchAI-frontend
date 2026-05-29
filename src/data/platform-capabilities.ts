export interface Capability {
  tier: 'co-pilot' | 'empire';
  description: string;
}

export interface PlatformCapabilities {
  id: string;
  capabilities: Capability[];
}

export const PLATFORM_CAPABILITIES: Record<string, PlatformCapabilities> = {
  etsy: {
    id: 'etsy',
    capabilities: [
      { tier: 'co-pilot', description: 'View shop stats. Research best sellers. Analyze order history. Read draft listings.' },
      { tier: 'empire', description: 'Create/Edit/Delete listings. Update shop descriptions. Automate "Thank You" messages.' }
    ]
  },
  fiverr: {
    id: 'fiverr',
    capabilities: [
      { tier: 'co-pilot', description: 'AI generates Gig titles, descriptions, and SEO tags for you to copy-paste.' },
      { tier: 'empire', description: 'AI uses a browser agent to log in and update Gigs or respond to messages autonomously.' }
    ]
  },
  tiktok: {
    id: 'tiktok',
    capabilities: [
      { tier: 'co-pilot', description: 'Track video performance. View profile engagement. Research trends.' },
      { tier: 'empire', description: 'Programmatically upload and publish videos at scheduled times.' }
    ]
  },
  instagram: {
    id: 'instagram',
    capabilities: [
      { tier: 'co-pilot', description: 'Detailed analytics. Reach/impression tracking. Audience sentiment.' },
      { tier: 'empire', description: 'Auto-post to Feed/Stories. Tag products in posts. Moderate comments.' }
    ]
  },
  facebook: {
    id: 'facebook',
    capabilities: [
      { tier: 'co-pilot', description: 'Detailed analytics. Reach/impression tracking. Audience sentiment.' },
      { tier: 'empire', description: 'Auto-post to Feed/Stories. Tag products in posts. Moderate comments.' }
    ]
  },
  youtube: {
    id: 'youtube',
    capabilities: [
      { tier: 'co-pilot', description: 'Track views, subscribers, and average watch time.' },
      { tier: 'empire', description: 'Upload videos, update metadata/thumbnails, manage comments.' }
    ]
  },
  canva: {
    id: 'canva',
    capabilities: [
      { tier: 'co-pilot', description: 'Import user designs into BizRunner for analysis and planning.' },
      { tier: 'empire', description: 'Programmatically autofill templates, upload assets, and export finished products.' }
    ]
  },
  gmail: {
    id: 'gmail',
    capabilities: [
      { tier: 'co-pilot', description: 'Track sales via order confirmation emails. View business thread headers.' },
      { tier: 'empire', description: 'Send automated post-order "Thank You" emails and manage customer replies.' }
    ]
  },
  imap: {
    id: 'imap',
    capabilities: [
      { tier: 'co-pilot', description: 'Track sales via order confirmation emails. View business thread headers.' },
      { tier: 'empire', description: 'Send automated post-order "Thank You" emails and manage customer replies.' }
    ]
  },
  kittl: {
    id: 'kittl',
    capabilities: [
      { tier: 'co-pilot', description: 'AI generates design prompts, scripts, and asset lists for the user.' },
      { tier: 'empire', description: 'Advanced AI-assisted drafting (Blueprint Only).' }
    ]
  },
  capcut: {
    id: 'capcut',
    capabilities: [
      { tier: 'co-pilot', description: 'AI generates design prompts, scripts, and asset lists for the user.' },
      { tier: 'empire', description: 'AI injects project files into your local CapCut draft folder (Desktop only).' }
    ]
  },
  shopify: {
    id: 'shopify',
    capabilities: [
      { tier: 'co-pilot', description: 'View store analytics. Research trending products. Analyze customer behavior.' },
      { tier: 'empire', description: 'Auto-fulfill orders. Update inventory. Manage store themes and descriptions.' }
    ]
  },
  bannerbear: {
    id: 'bannerbear',
    capabilities: [
      { tier: 'co-pilot', description: 'Track asset generation and view templates.' },
      { tier: 'empire', description: 'Programmatically generate social media assets from data feeds.' }
    ]
  }
};
