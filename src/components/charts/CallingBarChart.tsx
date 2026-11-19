import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';

export const CallingBarChart: React.FC = () => {
  const { calls } = useCRM();

  const counts = calls.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'Connected', count: (counts['completed'] || 0) + (counts['answered'] || 0), color: '#16A34A' },
    { name: 'No Answer', count: counts['no_answer'] || 0, color: '#D97706' },
    { name: 'Busy', count: counts['busy'] || 0, color: '#F59E0B' },
    { name: 'Failed / Off', count: counts['failed'] || 0, color: '#DC2626' },
    { name: 'Rejected', count: (counts['cancelled'] || 0) + (counts['rejected'] || 0), color: '#64748B' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Calling Dispositions</h4>
          <p className="text-xs text-slate-500">Call connection rates and termination outcomes</p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: '#334155',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" name="Total Calls" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
