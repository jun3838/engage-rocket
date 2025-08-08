import { SurveyResponse, Analytics } from '@/shared/types';

/**
 * Generates a distribution of NPS scores (0–10) as a histogram data structure.
 * Each score key maps to the count of how many users selected it.
 */
function generateNPSDistribution(data: SurveyResponse[]) {
  if (data.length === 0) return [];

  const bins: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) bins[i] = 0;
  data.forEach((r) => bins[r.nps]++);
  return Object.entries(bins).map(([nps, count]) => ({ nps: Number(nps), count }));
}

/**
 * Calculates NPS from responses.
 * Promoters (9–10), Detractors (0–6), NPS = %Promoters - %Detractors
 */
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

/**
 * Get the average satisfaction score per department.
 * Returns an array with department name, number of responses, and average score.
 */
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

/**
 * Computes summary analytics from a list of survey responses.
 * Includes total count, average satisfaction, NPS score,
 * department breakdown, and NPS score distribution.
 */
export function computeAnalytics(responses: SurveyResponse[]): Analytics {
  const totalResponses = responses.length;
  const avgSatisfaction = totalResponses
    ? responses.reduce((sum, r) => sum + Number(r.satisfaction), 0) / totalResponses
    : 0
  const npsScore = calculateNPS(responses)

  const departmentBreakdown = generateDepartmentSatisfaction(responses);
  const npsDistribution = generateNPSDistribution(responses);

  return {
    totalResponses,
    avgSatisfaction,
    npsScore,
    departmentBreakdown,
    npsDistribution,
  };
}
