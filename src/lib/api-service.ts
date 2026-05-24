export interface RevenueTransaction {
  id: string;
  amount: number;
  platform: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  customer: string;
}

export interface RevenueMilestone {
  id: string;
  target: number;
  current: number;
  label: string;
  isCompleted: boolean;
}

export interface EngagementMetric {
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  conversionRate: number;
}

export interface ActivityEvent {
  id: string;
  type: 'sale' | 'post' | 'comment' | 'research' | 'milestone' | 'production' | 'social_proof';
  platform: string;
  title: string;
  timestamp: string;
  meta?: {
    link?: string;
    gateId?: string;
    reasoning?: string;
  };
}

export interface AppRating {
  id: string;
  rating: number;
  review: string;
  userName: string;
  status: 'pending' | 'approved_for_marketing' | 'rejected';
  createdAt: string;
}

export interface EmpirePulseState {
  status: 'idle' | 'researching' | 'producing' | 'deploying' | 'optimizing';
  description: string;
  progress: number;
  logs?: string[];
}

export interface EmpireHealth {
  growthScore: number;
  revenue: number;
  pendingDues: number;
  platformBreakdown: {
    platform: string;
    revenue: number;
  }[];
}

export interface PaymentButton {
  id: string;
  label: string;
  productName: string;
  price: number;
  status: 'active' | 'inactive';
  usageCount: number;
  platform: string;
}

export interface DiscoveryResult {
  id: string;
  source: string;
  type: 'credential' | 'invoice' | 'performance_report' | 'contact';
  maskedSnippet: string;
  maskedKey: string;
  confidence: number;
}

