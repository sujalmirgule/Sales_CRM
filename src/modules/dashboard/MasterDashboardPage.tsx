import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SourceBadge } from '../../components/common/SourceBadge';
import { LeadTrendChart } from '../../components/charts/LeadTrendChart';
import { StatusPieChart } from '../../components/charts/StatusPieChart';
import { CallingBarChart } from '../../components/charts/CallingBarChart';
import { StaffPerfChart } from '../../components/charts/StaffPerfChart';
import { RevenueTrendChart } from '../../components/charts/RevenueTrendChart';
import { CampaignBarChart } from '../../components/charts/CampaignBarChart';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Users,
  UserPlus,
  UserCheck,
  HeartHandshake,
  CheckCircle2,
  Percent,
  BadgeDollarSign,
  PhoneCall,
  PhoneMissed,
  CalendarClock,
  Globe,
  Sparkles,
  ArrowRight,
  Clock,
  PhoneOutgoing,
  Award,
} from 'lucide-react';
import { formatCurrency, formatDuration, formatDateTime, formatTime } from '../../utils/formatters';

export const MasterDashboardPage: React.FC = () => {
  const {
    leads,
    calls,
    followUps,
    sales,
    staffMembers,
    masterKPIs,
    openCallModal,
    completeFollowUp,
  } = useCRM();
  const navigate = useNavigate();

  const recentLeads = leads.slice(0, 5);
  const todaysFollowUps = followUps
    .filter((f) => f.status === 'pending')
    .slice(0, 5);
  const recentCalls = calls.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-neutral-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Executive View
            </span>
            <span className="text-xs text-neutral-300">Live Meta Ads Funnel</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">Master Sales Analytics Dashboard</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time monitoring across 5 marketing campaigns, 2 sales representatives, and 30+ buyer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700 hover:text-white" onClick={() => navigate('/reports')}>
            Export CSV Reports
          </Button>
          <Button variant="brand" size="sm" onClick={() => navigate('/leads')}>
            View Lead Pipeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* 12 KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard
          title="Total Leads"
          value={masterKPIs.totalLeads}
          change="+18%"
          trend="up"
          subtext="Meta Ads + Direct Web"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="Today's Leads"
          value={masterKPIs.todayLeads}
          change="+4 today"
          trend="up"
          subtext="Fresh ad submissions"
          icon={Sparkles}
          iconColor="text-amber-600 bg-amber-50"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="New (Uncontacted)"
          value={masterKPIs.newLeads}
          subtext="Requires 1st touch"
          icon={UserPlus}
          iconColor="text-orange-600 bg-orange-50"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="Assigned Leads"
          value={masterKPIs.assignedLeads}
          subtext="In rep pipeline"
          icon={UserCheck}
          iconColor="text-indigo-600 bg-indigo-50"
          onClick={() => navigate('/lead-assignment')}
        />
        <StatCard
          title="Interested Prospects"
          value={masterKPIs.interestedLeads}
          subtext="High purchase intent"
          icon={HeartHandshake}
          iconColor="text-emerald-600 bg-emerald-50"
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="Converted Deals"
          value={masterKPIs.convertedLeads}
          change="+3 this wk"
          trend="up"
          subtext="Signed agreements"
          icon={CheckCircle2}
          iconColor="text-emerald-700 bg-emerald-100"
          onClick={() => navigate('/sales')}
        />
        <StatCard
          title="Conversion Rate"
          value={`${masterKPIs.conversionRate}%`}
          change="+2.4%"
          trend="up"
          subtext="Lead to booking"
          icon={Percent}
          iconColor="text-purple-600 bg-purple-50"
        />
        <StatCard
          title="Realized Revenue"
          value={formatCurrency(masterKPIs.totalRevenue)}
          change="+28%"
          trend="up"
          subtext="Gross property sales"
          icon={BadgeDollarSign}
          iconColor="text-emerald-600 bg-emerald-50"
          onClick={() => navigate('/sales')}
        />
        <StatCard
          title="Total Call Logs"
          value={masterKPIs.totalCalls}
          subtext="Rep telephony dials"
          icon={PhoneCall}
          iconColor="text-blue-600 bg-blue-50"
          onClick={() => navigate('/calling')}
        />
        <StatCard
          title="Missed / Busy Calls"
          value={masterKPIs.missedCalls}
          subtext="Pending redial"
          icon={PhoneMissed}
          iconColor="text-rose-600 bg-rose-50"
          onClick={() => navigate('/calling')}
        />
        <StatCard
          title="Pending Follow-ups"
          value={masterKPIs.pendingFollowUps}
          subtext="Due today & future"
          icon={CalendarClock}
          iconColor="text-amber-600 bg-amber-50"
          onClick={() => navigate('/followups')}
        />
        <StatCard
          title="Website Visitors"
          value={masterKPIs.websiteVisitors}
          change="+450"
          trend="up"
          subtext="Pixel tracked sessions"
          icon={Globe}
          iconColor="text-sky-600 bg-sky-50"
          onClick={() => navigate('/website-analytics')}
        />
      </div>

      {/* Primary Analytics Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <LeadTrendChart />
        </Card>
        <Card className="p-5">
          <StatusPieChart />
        </Card>
      </div>

      {/* Secondary Analytics Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 md:col-span-1 lg:col-span-1">
          <CallingBarChart />
        </Card>
        <Card className="p-5 md:col-span-1 lg:col-span-1">
          <StaffPerfChart />
        </Card>
        <Card className="p-5 md:col-span-1 lg:col-span-1">
          <RevenueTrendChart />
        </Card>
        <Card className="p-5 md:col-span-1 lg:col-span-1">
          <CampaignBarChart />
        </Card>
      </div>

      {/* Operational Grids: Recent Leads & Today's Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Leads Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Marketing Leads</CardTitle>
              <p className="text-xs text-slate-500">Real-time inbound submissions from Meta Ads & WhatsApp</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
              View All ({leads.length}) →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-2">Lead</th>
                    <th className="pb-2">Source</th>
                    <th className="pb-2">Assigned Staff</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Attempts</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="font-bold text-slate-900 hover:text-brand-600 text-left"
                        >
                          {lead.customerName}
                        </button>
                        <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>
                      </td>
                      <td className="py-2.5">
                        <SourceBadge source={lead.source} size="sm" />
                      </td>
                      <td className="py-2.5">
                        {lead.assignedStaffName ? (
                          <span className="font-medium text-slate-700">{lead.assignedStaffName}</span>
                        ) : (
                          <span className="text-[11px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>
                      <td className="py-2.5 font-semibold text-slate-700">
                        {lead.totalAttempts || 0}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
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

        {/* Today's Follow-ups Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Due Follow-ups</CardTitle>
              <p className="text-xs text-slate-500">Scheduled client touchpoints</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/followups')}>
              Calendar →
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {todaysFollowUps.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No pending follow-ups for today.</p>
            ) : (
              todaysFollowUps.map((flp) => (
                <div
                  key={flp.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{flp.customerName}</span>
                    <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      {flp.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{flp.remarks}</p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400">Rep: {flp.assignedStaffName}</span>
                    <button
                      onClick={() => completeFollowUp(flp.id)}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800"
                    >
                      ✓ Mark Done
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staff Productivity & Recent Telephony Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Performing Staff Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Staff Productivity & Talk Time</CardTitle>
                <p className="text-xs text-slate-500">Live individual contribution to sales targets</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/team')}>
                Team View →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffMembers.map((staff, idx) => {
                const staffSales = sales.filter((s) => s.assignedStaffId === staff.id);
                const revenue = staffSales.reduce((acc, s) => acc + s.saleAmount, 0);
                const staffCalls = calls.filter((c) => c.staffId === staff.id);
                const talkSeconds = staffCalls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);

                return (
                  <div
                    key={staff.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                        <p className="text-[11px] text-slate-500">{staff.department}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          ● Online Active Session
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Calls / Talk</span>
                        <span className="text-xs font-bold text-slate-800">
                          {staffCalls.length} calls • {formatDuration(talkSeconds)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-semibold">Revenue</span>
                        <span className="text-xs font-bold text-emerald-600">
                          {formatCurrency(revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Telephony Call Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Telephony Logs</CardTitle>
                <p className="text-xs text-slate-500">Live call recordings & dialer outcomes</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/calling')}>
                Call Center →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-md ${
                        ['completed', 'answered'].includes(call.status)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{call.leadName}</p>
                      <p className="text-[11px] text-slate-500">
                        {call.staffName} • {call.phone}
                      </p>
                    </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
