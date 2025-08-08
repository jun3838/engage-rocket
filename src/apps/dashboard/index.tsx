import Card from '@/shared/components/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

import useSurveyService from '@/shared/services/survey';
import { Analytics, SurveyResponse } from '@/shared/types';
import { computeAnalytics } from '@/shared/utils/analytics';
import { ROUTES } from '@/shared/routes';
import Button from '@/shared/components/Button';
import ResponseTable from '@/apps/dashboard/components/ResponseTable';

export default function Dashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const { getResponse } = useSurveyService();

  // fetch survey responses on mount
  useEffect(() => {
    async function fetchSurveyResponses(): Promise<void> {
      const responses = await getResponse();
      setResponses(responses);

      const analyticsData = computeAnalytics(responses);
      setAnalytics(analyticsData);
    }

    fetchSurveyResponses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!analytics) return <div className="flex items-center justify-center h-screen w-screen">Loading...</div>

  if (analytics.totalResponses === 0) return <div className="flex items-center justify-center h-screen w-screen">
    <div className="grid gap-2">
      <div className="text-center">No responses yet.</div>
      <Button>
        <NavLink to={ROUTES.SURVEY}>Add response here</NavLink>
      </Button>
    </div>
  </div>

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

      <ResponseTable responses={responses} />
    </div>
  );
}