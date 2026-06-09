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
      { tier: 'read-only', description: 'View shop stats and analytics. Research best sellers. AI monitors your store performance without making changes.' },
      { tier: 'co-pilot', description: 'AI drafts new listings and descriptions for your approval. Analyze order history and suggest keywords.' },
      { tier: 'empire', description: 'Create/Edit/Delete listings autonomously. Update shop branding. Automate "Thank You" messages to customers.' }
    ]
  },
  fiverr: {
    id: 'fiverr',
    capabilities: [
      { tier: 'read-only', description: 'Monitor gig performance and track active orders. AI analyzes your ranking and provides growth insights.' },
      { tier: 'co-pilot', description: 'AI generates optimized Gig titles, descriptions, and SEO tags for you to review and copy-paste.' },
      { tier: 'empire', description: 'AI uses a browser agent to manage Gigs, update delivery status, or respond to messages autonomously.' }
    ]
  },
  tiktok: {
    id: 'tiktok',
    capabilities: [
      { tier: 'read-only', description: 'Track video performance, follower growth, and profile engagement. AI monitors trending sounds for your niche.' },
      { tier: 'co-pilot', description: 'AI suggests video scripts and content ideas. Prepare drafts for your final look before publishing.' },
      { tier: 'empire', description: 'Programmatically upload, publish, and schedule videos autonomously based on peak engagement times.' }
    ]
  },
  instagram: {
    id: 'instagram',
    capabilities: [
      { tier: 'read-only', description: 'View detailed insights, reach, and audience sentiment. AI tracks competitor trends in real-time.' },
      { tier: 'co-pilot', description: 'AI drafts captions and suggests hashtags. Prepare Feed and Story posts for your approval.' },
      { tier: 'empire', description: 'Auto-post to Feed/Stories. Tag products in posts. Moderate and respond to comments autonomously.' }
    ]
  },
  facebook: {
    id: 'facebook',
    capabilities: [
      { tier: 'read-only', description: 'Monitor page engagement and audience growth. AI analyzes post performance and reach.' },
      { tier: 'co-pilot', description: 'AI drafts posts and community updates for your review. Suggest optimal times to share content.' },
      { tier: 'empire', description: 'Auto-post to Feed/Stories. Manage group engagement. Moderate comments and respond to inquiries autonomously.' }
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
      { tier: 'read-only', description: 'View store analytics and customer behavior. AI monitors stock levels and sales trends.' },
      { tier: 'co-pilot', description: 'AI suggests product improvements and drafts store updates for your approval.' },
      { tier: 'empire', description: 'Auto-fulfill orders. Update inventory levels. Manage store themes and descriptions autonomously.' }
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
