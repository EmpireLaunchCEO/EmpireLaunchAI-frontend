export interface EmpireHealth {
  growthScore: number;
  revenue: number;
  pendingDues: number;
  platformBreakdown: {
    platform: string;
    revenue: number;
  }[];
}

export const analyticsService = {
  async getEmpireHealth(): Promise<EmpireHealth> {
    // In a real app, this would be:
    // const res = await fetch(`${API_URL}/api/analytics/empire-health`);
    // return res.json();
    
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