export const socialProofService = {
  async getPendingApprovals(): Promise<AppRating[]> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/flagged/00000000-0000-0000-0000-000000000000`);
      if (res.ok) {
        const data = await res.json();
        return data.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          review: r.comment,
          userName: 'CEO', // Backend might not store userName yet, but we'll label it CEO
          status: 'pending',
          createdAt: r.created_at
        }));
      }
    } catch (e) {
      console.error('Failed to fetch flagged reviews', e);
    }

    // Fallback to mock data if API fails
    return [
      {
        id: 'rate_1',
        rating: 5,
        review: 'BizRunner has completely automated my Etsy shop. I am making sales while I sleep!',
        userName: 'Sarah J.',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rate_2',
        rating: 4,
        review: 'The AI trend research is spot on. Saved me hours of manual work.',
        userName: 'Mike R.',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
  },

  async submitRating(rating: number, comment: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: '00000000-0000-0000-0000-000000000000',
          rating,
          comment
        })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to submit review', e);
      return false;
    }
  },

  async approveForMarketing(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: '00000000-0000-0000-0000-000000000000',
          reviewId: id
        })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to approve review', e);
      return false;
    }
  },

  async reject(id: string): Promise<boolean> {
    // Backend doesn't have a specific reject endpoint yet, but we can treat it as 'handled' locally
    return true;
  }
};

export const discoveryService = {
  async getPendingResults(): Promise<DiscoveryResult[]> {
    return [
      { 
        id: '1', 
        source: 'Gmail (ceo@my-empire.com)', 
        type: 'credential', 
        maskedSnippet: 'Your Etsy shop "AestheticTreasures" is ready. Access key: ETSY_XXXX_XXXX', 
        maskedKey: 'ETSY_API_KEY',
        confidence: 0.98
      },
      { 
        id: '2', 
        source: 'Gmail (ceo@my-empire.com)', 
        type: 'invoice', 
        maskedSnippet: 'Invoice #INV-2024-001 from Kittl.com. Total: $0.00 (Free Trial)', 
        maskedKey: 'KITTL_INV_001',
        confidence: 0.95
      },
      { 
        id: '3', 
        source: 'Gmail (ceo@my-empire.com)', 
        type: 'performance_report', 
        maskedSnippet: 'Weekly growth report for @aesthetic_zen (TikTok). 124.5K views...', 
        maskedKey: 'TIKTOK_REPORT_WK20',
        confidence: 0.92
      }
    ];
  },

  async approveResult(id: string): Promise<boolean> {
    return true;
  },

  async rejectResult(id: string): Promise<boolean> {
    return true;
  }
};

export interface ApprovalRequest {
  id: string;
  userId: string;
  taskId?: string;
  type: 'blueprint' | 'content' | 'golive' | 'financial';
  status: 'pending' | 'approved' | 'rejected';
  payload: any;
  decisionDetails?: string;
  createdAt: string;
}

export interface DesignTask {
  id: string;
  title: string;
  platform: 'Kittl' | 'CapCut' | 'Canva' | 'Fiverr';
  status: 'blueprint_ready' | 'editing' | 'review_required';
  thumbnail?: string;
  dueDate: string;
}

export interface CreativeBlueprintData {
  id: string;
  title: string;
  intelligence: string;
  palette: string[];
  fonts: { platform: string; pairing: string }[];
  script: { label: string; text: string }[];
  compositionUrl: string;
  platformLink?: string;
  variations: {
    id: string;
    name: string;
    description: string;
    previewUrl: string;
  }[];
}

export const creativeService = {
  async getDesignTasks(): Promise<DesignTask[]> {
    return [
      { id: 'dt_1', title: 'Vintage Botanical Journal Cover', platform: 'Kittl', status: 'blueprint_ready', dueDate: 'Today' },
      { id: 'dt_2', title: 'Dynamic Business Reveal Video', platform: 'CapCut', status: 'editing', dueDate: 'Tomorrow' },
      { id: 'dt_3', title: 'Minimalist Daily Planner Page', platform: 'Canva', status: 'review_required', dueDate: 'Done' }
    ];
  },

  async getBlueprint(taskId: string): Promise<CreativeBlueprintData> {
    return {
      id: taskId,
      title: 'Vintage Botanical Journal Cover',
      intelligence: 'Matches current 2024 minimalist botanical trend on Etsy. High engagement for "earth tone" palettes.',
      palette: ['#2D4F1E', '#E4D5B7', '#8B4513', '#F5F5DC'],
      fonts: [
        { platform: 'Kittl', pairing: 'Montserrat + Playfair Display' },
        { platform: 'System', pairing: 'Serif + Sans' }
      ],
      script: [
        { label: 'Main Headline', text: 'Celestial Serenity' },
        { label: 'Tagline', text: 'Align Your Soul. Master Your Day.' },
        { label: 'Etsy Tags', text: 'digital journal, botanical cover, minimalist planner, adhd organization' }
      ],
      compositionUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop',
      platformLink: 'https://www.kittl.com/templates/labels',
      variations: [
        { id: 'v1', name: 'The Minimalist', description: 'Focus on white space and thin typography.', previewUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' },
        { id: 'v2', name: 'The Bold', description: 'High-contrast colors and heavy fonts.', previewUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' },
        { id: 'v3', name: 'The Retro', description: 'Vintage textures and serif fonts.', previewUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
      ]
    };
  }
};

export const approvalService = {
  async getPendingRequests(): Promise<ApprovalRequest[]> {
    // In a real app: const res = await fetch(`${API_URL}/api/approvals/pending`);
    return [
      {
        id: 'req_blueprint_1',
        userId: '0000',
        type: 'blueprint',
        status: 'pending',
        payload: {
          niche: 'Digital Zen Journals',
          products: [
            { name: 'Zen Morning Planner', price: 19.99, type: 'PDF' },
            { name: 'Evening Reflection Guide', price: 12.50, type: 'PDF' },
            { name: 'Weekly Habit Tracker', price: 9.99, type: 'PDF' }
          ],
          roadmap: [
            { day: 1, action: 'Store Setup & Identity Design' },
            { day: 3, action: 'Product 1 Design & Listing' },
            { day: 5, action: 'TikTok Launch Sequence' },
            { day: 7, action: 'Instagram Growth Phase' }
          ]
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 'req_content_1',
        userId: '0000',
        type: 'content',
        status: 'pending',
        payload: {
          title: 'Morning Routine Reveal',
          platform: 'TikTok',
          assets: [
            { type: 'video', url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop', previewUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop' }
          ],
          caption: 'My secret to a calm morning... #zen #journaling #morningroutine',
          isProTemplate: true,
          proCost: 12.99
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 'req_golive_1',
        userId: '0000',
        type: 'golive',
        status: 'pending',
        payload: {
          platform: 'Etsy',
          title: 'Digital Zen Morning Planner',
          price: 19.99,
          tags: ['zen', 'planner', 'adhd', 'digital download'],
          bankInfoVerified: false
        },
        createdAt: new Date().toISOString()
      }
    ];
  },

  async respond(id: string, status: 'approved' | 'rejected', details?: string): Promise<boolean> {
    // await fetch(`${API_URL}/api/approvals/${id}/respond`, { 
    //   method: 'POST', 
    //   body: JSON.stringify({ status, details }) 
    // });
    return true;
  }
};

export const analyticsService = {
  async getEmpirePulse(): Promise<EmpirePulseState> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/pulse`, {
        headers: { 
          'x-user-id': '00000000-0000-0000-0000-000000000000',
          'Authorization': 'Bearer mock-mobile-token'
        }
      });
      if (res.ok) {
        const data = await res.json();
        return {
          status: data.status as any,
          description: data.description,
          progress: data.progress,
          logs: data.logs?.map((l: any) => l.message) || []
        };
      }
    } catch (e) {
      console.error('Failed to fetch empire pulse', e);
    }

    return {
      status: 'researching',
      description: 'Analyzing global market velocity for Digital Planners...',
      progress: 68,
      logs: [
        '[SYSTEM] Initializing Market Pulse scan...',
        '[NEURAL] Connecting to Etsy Trend API...',
        '[NEURAL] Pattern recognized: "Minimalist Botanical" (+14% WoW)',
        '[ORCHESTRATOR] Evaluating manufacturing costs for Digital PDF...',
        '[SYSTEM] Searching for free-tier Canva templates...'
      ]
    };
  },

  async getEmpireHealth(): Promise<EmpireHealth> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/pulse`, {
        headers: { 
          'x-user-id': '00000000-0000-0000-0000-000000000000',
          'Authorization': 'Bearer mock-mobile-token'
        }
      });
      // The pulse endpoint actually returns a transformed health-like object in the controller
      // but let's see if we can get more detailed health
      // Actually, looking at analyticsController, getEmpirePulse calls getEmpireHealth(userId)
      // and transforms it. So we can use that data.
      if (res.ok) {
         const data = await res.json();
         // data.logs has revenue info in messages based on current backend implementation
         // We might need a proper health endpoint if we want the structured data
         // For now, let's try to fetch performance too
         const perfRes = await fetch(`${API_URL}/api/analytics/performance`, {
           headers: { 
             'x-user-id': '00000000-0000-0000-0000-000000000000',
             'Authorization': 'Bearer mock-mobile-token'
           }
         });
         const perf = perfRes.ok ? await perfRes.json() : null;

         return {
           growthScore: data.progress,
           revenue: perf?.totalRevenue / 100 || 12450.00, // backend stores in cents
           pendingDues: 60.00,
           platformBreakdown: [
             { platform: 'Etsy', revenue: (perf?.totalRevenue / 100) || 8400.00 },
             { platform: 'Stripe', revenue: 0 },
             { platform: 'Fiverr', revenue: 0 }
           ]
         };
      }
    } catch (e) {
      console.error('Failed to fetch health', e);
    }

    return {
      growthScore: 84,
      revenue: 12450.00,
      pendingDues: 60.00,
      platformBreakdown: [
        { platform: 'Etsy', revenue: 8400.00 },
        { platform: 'Stripe', revenue: 3050.00 },
        { platform: 'Fiverr', revenue: 1000.00 }
      ]
    };
  },

  async getRevenueTransactions(): Promise<RevenueTransaction[]> {
    return [
      { id: '1', amount: 45.00, platform: 'Etsy', date: '2024-05-20T14:30:00Z', status: 'completed', customer: 'Sarah Jenkins' },
      { id: '2', amount: 120.00, platform: 'Stripe', date: '2024-05-20T12:15:00Z', status: 'completed', customer: 'Mike Peterson' },
      { id: '3', amount: 25.00, platform: 'Etsy', date: '2024-05-19T18:45:00Z', status: 'completed', customer: 'Emma Watson' },
      { id: '4', amount: 300.00, platform: 'Fiverr', date: '2024-05-19T10:00:00Z', status: 'pending', customer: 'TechCorp Inc' },
      { id: '5', amount: 15.50, platform: 'Etsy', date: '2024-05-18T22:30:00Z', status: 'completed', customer: 'David Bowie' },
    ];
  },

  async getRevenueMilestones(): Promise<RevenueMilestone[]> {
    return [
      { id: '1', target: 1000, current: 450, label: 'First $1k Milestone', isCompleted: false },
      { id: '2', target: 5000, current: 5000, label: 'Empire Founding', isCompleted: true },
      { id: '3', target: 15000, current: 12450, label: 'Scaling Peak', isCompleted: false },
    ];
  },

  async getSocialEngagement(): Promise<EngagementMetric[]> {
    return [
      { platform: 'TikTok', views: 124500, likes: 8400, comments: 1200, shares: 450, conversionRate: 3.1 },
      { platform: 'Instagram', views: 45200, likes: 3100, comments: 240, shares: 120, conversionRate: 1.2 },
      { platform: 'YouTube', views: 12800, likes: 1500, comments: 180, shares: 90, conversionRate: 4.5 },
    ];
  },

  async getActivityStream(): Promise<ActivityEvent[]> {
    return [
      { id: '1', type: 'sale', platform: 'Etsy', title: 'Sold "Digital Zen Journal" to Sarah Jenkins', timestamp: '10m ago' },
      { id: '2', type: 'post', platform: 'TikTok', title: 'New video "Morning Routine" is trending', timestamp: '2h ago', meta: { link: 'https://tiktok.com', reasoning: 'Engagement velocity is 4.2x above baseline for the morning-routine niche.' } },
      { id: '3', type: 'comment', platform: 'Instagram', title: 'New positive review on "Aesthetic Planner"', timestamp: '4h ago' },
      { id: '4', type: 'production', platform: 'AI', title: 'Drafted 3 New Digital Planner Covers', timestamp: '6h ago', meta: { gateId: 'req_content_1', reasoning: 'Updating visual inventory to stay ahead of the "Sage Green" trend cycle.' } },
      { id: '5', type: 'milestone', platform: 'Empire', title: 'Reached 75% of "Scaling Peak" milestone', timestamp: '1d ago' },
      { id: '6', type: 'research', platform: 'AI', title: 'Completed trend analysis for "Eco-Friendly"', timestamp: '1d ago', meta: { reasoning: 'Identified a 22% gap in "Sustainable Digital Goods" market for Q3.' } },
    ];
  },

  async getPaymentButtons(): Promise<PaymentButton[]> {
    return [
      { id: '1', label: 'Buy Zen Journal', productName: 'Digital Zen Journal', price: 29.99, status: 'active', usageCount: 45, platform: 'Instagram' },
      { id: '2', label: 'Get Planner', productName: 'Aesthetic Planner', price: 15.50, status: 'active', usageCount: 12, platform: 'TikTok' },
      { id: '3', label: 'Support Me', productName: 'Custom Donation', price: 5.00, status: 'active', usageCount: 8, platform: 'All' },
    ];
  },

  async getOpportunityCards() {
    return [
      {
        id: '1',
        title: "TikTok 'Day in the Life' Trend",
        description: "TikTok users are loving 'Day in the Life' videos for planners. Should I draft a script for your 'Zen Journal'?",
        impact: "High",
        metric: "34% niche lift",
        type: "content"
      },
      {
        id: '2',
        title: "Sage Green Color Palette",
        description: "Search volume for 'Sage Green Office' is peaking on Pinterest. I suggest updating your Etsy thumbnails.",
        impact: "Medium",
        metric: "12% search lift",
        type: "optimization"
      }
    ];
  }
};
