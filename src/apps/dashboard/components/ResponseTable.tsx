import { IoIosArrowRoundUp } from 'react-icons/io';
import { useMemo, useState } from "react";

import { SurveyResponse } from "@/shared/types";
import Card from "@/shared/components/Card";
import { formatDate } from "@/shared/utils/date-time";
import classes from '@/apps/dashboard/components/ResponseTable.module.css';

type SortDirection = 'asc' | 'desc';

export default function ResponseTable({ responses }: { responses: SurveyResponse[] }) {
  const [sortBy, setSortBy] = useState<keyof SurveyResponse>('submittedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedResponses = useMemo(() => {
    const sorted = [...responses].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [responses, sortBy, sortDirection]);

  function toggleSort(column: keyof SurveyResponse) {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  }

  function sortableHeader(label: string, key: keyof SurveyResponse, className?: string) {
    const isActive = sortBy === key;
    const iconClass = isActive
      ? sortDirection === 'asc'
        ? 'text-gray-500'
        : 'rotate-180 text-gray-500'
      : 'opacity-0';

    return (
      <th
        onClick={() => toggleSort(key)}
        className={className}
      >
        <div className="flex items-center gap-1">
          {label}
          <IoIosArrowRoundUp className={`w-4 h-4 transition-transform ${iconClass}`} />
        </div>
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Responses (Latest 10)</h2>
        <div className="overflow-x-auto">
          <table className={`min-w-full text-sm ${classes.tableStyle}`}>
            <thead>
              <tr className="text-left">
                {sortableHeader('Data', 'submittedAt', 'w-[15%]')}
                {sortableHeader('Name', 'name', 'w-[20%]')}
                {sortableHeader('Department', 'department', 'w-[20%]')}
                {sortableHeader('Satisfaction', 'satisfaction', 'w-[50px] text-center')}
                {sortableHeader('NPS', 'nps', 'w-[100px] text-center')}
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {sortedResponses.slice(0, 10).map((r) => (
                <tr key={r.id}>
                  <td className="p3">{formatDate(r.submittedAt)}</td>
                  <td>{r.name}</td>
                  <td>{r.department}</td>
                  <td className="text-center">{r.satisfaction}</td>
                  <td className="text-center">{r.nps}</td>
                  <td>{r.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}