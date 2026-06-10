export interface Capability {
  tier: 'read-only' | 'co-pilot' | 'empire';
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
      { tier: 'read-only', description: 'Monitor existing shop sales and analytics. Track revenue from AI-generated listings.' },
      { tier: 'co-pilot', description: 'AI drafts SEO-optimized listings for your existing shop. Suggests keyword improvements based on sales data.' },
      { tier: 'empire', description: 'Auto-Pilot: AI autonomously manages listings and automates customer "Thank You" scripts in your store.' }
    ]
  },
  fiverr: {
    id: 'fiverr',
    capabilities: [
      { tier: 'read-only', description: 'Track Gig performance and revenue. Monitor conversion rates for AI-optimized services.' },
      { tier: 'co-pilot', description: 'AI drafts optimized Gig descriptions and SEO tags to boost your existing ranking.' },
      { tier: 'empire', description: 'Auto-Pilot: AI manages inquiry responses and Gig updates autonomously to maximize growth.' }
    ]
  },
  tiktok: {
    id: 'tiktok',
    capabilities: [
      { tier: 'read-only', description: 'Track video performance and revenue growth for AI-promoted products. Monitor trends.' },
      { tier: 'co-pilot', description: 'AI suggests video scripts and drafts promotional posts for your existing account.' },
      { tier: 'empire', description: 'Auto-Pilot: AI programmatically uploads and schedules content to drive sales for your products.' }
    ]
  },
  instagram: {
    id: 'instagram',
    capabilities: [
      { tier: 'read-only', description: 'Monitor engagement and sales growth for AI-promoted products. Track competitor trends.' },
      { tier: 'co-pilot', description: 'AI drafts captions and suggests hashtags for your existing account. Prepare Feed/Story drafts.' },
      { tier: 'empire', description: 'Auto-Pilot: AI posts content and manages comments autonomously to drive traffic to your store.' }
    ]
  },
  facebook: {
    id: 'facebook',
    capabilities: [
      { tier: 'read-only', description: 'Track page engagement and audience growth. Monitor sales impact from Facebook posts.' },
      { tier: 'co-pilot', description: 'AI drafts posts and community updates for your review. Suggest optimal sharing times.' },
      { tier: 'empire', description: 'Auto-Pilot: AI manages page posting and group engagement autonomously to boost product visibility.' }
    ]
  },
  youtube: {
    id: 'youtube',
    capabilities: [
      { tier: 'read-only', description: 'Track views, subscribers, and watch time analytics. AI monitors video ranking for your keywords.' },
      { tier: 'co-pilot', description: 'AI suggests video topics and drafts metadata. Prepare descriptions and tags for your approval.' },
      { tier: 'empire', description: 'Upload videos, update thumbnails, and manage channel comments autonomously.' }
    ]
  },
  canva: {
    id: 'canva',
    capabilities: [
      { tier: 'read-only', description: 'Import user designs for AI analysis. Monitor your asset library for pattern harvesting.' },
      { tier: 'co-pilot', description: 'AI suggests design improvements and drafts templates based on your instructions.' },
      { tier: 'empire', description: 'Programmatically autofill templates, upload assets, and export finished products for sale.' }
    ]
  },
  gmail: {
    id: 'gmail',
    capabilities: [
      { tier: 'read-only', description: 'Monitor order confirmation emails. AI tracks sales velocity and identifies customer inquiries.' },
      { tier: 'co-pilot', description: 'AI drafts replies to customer emails for your review. Organize business threads for efficient management.' },
      { tier: 'empire', description: 'Send automated post-order "Thank You" emails and manage customer inquiries autonomously.' }
    ]
  },
  imap: {
    id: 'imap',
    capabilities: [
      { tier: 'read-only', description: 'Monitor order confirmation emails. AI tracks sales velocity and identifies customer inquiries.' },
      { tier: 'co-pilot', description: 'AI drafts replies to customer emails for your review. Organize business threads for efficient management.' },
      { tier: 'empire', description: 'Send automated post-order "Thank You" emails and manage customer inquiries autonomously.' }
    ]
  },
  kittl: {
    id: 'kittl',
    capabilities: [
      { tier: 'read-only', description: 'Monitor your design projects for AI pattern harvesting and style DNA extraction.' },
      { tier: 'co-pilot', description: 'AI generates design prompts, scripts, and asset lists for you to use in Kittl.' },
      { tier: 'empire', description: 'Advanced AI-assisted drafting and asset synchronization (Blueprint Phase).' }
    ]
  },
  capcut: {
    id: 'capcut',
    capabilities: [
      { tier: 'read-only', description: 'Monitor your video projects for AI analysis and style pattern matching.' },
      { tier: 'co-pilot', description: 'AI generates video scripts, scene lists, and asset requirements for your manual edit.' },
      { tier: 'empire', description: 'AI injects project files and assets directly into your CapCut workflow (Desktop only).' }
    ]
  },
  shopify: {
    id: 'shopify',
    capabilities: [
      { tier: 'read-only', description: 'Track order volume and revenue growth for AI-promoted products in your existing store.' },
      { tier: 'co-pilot', description: 'AI suggests product description optimizations and drafts social-ready promotional content.' },
      { tier: 'empire', description: 'Auto-Pilot: AI synchronizes designs directly to your storefront and manages automated fulfillment tracking.' }
    ]
  },
  bannerbear: {
    id: 'bannerbear',
    capabilities: [
      { tier: 'read-only', description: 'Monitor automated asset generation feeds and view template performance.' },
      { tier: 'co-pilot', description: 'AI suggests design templates and drafts asset variations for your review.' },
      { tier: 'empire', description: 'Programmatically generate and publish social media assets from live data feeds autonomously.' }
    ]
  }
};
