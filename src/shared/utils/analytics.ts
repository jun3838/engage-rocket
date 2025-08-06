import { SurveyResponse, Analytics } from '@/shared/types';

function generateNPSDistribution(data: SurveyResponse[]) {
  if (data.length === 0) return [];

  const bins: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) bins[i] = 0;
  data.forEach((r) => bins[r.nps]++);
  return Object.entries(bins).map(([nps, count]) => ({ nps: Number(nps), count }));
}

function calculateNPS(responses: SurveyResponse[]): number {
  if (responses.length === 0) return 0;

  let promoters = 0;
  let detractors = 0;

  for (const r of responses) {
    if (Number(r.nps) >= 9) promoters++;
    else if (Number(r.nps) <= 6) detractors++;
  }

  const npsScore = ((promoters - detractors) / responses.length) * 100;
  return Math.round(npsScore);
}

function generateDepartmentSatisfaction(responses: SurveyResponse[]) {
  const map: Record<string, { total: number; count: number }> = {};
  responses.forEach((r) => {
    if (!map[r.department]) map[r.department] = { total: 0, count: 0 };
    map[r.department].total += Number(r.satisfaction);
    map[r.department].count++;
  });
  return Object.entries(map).map(([department, { total, count }]) => ({
    department,
    count,
    avgSatisfaction: Number((total / count).toFixed(2)),
  }));
}

export function computeAnalytics(responses: SurveyResponse[]): Analytics {
  const totalResponses = responses.length;
  const avgSatisfaction = responses.reduce((sum, r) => sum + Number(r.satisfaction), 0) / totalResponses;
  const npsScore = calculateNPS(responses)

  const departmentBreakdown = generateDepartmentSatisfaction(responses);
  const npsDistribution = generateNPSDistribution(responses);

  return {
    totalResponses,
    avgSatisfaction,
    avgNPS: npsScore,
    departmentBreakdown,
    npsDistribution,
  };
}
