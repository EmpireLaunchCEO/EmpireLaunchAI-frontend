import { API_URL } from '@/lib/config';

// --- Retry helper with exponential backoff for 429 responses ---
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let lastResponse: Response | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    lastResponse = res;
    if (attempt < maxRetries) {
      const delay = Math.min(Math.pow(2, attempt) * 1000 + Math.random() * 1000, 8000);
      console.warn(`[fetchWithRetry] 429 rate limited, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  // Exhausted retries — return the last 429 response so callers can handle it
  return lastResponse!;
}

async function fetchJSON(url: string, options: RequestInit = {}): Promise<any> {
  const res = await fetchWithRetry(url, options);
  if (!res.ok) {
    // For 429, throw so callers can handle rate-limiting explicitly
    if (res.status === 429) {
      throw new Error('Rate limited');
    }
    return null;
  }
  return res.json();
}

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
  subscribers: number;
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

const USER_ID = (() => {
  if (typeof window !== 'undefined') {
    let id = localStorage.getItem('empire_user_id');
    if (!id) {
      id = '00000000-0000-0000-0000-000000000000';
      localStorage.setItem('empire_user_id', id);
    }
    return id;
  }
  return '00000000-0000-0000-0000-000000000000';
})();

// Generate a real session token on first load — no mock tokens
const getAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) {
      token = crypto.randomUUID(); // Real UUID, not a mock
      localStorage.setItem('empire_auth_token', token);
    }
    return token;
  }
  return '';
};

const getHeaders = (): Record<string, string> => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'x-user-id': USER_ID,
  'Content-Type': 'application/json'
});

export const empireService = {
  async getEmpire(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_URL}/api/agent/empire/${id}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('[empireService.getEmpire] fetch failed, falling back to getLatestEmpire', e);
    }
    return this.getLatestEmpire();
  },

  async getLatestEmpire(): Promise<any> {
    try {
      const res = await fetch(`${API_URL}/api/agent/goal/latest`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (res.ok) return res.json();
    } catch (e) {
      console.warn('[empireService.getLatestEmpire] fetch failed', e);
    }
    return null;
  },

  async updateEmpire(id: string, data: Record<string, string>): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/agent/empire/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch (e: any) {
      alert(`POST threw: ${e.message}`);
      return false;
    }
  }
};

export const socialProofService = {
  async getPendingApprovals(): Promise<AppRating[]> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/flagged/00000000-0000-0000-0000-000000000000`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          review: r.comment,
          userName: 'CEO', 
          status: r.status || 'pending',
          createdAt: r.created_at
        }));
      }
    } catch (e) {
      console.error('Failed to fetch flagged reviews', e);
    }
    return [];
  },

  async submitRating(rating: number, comment: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          userId: '00000000-0000-0000-0000-000000000000',
          rating,
          comment
        })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async approveForMarketing(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/approve`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          userId: '00000000-0000-0000-0000-000000000000',
          reviewId: id
        })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async reject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/reject`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          userId: '00000000-0000-0000-0000-000000000000',
          reviewId: id
        })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};

export interface InfrastructureBalance {
  platform: string;
  balance: number;
  currency: string;
  status: 'active' | 'low' | 'depleted' | 'unknown';
}

export const discoveryService = {
  async getPendingResults(): Promise<DiscoveryResult[]> {
    try {
      const res = await fetch(`${API_URL}/api/discovery/pending`, { headers: getHeaders() }).catch(() => null);
      if (res && res.ok) return await res.json();
    } catch(e) {}
    
    return [];
  },
  async approveResult(id: string): Promise<boolean> { return true; },
  async rejectResult(id: string): Promise<boolean> { return true; }
};

export const infrastructureService = {
  async getBalances(): Promise<InfrastructureBalance[]> {
    try {
      const res = await fetch(`${API_URL}/api/revenue/infrastructure`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        // Backend returns { balances: [...], subscriptions: [...] } — extract the array
        return Array.isArray(data) ? data : (data.balances || []);
      }
    } catch (e) {
      console.error('Failed to fetch infrastructure balances', e);
    }
    return [];
  }
};

export interface DesignTask {
  id: string;
  title: string;
  platform: string;
  status: 'blueprint_ready' | 'producing' | 'editing' | 'drafting' | 'completed' | 'review_required';
  dueDate: string;
}

export interface CreativeBlueprintData {
  id: string;
  title: string;
  intelligence: string;
  palette: string[];
  fonts: { platform: string; pairing: string }[];
  script: string[];
  compositionUrl: string;
  variations: any[];
  platformLink?: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'blueprint' | 'dna' | 'content' | 'golive';
  payload: any;
}

