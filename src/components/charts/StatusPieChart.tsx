import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCRM } from '../../context/CRMContext';

export const StatusPieChart: React.FC = () => {
  const { leads } = useCRM();

  const countByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'New Leads', value: countByStatus['new'] || 0, color: '#EA580C' },
    { name: 'Assigned', value: countByStatus['assigned'] || 0, color: '#3B82F6' },
    { name: 'Contacted', value: countByStatus['contacted'] || 0, color: '#64748B' },
    { name: 'Interested', value: countByStatus['interested'] || 0, color: '#F59E0B' },
    { name: 'Follow-up', value: countByStatus['followup'] || 0, color: '#8B5CF6' },
    { name: 'Converted', value: countByStatus['converted'] || 0, color: '#10B981' },
    { name: 'Lost / Inactive', value: (countByStatus['lost'] || 0) + (countByStatus['not_connected'] || 0), color: '#EF4444' },
  ].filter((d) => d.value > 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Lead Pipeline Distribution</h4>
          <p className="text-xs text-slate-500">Live stage breakdown of active prospects</p>
        </div>
      </div>

      <div className="h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: '#334155',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2 pt-2 border-t border-slate-100 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate max-w-[100px]">{item.name}</span>
            </span>
            <span className="font-semibold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
