import Card from '@/shared/components/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { surveyService } from '@/shared/services/survey';
import { SurveyResponse } from '@/shared/types';


function calculateAverages(responses: SurveyResponse[]) {
  const total = responses.length;
  const avgSatisfaction = responses.reduce((sum, r) => sum + Number(r.satisfaction), 0) / total;
  const npsScore = calculateNPS(responses)
  return { total, avgSatisfaction, npsScore };
}

function departmentSatisfaction(responses: SurveyResponse[]) {
  const map: Record<string, { total: number; count: number }> = {};
  responses.forEach((r) => {
    if (!map[r.department]) map[r.department] = { total: 0, count: 0 };
    map[r.department].total += Number(r.satisfaction);
    map[r.department].count++;
  });
  return Object.entries(map).map(([department, { total, count }]) => ({
    department,
    avgSatisfaction: (total / count).toFixed(2),
  }));
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

function npsDistribution(data: SurveyResponse[]) {
  if (data.length === 0) return [];

  const bins: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) bins[i] = 0;
  data.forEach((r) => bins[r.nps]++);
  return Object.entries(bins).map(([nps, count]) => ({ nps: Number(nps), count }));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}


export default function Dashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  const { total, avgSatisfaction, npsScore } = calculateAverages(responses);
  const deptData = departmentSatisfaction(responses);
  const npsData = npsDistribution(responses);

  async function fetchSurveyResponses(): Promise<void> {
    const responses = await surveyService.getAll();
    setResponses(responses);
  }

  // fetch survey responses on mount
  useEffect(() => {
    fetchSurveyResponses();
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>Total Responses: {total}</Card>
        <Card>Avg Satisfaction: {avgSatisfaction.toFixed(1)}</Card>
        <Card>NPS score: {npsScore.toFixed(1)}</Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-2">Satisfaction by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData}>
              <XAxis dataKey="department" />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip />
              <Bar dataKey="avgSatisfaction" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-medium mb-2">NPS Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={npsData}>
              <XAxis dataKey="nps" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="font-medium mb-2">Latest Responses (Latest 10)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 w-[15%]">Date</th>
              <th className="p-2">Department</th>
              <th className="p-2 text-center">Satisfaction</th>
              <th className="p-2 text-center">NPS</th>
              <th className="p-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {responses.slice(0,10).map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{formatDate(r.submittedAt)}</td>
                <td className="p-2">{r.department}</td>
                <td className="p-2 text-center">{r.satisfaction}</td>
                <td className="p-2 text-center">{r.nps}</td>
                <td className="p-2">{r.feedback || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}