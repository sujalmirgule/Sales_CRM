import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { exportToCSV } from '../../utils/exportCsv';
import { formatCurrency, formatDuration, formatDate, formatDateTime } from '../../utils/formatters';
import {
  FileBarChart2,
  Download,
  Printer,
  Filter,
  Calendar,
  Users,
  PhoneCall,
  CalendarClock,
  BadgeDollarSign,
  Megaphone,
  Clock,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { leads, calls, followUps, sales, staffMembers, campaigns, attendance } = useCRM();

  const [activeReport, setActiveReport] = useState<
    'leads' | 'staff' | 'calling' | 'followup' | 'sales' | 'campaign' | 'attendance'
  >('leads');

  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | 'month'>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const handlePrint = () => {
    window.print();
  };

  const handleExportActiveReport = () => {
    switch (activeReport) {
      case 'leads':
        exportToCSV(leads, 'Lead_Generation_Report');
        break;
      case 'staff':
        exportToCSV(
          staffMembers.map((s) => {
            const repLeads = leads.filter((l) => l.assignedStaffId === s.id);
            const repCalls = calls.filter((c) => c.staffId === s.id);
            const repSales = sales.filter((sl) => sl.assignedStaffId === s.id);
            return {
              Staff: s.name,
              Email: s.email,
              Department: s.department,
              AssignedLeads: repLeads.length,
              TotalCalls: repCalls.length,
              ClosedSales: repSales.length,
              TotalRevenue: repSales.reduce((a, b) => a + b.saleAmount, 0),
            };
          }),
          'Staff_Performance_Report'
        );
        break;
      case 'calling':
        exportToCSV(calls, 'Telephony_Calling_Report');
        break;
      case 'followup':
        exportToCSV(followUps, 'Followup_Schedules_Report');
        break;
      case 'sales':
        exportToCSV(sales, 'Sales_Revenue_Report');
        break;
      case 'campaign':
        exportToCSV(campaigns, 'Marketing_Campaign_Report');
        break;
      case 'attendance':
        exportToCSV(attendance, 'Attendance_Sessions_Report');
        break;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Executive Reports & CSV Exports</h2>
          <p className="text-xs text-slate-500">
            Generate and export structured sales analytics, calling efficiency, and revenue reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1" /> Print Report
          </Button>
          <Button variant="brand" size="sm" onClick={handleExportActiveReport}>
            <Download className="w-3.5 h-3.5 mr-1" /> Download CSV Report
          </Button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'leads', label: 'Lead Generation', icon: Users },
          { key: 'staff', label: 'Staff Performance', icon: Users },
          { key: 'calling', label: 'Telephony Calling', icon: PhoneCall },
          { key: 'followup', label: 'Follow-up Scheduler', icon: CalendarClock },
          { key: 'sales', label: 'Sales & Revenue', icon: BadgeDollarSign },
          { key: 'campaign', label: 'Meta Campaigns', icon: Megaphone },
          { key: 'attendance', label: 'Staff Attendance', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveReport(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeReport === tab.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <Card className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Date Range"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
          >
            <option value="all">All Available Records</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="month">Current Month (November 2026)</option>
          </Select>

          <Select
            label="Staff Representative"
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
          >
            <option value="all">All Sales Executives</option>
            {staffMembers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.department})
              </option>
            ))}
          </Select>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9"
              onClick={() => {
                setDateFilter('all');
                setStaffFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Data Preview Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="capitalize">{activeReport} Data Preview</CardTitle>
            <p className="text-xs text-slate-500">Live preview of dataset before export</p>
          </div>
          <span className="text-xs font-mono font-bold text-brand-600">
            Export Ready • CSV UTF-8
          </span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {activeReport === 'leads' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Lead ID</th>
                    <th className="p-2.5">Customer Name</th>
                    <th className="p-2.5">Phone</th>
                    <th className="p-2.5">Source</th>
                    <th className="p-2.5">Campaign</th>
                    <th className="p-2.5">Assigned Staff</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.slice(0, 15).map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-brand-600">{l.id}</td>
                      <td className="p-2.5 font-bold text-slate-900">{l.customerName}</td>
                      <td className="p-2.5 font-mono text-slate-600">{l.phone}</td>
                      <td className="p-2.5 capitalize">{l.source}</td>
                      <td className="p-2.5 text-slate-600 truncate max-w-[180px]">{l.campaign}</td>
                      <td className="p-2.5 text-slate-700">{l.assignedStaffName || 'Unassigned'}</td>
                      <td className="p-2.5 uppercase font-semibold">{l.status}</td>
                      <td className="p-2.5 text-right font-mono font-bold">{l.totalAttempts || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'staff' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Staff Name</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5 text-center">Assigned Leads</th>
                    <th className="p-2.5 text-center">Total Dials</th>
                    <th className="p-2.5 text-center">Connected Calls</th>
                    <th className="p-2.5 text-center">Closed Sales</th>
                    <th className="p-2.5 text-right">Revenue Closed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffMembers.map((s) => {
                    const repLeads = leads.filter((l) => l.assignedStaffId === s.id);
                    const repCalls = calls.filter((c) => c.staffId === s.id);
                    const connCalls = repCalls.filter((c) => ['completed', 'answered'].includes(c.status));
                    const repSales = sales.filter((sl) => sl.assignedStaffId === s.id);
                    const rev = repSales.reduce((a, b) => a + b.saleAmount, 0);

                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2.5 font-mono text-slate-600">{s.email}</td>
                        <td className="p-2.5 text-slate-600">{s.department}</td>
                        <td className="p-2.5 text-center font-bold">{repLeads.length}</td>
                        <td className="p-2.5 text-center font-bold text-blue-600">{repCalls.length}</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">{connCalls.length}</td>
                        <td className="p-2.5 text-center font-bold text-brand-600">{repSales.length}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-700 font-mono">
                          {formatCurrency(rev)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeReport === 'sales' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Invoice #</th>
                    <th className="p-2.5">Customer Name</th>
                    <th className="p-2.5">Property Unit</th>
                    <th className="p-2.5">Amount</th>
                    <th className="p-2.5">Payment Status</th>
                    <th className="p-2.5">Closing Rep</th>
                    <th className="p-2.5 text-right">Conversion Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-brand-600">{s.invoiceNumber}</td>
                      <td className="p-2.5 font-bold text-slate-900">{s.customerName}</td>
                      <td className="p-2.5 text-slate-700">{s.product}</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600">
                        {formatCurrency(s.saleAmount)}
                      </td>
                      <td className="p-2.5 capitalize">{s.paymentStatus}</td>
                      <td className="p-2.5 text-slate-700">{s.assignedStaffName}</td>
                      <td className="p-2.5 text-right text-slate-500">{formatDate(s.conversionDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'calling' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Call ID</th>
                    <th className="p-2.5">Customer</th>
                    <th className="p-2.5">Phone</th>
                    <th className="p-2.5">Staff Rep</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calls.slice(0, 15).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-slate-600">{c.id}</td>
                      <td className="p-2.5 font-bold text-slate-900">{c.leadName}</td>
                      <td className="p-2.5 font-mono text-slate-600">{c.phone}</td>
                      <td className="p-2.5 text-slate-700">{c.staffName}</td>
                      <td className="p-2.5 uppercase font-semibold">{c.status}</td>
                      <td className="p-2.5 font-mono">{formatDuration(c.durationSeconds)}</td>
                      <td className="p-2.5 text-right text-slate-400">{formatDateTime(c.startTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'campaign' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Campaign Name</th>
                    <th className="p-2.5">Platform</th>
                    <th className="p-2.5">Total Spend</th>
                    <th className="p-2.5 text-center">Total Leads</th>
                    <th className="p-2.5">CPL</th>
                    <th className="p-2.5 text-center">Conversions</th>
                    <th className="p-2.5 text-right">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                      <td className="p-2.5 capitalize">{c.platform}</td>
                      <td className="p-2.5 font-mono">{formatCurrency(c.totalSpend)}</td>
                      <td className="p-2.5 text-center font-bold text-brand-600 font-mono">{c.totalLeads}</td>
                      <td className="p-2.5 font-mono">{formatCurrency(c.costPerLead)}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-600 font-mono">{c.conversions}</td>
                      <td className="p-2.5 text-right font-bold text-purple-600">{c.roi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'followup' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Customer</th>
                    <th className="p-2.5">Phone</th>
                    <th className="p-2.5">Staff Rep</th>
                    <th className="p-2.5">Scheduled Date</th>
                    <th className="p-2.5">Time</th>
                    <th className="p-2.5">Priority</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {followUps.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{f.customerName}</td>
                      <td className="p-2.5 font-mono text-slate-600">{f.phone}</td>
                      <td className="p-2.5 text-slate-700">{f.assignedStaffName}</td>
                      <td className="p-2.5 text-slate-600">{formatDate(f.date)}</td>
                      <td className="p-2.5 font-mono font-bold text-amber-700">{f.time}</td>
                      <td className="p-2.5 capitalize">{f.priority}</td>
                      <td className="p-2.5 text-right uppercase font-semibold">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'attendance' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Session ID</th>
                    <th className="p-2.5">Staff Member</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Duration (min)</th>
                    <th className="p-2.5">Talk Time (min)</th>
                    <th className="p-2.5">Est. Idle (min)</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-slate-600">{a.id}</td>
                      <td className="p-2.5 font-bold text-slate-900">{a.staffName}</td>
                      <td className="p-2.5 text-slate-600">{formatDate(a.date)}</td>
                      <td className="p-2.5 font-mono">{a.totalSessionDurationMinutes}m</td>
                      <td className="p-2.5 font-mono text-emerald-600 font-bold">{a.totalTalkTimeMinutes}m</td>
                      <td className="p-2.5 font-mono text-amber-600">~{a.idleTimeMinutes}m</td>
                      <td className="p-2.5 text-right uppercase font-semibold">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
