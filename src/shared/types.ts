export interface Survey {
  name: string;
  satisfaction: number;
  nps: number;
  department: string;
  feedback?: string;
}

export interface SurveyResponse extends Survey {
  id: string;
  submittedAt: string; // ISO date string
}

export interface Analytics {
  totalResponses: number;
  avgSatisfaction: number;
  npsScore: number;
  departmentBreakdown: {
    department: string;
    count: number;
    avgSatisfaction: number;
  }[];
  npsDistribution: {
    nps: number;
    count: number;
  }[];
}