import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { CallAttempt, CallStatus, CallDirection } from '../../types/crm';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { exportToCSV } from '../../utils/exportCsv';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';

export const CallManagementPage: React.FC = () => {
  const { accessibleCalls, staffMembers, openCallModal, leads } = useCRM();
  const { isMaster } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  // Filtered calls
  const filteredCalls = useMemo(() => {
    return accessibleCalls.filter((call) => {
      const matchesSearch =
        search === '' ||
        call.leadName.toLowerCase().includes(search.toLowerCase()) ||
        call.phone.includes(search) ||
        call.id.toLowerCase().includes(search.toLowerCase()) ||
        call.remarks.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
      const matchesDirection = directionFilter === 'all' || call.direction === directionFilter;
      const matchesStaff = staffFilter === 'all' || call.staffId === staffFilter;

      return matchesSearch && matchesStatus && matchesDirection && matchesStaff;
    });
  }, [accessibleCalls, search, statusFilter, directionFilter, staffFilter]);

  // Calling Metrics
  const totalCalls = accessibleCalls.length;
  const outgoingCalls = accessibleCalls.filter((c) => c.direction === 'outgoing').length;
  const incomingCalls = accessibleCalls.filter((c) => c.direction === 'incoming').length;
  const answeredCalls = accessibleCalls.filter((c) => ['completed', 'answered'].includes(c.status)).length;
  const missedCalls = accessibleCalls.filter((c) => c.status === 'no_answer').length;
  const nonConnected = accessibleCalls.filter((c) => ['busy', 'failed', 'cancelled', 'rejected'].includes(c.status)).length;
  const totalTalkSeconds = accessibleCalls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
  const avgTalkSeconds = answeredCalls > 0 ? Math.round(totalTalkSeconds / answeredCalls) : 0;

  const handleExportCSV = () => {
    exportToCSV(
      filteredCalls,
      'Telephony_Call_Logs',
      [
        { key: 'id', header: 'Call ID' },
        { key: 'leadName', header: 'Customer' },
        { key: 'phone', header: 'Phone' },
        { key: 'staffName', header: 'Staff Agent' },
        { key: 'direction', header: 'Direction' },
        { key: 'status', header: 'Status' },
        { key: 'attemptNumber', header: 'Attempt #' },
        { key: 'durationSeconds', header: 'Duration (sec)' },
        { key: 'startTime', header: 'Call Time', transform: (val) => formatDateTime(val) },
        { key: 'remarks', header: 'Remarks' },
      ]
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Calling Management & Telephony Log</h2>
          <p className="text-xs text-slate-500">
            Real-time PBX call records, duration logs, and outbound dialer simulation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV ({filteredCalls.length})
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => {
              const sampleLead = leads[0];
              if (sampleLead) openCallModal(sampleLead);
            }}
          >
            <PhoneOutgoing className="w-3.5 h-3.5 mr-1" /> Quick Dial Customer
          </Button>
        </div>
      </div>

      {/* 8 Call KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <StatCard
          title="Total Calls"
          value={totalCalls}
          icon={PhoneCall}
          iconColor="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Outgoing"
          value={outgoingCalls}
          icon={PhoneOutgoing}
          iconColor="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Incoming"
          value={incomingCalls}
          icon={PhoneIncoming}
          iconColor="text-sky-600 bg-sky-50"
        />
        <StatCard
          title="Answered"
          value={answeredCalls}
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="No Answer"
          value={missedCalls}
          icon={PhoneMissed}
          iconColor="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Busy/Failed"
          value={nonConnected}
          icon={AlertTriangle}
          iconColor="text-rose-600 bg-rose-50"
        />
        <StatCard
          title="Talk Time"
          value={formatDuration(totalTalkSeconds)}
          icon={Clock}
          iconColor="text-purple-600 bg-purple-50"
        />
        <StatCard
          title="Avg Talk Time"
          value={formatDuration(avgTalkSeconds)}
          icon={Clock}
          iconColor="text-teal-600 bg-teal-50"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search call ID, customer name, phone, remarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Dispositions</option>
            <option value="completed">Answered & Completed</option>
            <option value="no_answer">No Answer</option>
            <option value="busy">Busy Line</option>
            <option value="failed">Failed / Switched Off</option>
            <option value="cancelled">Rejected / Cancelled</option>
          </Select>

          <Select value={directionFilter} onChange={(e) => setDirectionFilter(e.target.value)}>
            <option value="all">All Call Directions</option>
            <option value="outgoing">Outgoing (Agent to Client)</option>
            <option value="incoming">Incoming (Client Callback)</option>
          </Select>

          {isMaster ? (
            <Select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}>
              <option value="all">All Staff Agents</option>
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          ) : (
            <div className="flex items-center text-xs font-semibold text-slate-500 px-3 bg-slate-50 rounded-md border border-slate-200">
              Filtered to your agent dials
            </div>
          )}
        </div>
      </Card>

      {/* Call History Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Call ID</th>
                <th className="py-3 px-3">Customer Name</th>
                <th className="py-3 px-3">Phone Number</th>
                <th className="py-3 px-3">Staff Agent</th>
                <th className="py-3 px-3">Direction</th>
                <th className="py-3 px-3">Disposition / Status</th>
                <th className="py-3 px-3 text-center">Attempt #</th>
                <th className="py-3 px-3">Start Time</th>
                <th className="py-3 px-3">Talk Duration</th>
                <th className="py-3 px-3">Remarks / Call Outcome</th>
                <th className="py-3 px-3 text-right">Quick Dial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-400">
                    No call logs match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => {
                  const targetLead = leads.find((l) => l.id === call.leadId);
                  return (
                    <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">{call.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{call.leadName}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{call.phone}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{call.staffName}</td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-[11px] font-semibold capitalize text-slate-600">
                          {call.direction === 'outgoing' ? (
                            <PhoneOutgoing className="w-3 h-3 text-blue-500" />
                          ) : (
                            <PhoneIncoming className="w-3 h-3 text-emerald-500" />
                          )}
                          {call.direction}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            ['completed', 'answered'].includes(call.status)
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : call.status === 'no_answer'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">
                        #{call.attemptNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">
                        {formatDateTime(call.startTime)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {formatDuration(call.durationSeconds)}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[220px] truncate" title={call.remarks}>
                        {call.remarks}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {targetLead && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs text-brand-600 border-brand-200 hover:bg-brand-50"
                            onClick={() => openCallModal(targetLead)}
                          >
                            <PhoneCall className="w-3 h-3 mr-1" /> Redial
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
