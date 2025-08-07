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
import { Analytics, SurveyResponse } from '@/shared/types';
import { computeAnalytics } from '@/shared/utils/analytics';
import { formatDate } from '@/shared/utils/DateTime';

export default function Dashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // fetch survey responses on mount
  useEffect(() => {
    async function fetchSurveyResponses(): Promise<void> {
      const responses = await surveyService.getAll();
      setResponses(responses);

      const analyticsData = computeAnalytics(responses);
      setAnalytics(analyticsData);
    }

    fetchSurveyResponses();
  }, [])

  if (!analytics) return <div className="flex items-center justify-center h-screen w-screen">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>Total Responses: {analytics?.totalResponses}</Card>
        <Card>Avg Satisfaction: {analytics?.avgSatisfaction.toFixed(1)}</Card>
        <Card>NPS score: {analytics?.npsScore}</Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-2">Satisfaction by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.departmentBreakdown}>
              <XAxis dataKey="department" />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip
                formatter={( value: number, name: string, props) => {
                  const { count } = props.payload;
                  return [`${value} (from ${count} responses)`, 'Avg Satisfaction'];
                }}
              />
              <Bar dataKey="avgSatisfaction" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-medium mb-2">NPS Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.npsDistribution}>
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