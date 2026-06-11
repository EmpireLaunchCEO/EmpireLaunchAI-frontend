import { API_URL } from '@/lib/config';

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

const HEADERS = {
  'Authorization': 'Bearer mock-mobile-token',
  'x-user-id': '00000000-0000-0000-0000-000000000000',
  'Content-Type': 'application/json'
};

export const empireService = {
  async getEmpire(id: string): Promise<any> {
    try {
      if (!id || id === 'undefined') return this.getLatestEmpire();
      
      // Mock data for Business 2 and 3 if they don't exist yet
      if (id === '2') {
        return { id: '2', name: 'Empire Two', description: 'Empire Niche: . Angle: . Mode: co-pilot' };
      }
      if (id === '3') {
        return { id: '3', name: 'Empire Three', description: 'Empire Niche: . Angle: . Mode: co-pilot' };
      }

      const res = await fetch(`${API_URL}/api/agent/empire/${id}`, { headers: HEADERS });
      if (res.ok) return await res.json();
      
      return this.getLatestEmpire();
    } catch (e) {
      console.error('Empire Fetch Error:', e);
      return this.getLatestEmpire();
    }
  },

  async getLatestEmpire(): Promise<any> {
    try {
      const res = await fetch(`${API_URL}/api/agent/goal/latest`, { headers: HEADERS });
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      console.error('Latest Empire Fetch Error:', e);
      return null;
    }
  },

  async updateEmpire(id: string, data: { title?: string; description?: string; name?: string; niche?: string; angle?: string }): Promise<any> {
    try {
      const res = await fetch(`${API_URL}/api/agent/goal/${id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      console.error('Empire Update Error:', e);
      return null;
    }
  }
};

export const socialProofService = {
  async getPendingApprovals(): Promise<AppRating[]> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/flagged/00000000-0000-0000-0000-000000000000`, { headers: HEADERS });
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
        headers: HEADERS,
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
        headers: HEADERS,
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
        headers: HEADERS,
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
      const res = await fetch(`${API_URL}/api/discovery/pending`, { headers: HEADERS }).catch(() => null);
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
      const res = await fetch(`${API_URL}/api/revenue/infrastructure`, { headers: HEADERS });
      if (res.ok) return await res.json();
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
       const res = await fetch(`${API_URL}/api/approvals/pending`, { headers: HEADERS }).catch(() => null);
       if (res && res.ok) return await res.json();
    } catch(e) {}
    return [];
  },

  async respond(id: string, status: 'approved' | 'rejected', details?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/approvals/${id}/respond`, { 
        method: 'POST', 
        headers: HEADERS,
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
      const res = await fetch(`${API_URL}/api/reviews/pulse`, { headers: HEADERS });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { score: 88, velocity: 92, sentiment: 85, agility: 82 };
  },
  async getSentimentMap(): Promise<SentimentPoint[]> {
    try {
      const res = await fetch(`${API_URL}/api/reviews/sentiment`, { headers: HEADERS });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },
  async getInboxDrafts(): Promise<InboxDraft[]> {
    try {
      const res = await fetch(`${API_URL}/api/retention/drafts`, { headers: HEADERS });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },
  async respondToDraft(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/retention/respond`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ id, status })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};

export const analyticsService = {
  async getEmpirePulse(): Promise<EmpirePulseState> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/pulse`, { headers: HEADERS });
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
      const res = await fetch(`${API_URL}/api/analytics/pulse`, { headers: HEADERS });
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
      const res = await fetch(`${API_URL}/api/analytics/transactions`, { headers: HEADERS });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getRevenueMilestones(): Promise<RevenueMilestone[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/milestones`, { headers: HEADERS });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getSocialEngagement(): Promise<EngagementMetric[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/engagement`, { headers: HEADERS });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getActivityStream(): Promise<ActivityEvent[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/activity`, { headers: HEADERS });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  },

  async getPaymentButtons(): Promise<PaymentButton[]> {
    return [];
  },

  async getOpportunityCards() {
    return [];
  },

  async getStrategySuggestions(): Promise<any[]> {
    try {
      const res = await fetch(`${API_URL}/api/analytics/strategies`, { headers: HEADERS });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {}
    return [];
  }
};
