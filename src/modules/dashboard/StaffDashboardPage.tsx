import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SourceBadge } from '../../components/common/SourceBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Users,
  CalendarClock,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  Clock,
  CheckCircle2,
  Sparkles,
  PhoneOutgoing,
} from 'lucide-react';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const StaffDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    accessibleLeads,
    accessibleCalls,
    accessibleFollowUps,
    staffKPIs,
    openCallModal,
    completeFollowUp,
  } = useCRM();
  const navigate = useNavigate();

  const myRecentLeads = accessibleLeads.slice(0, 6);
  const myPendingFollowUps = accessibleFollowUps.filter((f) => f.status === 'pending').slice(0, 5);
  const myRecentCalls = accessibleCalls.slice(0, 5);

  const personalDailyData = [
    { day: 'Mon', calls: 14, connected: 10 },
    { day: 'Tue', calls: 18, connected: 13 },
    { day: 'Wed', calls: 22, connected: 16 },
    { day: 'Thu', calls: 19, connected: 12 },
    { day: 'Fri (Today)', calls: accessibleCalls.length, connected: staffKPIs.connectedCalls },
  ];

  return (
    <div className="space-y-6">
      {/* Staff Personal Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                Sales Rep Workspace
              </span>
              <span className="text-xs text-emerald-600 font-semibold">● Active Work Session</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">Welcome back, {currentUser.name}!</h2>
            <p className="text-xs text-slate-500">
              Department: {currentUser.department} • Individual Performance Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/followups')}>
            <CalendarClock className="w-3.5 h-3.5 mr-1" /> My Follow-ups ({staffKPIs.pendingFollowUps})
          </Button>
          <Button variant="brand" size="sm" onClick={() => navigate('/leads')}>
            <Users className="w-3.5 h-3.5 mr-1" /> Open My Lead Roster
          </Button>
        </div>
      </div>

      {/* 8 Staff Personal KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="My Assigned Leads"
          value={staffKPIs.myTotalLeads}
          subtext="Active in my funnel"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="Today's Leads"
          value={staffKPIs.todayLeads}
          subtext="Fresh inquiries"
          icon={Sparkles}
          iconColor="text-amber-600 bg-amber-50"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="Pending Follow-ups"
          value={staffKPIs.pendingFollowUps}
          subtext="Scheduled calls due"
          icon={CalendarClock}
          iconColor="text-orange-600 bg-orange-50"
          onClick={() => navigate('/followups')}
        />
        <StatCard
          title="Total Call Attempts"
          value={staffKPIs.totalAttempts}
          subtext="Outbound dials"
          icon={PhoneCall}
          iconColor="text-indigo-600 bg-indigo-50"
          onClick={() => navigate('/calling')}
        />
        <StatCard
          title="Connected Calls"
          value={staffKPIs.connectedCalls}
          subtext="Client answered"
          icon={PhoneIncoming}
          iconColor="text-emerald-600 bg-emerald-50"
          onClick={() => navigate('/calling')}
        />
        <StatCard
          title="Non-Connected Calls"
          value={staffKPIs.nonConnectedCalls}
          subtext="Busy / No answer"
          icon={PhoneOff}
          iconColor="text-rose-600 bg-rose-50"
          onClick={() => navigate('/calling')}
        />
        <StatCard
          title="My Talk Time"
          value={formatDuration(staffKPIs.totalTalkTimeSeconds)}
          subtext="Cumulative tele-time"
          icon={Clock}
          iconColor="text-purple-600 bg-purple-50"
        />
        <StatCard
          title="My Closed Deals"
          value={staffKPIs.convertedLeads}
          subtext="Realized bookings"
          icon={CheckCircle2}
          iconColor="text-emerald-700 bg-emerald-100"
        />
      </div>

      {/* Main Grid: My Leads + Daily Calling Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* My Assigned Leads Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Inbound Leads Priority Queue</CardTitle>
              <p className="text-xs text-slate-500">Only showing leads assigned exclusively to your profile</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
              View All ({accessibleLeads.length}) →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Source</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Priority</th>
                    <th className="pb-2">Attempts</th>
                    <th className="pb-2 text-right">Quick Dial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRecentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="font-bold text-slate-900 hover:text-brand-600 text-left"
                        >
                          {lead.customerName}
                        </button>
                        <p className="text-[11px] text-slate-500 font-mono">{lead.phone}</p>
                      </td>
                      <td className="py-2.5">
                        <SourceBadge source={lead.source} size="sm" />
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>
                      <td className="py-2.5">
                        <PriorityBadge priority={lead.priority} size="sm" />
                      </td>
                      <td className="py-2.5 font-semibold text-slate-700">
                        {lead.totalAttempts || 0}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="brand"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => openCallModal(lead)}
                        >
                          <PhoneOutgoing className="w-3 h-3 mr-1" /> Call
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* My Performance Chart */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Weekly Calling Pace</h4>
            <p className="text-xs text-slate-500 mb-3">Daily dials vs successful client connections</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personalDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
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
                  <Bar dataKey="calls" name="Total Calls" fill="#94A3B8" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="connected" name="Connected" fill="#16A34A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Connection Rate:</span>
            <span className="font-bold text-emerald-600">
              {staffKPIs.totalAttempts > 0
                ? `${Math.round((staffKPIs.connectedCalls / staffKPIs.totalAttempts) * 100)}%`
                : '0%'}
            </span>
          </div>
        </Card>
      </div>

      {/* Row 2: Today's Follow-ups & Recent Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Follow-ups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Pending Follow-ups</CardTitle>
              <p className="text-xs text-slate-500">Action items assigned to you for today</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/followups')}>
              View All →
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {myPendingFollowUps.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                All follow-ups completed! No pending items.
              </p>
            ) : (
              myPendingFollowUps.map((flp) => (
                <div
                  key={flp.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{flp.customerName}</span>
                      <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-100 px-1 rounded">
                        {flp.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{flp.remarks}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => completeFollowUp(flp.id)}
                    >
                      Done
                    </Button>
                    <Button
                      variant="brand"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        const targetLead = accessibleLeads.find((l) => l.id === flp.leadId);
                        if (targetLead) openCallModal(targetLead);
                      }}
                    >
                      Call
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Personal Call History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Recent Call Activity</CardTitle>
              <p className="text-xs text-slate-500">Log of your recent dials and durations</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/calling')}>
              Full Log →
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {myRecentCalls.map((call) => (
              <div
                key={call.id}
                className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{call.leadName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{call.phone}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      ['completed', 'answered'].includes(call.status)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {call.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                    {formatDuration(call.durationSeconds)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