export interface TrustScore {
  score: number;
  velocity: number;
  sentiment: number;
  agility: number;
}

export interface SentimentPoint {
  x: number;
  y: number;
  sentiment: number;
  score: number;
  date: string;
  label: string;
}

export interface InboxDraft {
  id: string;
  subject: string;
  to: string;
  body: string;
  type: string;
  customer: string;
  platform: string;
  reasoning?: string;
  status: 'pending' | 'sent' | 'rejected';
}

export const creativeService = {
  async getDesignTasks(): Promise<DesignTask[]> {
    return [
      { id: 'dt_1', title: 'Vintage Botanical Journal Cover', platform: 'Kittl', status: 'blueprint_ready', dueDate: 'Today' }
    ];
  },
  async getBlueprint(taskId: string): Promise<CreativeBlueprintData> {
    return {
      id: taskId,
      title: 'Vintage Botanical Journal Cover',
      intelligence: 'Matches current 2024 trend.',
      palette: ['#2D4F1E', '#E4D5B7'],
      fonts: [],
      script: [],
      compositionUrl: '',
      variations: []
    };
  }
};

export const approvalService = {
  async getPendingRequests(): Promise<ApprovalRequest[]> {
    try {
       const res = await fetch(`${API_URL}/api/approvals/pending`, { headers: getHeaders() }).catch(() => null);
       if (res && res.ok) return await res.json();
    } catch(e) {}
    return [];
  },

  async respond(id: string, status: 'approved' | 'rejected', details?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/approvals/${id}/respond`, { 
        method: 'POST', 
        headers: getHeaders(),
        body: JSON.stringify({ status, details }) 
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};

export const retentionService = {
  async getTrustPulse(): Promise<TrustScore> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/pulse`, { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { score: 88, velocity: 92, sentiment: 85, agility: 82 };
  },
  async getSentimentMap(): Promise<SentimentPoint[]> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/sentiment`, { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },
  async getInboxDrafts(): Promise<InboxDraft[]> {
    try {
      const res = await fetch(`${API_URL}/api/retention/drafts`, { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },
  async respondToDraft(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/retention/respond`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id, status })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};

export interface CreatePaymentButtonRequest {
  name: string;
  description: string;
  priceInCents: number;
  buttonText?: string;
  buttonColor?: string;
}

export interface StripeOnboardingResult {
  url: string;
}

export interface StripeAccountStatus {
  connected: boolean;
  charges_enabled?: boolean;
  payouts_enabled?: boolean;
}

