export interface Survey {
  satisfaction: number;
  nps: number;
  department: string;
  feedback?: string;
}

export interface SurveyResponse extends Survey {
  id: string;
  submittedAt: string; // ISO date string
}

export interface SurveyPayload extends Survey {
  id: string;
  submittedAt: string; // ISO date string
}

export interface Analytics {
  totalResponses: number;
  avgSatisfaction: number;
  avgNPS: number;
  departmentBreakdown: {
    department: string;
    count: number;
    avgSatisfaction: number;
  }[];
}