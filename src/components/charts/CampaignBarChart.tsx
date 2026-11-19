import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';

export const CampaignBarChart: React.FC = () => {
  const { campaigns } = useCRM();

  const data = campaigns.map((c) => ({
    name: c.name.split('—')[0].trim().substring(0, 15),
    fullName: c.name,
    leads: c.totalLeads,
    conversions: c.conversions,
    cpl: c.costPerLead,
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Campaign Lead Yield & Conversions</h4>
          <p className="text-xs text-slate-500">Facebook vs Instagram vs Search Ad sets</p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
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
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="leads" name="Total Inbound Leads" fill="#EA580C" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" name="Final Bookings" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
