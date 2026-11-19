import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import {
  Globe,
  Users,
  Eye,
  Clock,
  FileCheck,
  UserX,
  Share2,
  Code2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const TRAFFIC_OVER_TIME = [
  { time: '00:00', visitors: 14, pageviews: 38 },
  { time: '04:00', visitors: 8, pageviews: 19 },
  { time: '08:00', visitors: 46, pageviews: 120 },
  { time: '12:00', visitors: 88, pageviews: 245 },
  { time: '16:00', visitors: 94, pageviews: 280 },
  { time: '20:00', visitors: 62, pageviews: 175 },
];

const SOURCE_BREAKDOWN = [
  { name: 'Meta Facebook Ads', value: 45, color: '#EA580C' },
  { name: 'Instagram Reels Ads', value: 28, color: '#EC4899' },
  { name: 'Google Organic Search', value: 15, color: '#3B82F6' },
  { name: 'Direct WhatsApp Links', value: 12, color: '#10B981' },
];

const POPULAR_PAGES = [
  { path: '/projects/luxury-penthouses', views: 420, avgTime: '2m 45s', bounce: '24%' },
  { path: '/floor-plans-and-brochure', views: 310, avgTime: '1m 55s', bounce: '18%' },
  { path: '/pricing-and-emi-calculator', views: 285, avgTime: '3m 10s', bounce: '12%' },
  { path: '/schedule-site-visit', views: 180, avgTime: '1m 30s', bounce: '8%' },
];

export const WebsiteAnalyticsPage: React.FC = () => {
  const { visitors } = useCRM();

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Website Visitor Attribution & Analytics</h2>
          <p className="text-xs text-slate-500">
            Digital ad landing page traffic, visitor session dwell times, and form abandonment telemetry
          </p>
        </div>
      </div>

      {/* Website SDK Integration Status Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Tracking SDK Status
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Demo Mode — Website tracking SDK not connected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sample reverse-IP session telemetry shown below. Production connects via a 1.2KB async snippet.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
          onClick={() =>
            alert(
              'Copy production tracking snippet:\n\n<script async src="https://cdn.yourcrm.com/tracker.js" data-site-id="CRM-PROD-99"></script>'
            )
          }
        >
          View Tracking Snippet
        </Button>
      </div>

      {/* 8 Web KPIs Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <StatCard
          title="Total Visitors"
          value="1,420"
          change="+18%"
          trend="up"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Unique Visitors"
          value="980"
          icon={Users}
          iconColor="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Sessions"
          value="1,840"
          icon={Globe}
          iconColor="text-sky-600 bg-sky-50"
        />
        <StatCard
          title="Avg Session"
          value="3m 24s"
          icon={Clock}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Page Views"
          value="5,210"
          change="+22%"
          trend="up"
          icon={Eye}
          iconColor="text-purple-600 bg-purple-50"
        />
        <StatCard
          title="Form Submissions"
          value="42"
          change="3.4% cvr"
          trend="up"
          icon={FileCheck}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Form Attempts"
          value="68"
          icon={FileCheck}
          iconColor="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Abandonments"
          value="26"
          subtext="38% exit rate"
          icon={UserX}
          iconColor="text-rose-600 bg-rose-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visitors over time */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Hourly Inflow & Page Dwells</h4>
              <p className="text-xs text-slate-500">Live 24-hour visitor distribution</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_OVER_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
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
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#EA580C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVis)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Source Breakdown */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Traffic Source Mix</h4>
            <p className="text-xs text-slate-500 mb-2">Visitor acquisition channels</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SOURCE_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SOURCE_BREAKDOWN.map((entry, index) => (
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
          </div>

          <div className="space-y-1 text-xs border-t border-slate-100 pt-2">
            {SOURCE_BREAKDOWN.map((s) => (
              <div key={s.name} className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Popular Landing Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Marketing Landing Pages</CardTitle>
          <p className="text-xs text-slate-500">Highest intent ad destination URLs</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Page URL Path</th>
                  <th className="p-3">Page Views</th>
                  <th className="p-3">Avg Session Duration</th>
                  <th className="p-3">Bounce Rate</th>
                  <th className="p-3 text-right">Intent Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {POPULAR_PAGES.map((p) => (
                  <tr key={p.path} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-medium text-slate-900">{p.path}</td>
                    <td className="p-3 font-bold text-slate-800 font-mono">{p.views}</td>
                    <td className="p-3 font-mono text-slate-600">{p.avgTime}</td>
                    <td className="p-3 text-slate-600">{p.bounce}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        High Intent
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visitor Activity Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Website Visitor Sessions</CardTitle>
          <p className="text-xs text-slate-500">Sample tracking session records with reverse-IP attribution</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Visitor ID</th>
                  <th className="p-3">Location & Device</th>
                  <th className="p-3">Traffic Attribution</th>
                  <th className="p-3 text-center">Sessions</th>
                  <th className="p-3 text-center">Pages Visited</th>
                  <th className="p-3">Time Spent</th>
                  <th className="p-3">Last Visit</th>
                  <th className="p-3 text-right">Conversion Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map((vis) => (
                  <tr key={vis.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-700">{vis.visitorId}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-900 block">{vis.ipLocation}</span>
                      <span className="text-[11px] text-slate-500">{vis.device}</span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{vis.trafficSource}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{vis.sessions}</td>
                    <td className="p-3 text-center font-bold text-blue-600">{vis.pagesVisited}</td>
                    <td className="p-3 font-mono">{formatDuration(vis.timeSpentSeconds)}</td>
                    <td className="p-3 font-mono text-slate-500">{formatDateTime(vis.lastVisit)}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          vis.leadConvertedStatus === 'converted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : vis.leadConvertedStatus === 'lead_captured'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {vis.leadConvertedStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