export const paymentService = {
  /**
   * Initiate Stripe Connect onboarding for the user
   */
  async onboardStripe(): Promise<StripeOnboardingResult> {
    const res = await fetch(`${API_URL}/api/stripe/onboard`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Stripe onboarding failed');
    return res.json();
  },

  /**
   * Check Stripe Connect account status
   */
  async getStripeStatus(): Promise<StripeAccountStatus> {
    try {
      const res = await fetch(`${API_URL}/api/stripe/status`, { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { connected: false };
  },

  /**
   * Create a payment link (simpler than full button)
   */
  async createPaymentLink(name: string, description: string, priceInCents: number): Promise<{ url: string; productId: string }> {
    const res = await fetch(`${API_URL}/api/stripe/payment-link`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description, priceInCents }),
    });
    if (!res.ok) throw new Error('Payment link creation failed');
    return res.json();
  },

  /**
   * Create a full payment button with custom styling
   */
  async createPaymentButton(data: CreatePaymentButtonRequest): Promise<{ id: string; url: string }> {
    const res = await fetch(`${API_URL}/api/stripe/payment-button`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Payment button creation failed');
    return res.json();
  },

  /**
   * Create a platform checkout session (for subscription payments)
   */
  async createPlatformCheckout(returnUrl: string): Promise<{ url: string }> {
    const res = await fetch(`${API_URL}/api/stripe/checkout/platform`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ returnUrl }),
    });
    if (!res.ok) throw new Error('Checkout session creation failed');
    return res.json();
  },

  /**
   * Verify a platform payment session
   */
  async verifyPlatformPayment(sessionId: string): Promise<{ status: string }> {
    const res = await fetch(`${API_URL}/api/stripe/verify/platform?sessionId=${sessionId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Payment verification failed');
    return res.json();
  },

  /**
   * Generate a protected proxy URL for a payment button
   * POST /api/payment-buttons/protected/generate
   */
  async generateProtectedUrl(payload: {
    userId: string;
    productId: string;
    platform: string;
    isSingleUse?: boolean;
  }): Promise<{ proxyUrl: string }> {
    const res = await fetch(`${API_URL}/api/payment-buttons/protected/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Generation failed' }));
      throw new Error(err.error || 'Failed to generate protected URL');
    }
    return res.json();
  },
};
  export const analyticsService = {
  async getEmpirePulse(): Promise<EmpirePulseState> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/pulse`, { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      status: 'idle',
      description: 'Awaiting platform link...',
      progress: 0,
      logs: ['[SYSTEM] Neural Node standby. Waiting for platform data...']
    };
  },

  async getEmpireHealth(): Promise<EmpireHealth> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/pulse`, { headers: getHeaders() });
      if (res.ok) {
         const data = await res.json();
         return {
           growthScore: data.progress || 0,
           revenue: data.health?.revenue || 0,
           pendingDues: data.health?.pendingDues || 0,
           subscribers: data.health?.subscribers || 0,
           platformBreakdown: data.health?.platformBreakdown || []
         };
      }
    } catch (e) {}

    return { growthScore: 0, revenue: 0, pendingDues: 0, subscribers: 0, platformBreakdown: [] };
  },

  async getRevenueTransactions(): Promise<RevenueTransaction[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/transactions`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getRevenueMilestones(): Promise<RevenueMilestone[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/milestones`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getSocialEngagement(): Promise<EngagementMetric[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/engagement`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getActivityStream(): Promise<ActivityEvent[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/activity`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getPaymentButtons(): Promise<PaymentButton[]> {
    try {
      const res = await fetch(`${API_URL}/api/payment-buttons?userId=00000000-0000-0000-0000-000000000000`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return (data.buttons || []).map((b: any) => ({
          id: b.id,
          label: b.buttonData?.label || b.label || 'Buy Now',
          productName: b.productName || b.productId || 'Product',
          price: b.priceInCents ? (b.priceInCents / 100) : (b.price || 0),
          status: b.status || 'active',
          usageCount: b.clicks || b.usageCount || 0,
          platform: b.platform || 'general',
        }));
      }
    } catch (e) {}
    return [];
  },

  async getOpportunityCards() {
    return [];
  },

  async getStrategySuggestions(): Promise<any[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/strategies`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },
  
  async getIntelTrends(params: { niche?: string; angle?: string; targetCustomers?: string; businessGoals?: string }): Promise<{
    trendingThemes: string[];
    seasonalOpportunities: string[];
    hotSellingItems: string[];
    lowCompetitionItems: string[];
    contentIdeas: string[];
  }> {
    try {
      const query = new URLSearchParams();
      if (params.niche) query.set('niche', params.niche);
      if (params.angle) query.set('angle', params.angle);
      if (params.targetCustomers) query.set('targetCustomers', params.targetCustomers);
      if (params.businessGoals) query.set('businessGoals', params.businessGoals);
      const res = await fetch(`${API_URL}/api/intel/trends?${query.toString()}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return {
          trendingThemes: data.trendingThemes || [],
          seasonalOpportunities: data.seasonalOpportunities || [],
          hotSellingItems: data.hotSellingItems || [],
          lowCompetitionItems: data.lowCompetitionItems || [],
          contentIdeas: data.contentIdeas || [],
        };
      }
    } catch (e) {
      console.error('Failed to fetch intel trends', e);
    }
    return { trendingThemes: [], seasonalOpportunities: [], hotSellingItems: [], lowCompetitionItems: [], contentIdeas: [] };
  },
  
  async fetchLibraryAssets(): Promise<any[]> {
    try {
      const res = await fetch(`${API_URL}/api/studio/assets`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : data.assets || [];
      }
    } catch (e) {
      console.error('Failed to fetch library assets', e);
    }
    return [];
  },
  
  async updateAssetName(assetId: string, name: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/studio/assets/${assetId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ title: name })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to update asset name', e);
      return false;
    }
  }
};

export const onboardingService = {
  async startOnboarding(platform: string, credentials?: { email?: string; password?: string; handle?: string }): Promise<any> {
    const res = await fetch(`${API_URL}/api/onboarding/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        userId: '00000000-0000-0000-0000-000000000000',
        platform,
        credentials
      }),
    });
    if (!res.ok) throw new Error('Onboarding failed to start');
    return res.json();
  },
  async getStatus(sessionId: string): Promise<any> {
    const res = await fetch(`${API_URL}/api/onboarding/status/${sessionId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to get onboarding status');
    return res.json();
  }
};
