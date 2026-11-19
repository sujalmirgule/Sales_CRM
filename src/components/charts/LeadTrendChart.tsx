import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LeadTrendChartProps {
  className?: string;
}

const DATA_7D = [
  { date: '13 Nov', leads: 6, calls: 14, conversions: 1 },
  { date: '14 Nov', leads: 8, calls: 18, conversions: 2 },
  { date: '15 Nov', leads: 12, calls: 24, conversions: 1 },
  { date: '16 Nov', leads: 9, calls: 20, conversions: 2 },
  { date: '17 Nov', leads: 15, calls: 28, conversions: 3 },
  { date: '18 Nov', leads: 11, calls: 26, conversions: 2 },
  { date: '19 Nov (Today)', leads: 7, calls: 16, conversions: 1 },
];

const DATA_30D = [
  { date: 'Week 1', leads: 42, calls: 88, conversions: 6 },
  { date: 'Week 2', leads: 54, calls: 110, conversions: 8 },
  { date: 'Week 3', leads: 68, calls: 145, conversions: 11 },
  { date: 'Week 4 (Current)', leads: 58, calls: 122, conversions: 9 },
];

const DATA_90D = [
  { date: 'Sep 2026', leads: 180, calls: 420, conversions: 24 },
  { date: 'Oct 2026', leads: 220, calls: 510, conversions: 31 },
  { date: 'Nov 2026 (MTD)', leads: 222, calls: 465, conversions: 34 },
];

export const LeadTrendChart: React.FC<LeadTrendChartProps> = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const data = period === '7d' ? DATA_7D : period === '30d' ? DATA_30D : DATA_90D;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Lead Inflow vs Calling Activity</h4>
          <p className="text-xs text-slate-500">Volume correlation across digital marketing channels</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
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
            <Area
              type="monotone"
              dataKey="leads"
              name="Inbound Leads"
              stroke="#EA580C"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLeads)"
            />
            <Area
              type="monotone"
              dataKey="calls"
              name="Outbound Calls"
              stroke="#2563EB"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCalls)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
