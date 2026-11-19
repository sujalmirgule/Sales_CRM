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

export const StaffPerfChart: React.FC = () => {
  const { staffMembers, leads, calls, sales } = useCRM();

  const data = staffMembers.map((staff) => {
    const staffLeads = leads.filter((l) => l.assignedStaffId === staff.id);
    const staffCalls = calls.filter((c) => c.staffId === staff.id);
    const staffSales = sales.filter((s) => s.assignedStaffId === staff.id);
    const connected = staffCalls.filter((c) => ['completed', 'answered'].includes(c.status)).length;

    return {
      name: staff.name.split(' ')[0], // first name for clean label
      fullName: staff.name,
      leads: staffLeads.length,
      calls: staffCalls.length,
      connected: connected,
      conversions: staffSales.length,
    };
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Sales Staff Productivity</h4>
          <p className="text-xs text-slate-500">Lead distribution vs actual call attempts & closed deals</p>
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
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="leads" name="Assigned Leads" fill="#94A3B8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="calls" name="Total Calls" fill="#2563EB" radius={[3, 3, 0, 0]} />
            <Bar dataKey="connected" name="Connected Calls" fill="#16A34A" radius={[3, 3, 0, 0]} />
            <Bar dataKey="conversions" name="Deals Closed" fill="#EA580C" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
