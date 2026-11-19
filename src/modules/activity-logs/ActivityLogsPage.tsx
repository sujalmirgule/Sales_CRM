import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { exportToCSV } from '../../utils/exportCsv';
import { formatDateTime } from '../../utils/formatters';
import { History, Download, Filter, Search, ShieldCheck } from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const { activityLogs } = useCRM();

  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      search === '' ||
      log.activity.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = activityFilter === 'all' || log.activity === activityFilter;

    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    exportToCSV(
      filteredLogs,
      'System_Audit_Activity_Logs',
      [
        { key: 'id', header: 'Log ID' },
        { key: 'activity', header: 'Action' },
        { key: 'user', header: 'User' },
        { key: 'role', header: 'Role' },
        { key: 'entity', header: 'Entity' },
        { key: 'timestamp', header: 'Timestamp', transform: (v) => formatDateTime(v) },
        { key: 'description', header: 'Event Description' },
      ]
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Audit Trail & Activity Logs</h2>
          <p className="text-xs text-slate-500">
            Immutable log of all user logins, call dial events, lead reassignments, and booking conversions
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-3.5 h-3.5 mr-1" /> Export Audit Log CSV
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search user, action, lead ID, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <Select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
            <option value="all">All Event Types</option>
            <option value="Lead Created">Lead Created</option>
            <option value="Lead Assigned">Lead Assigned</option>
            <option value="Lead Status Changed">Lead Status Changed</option>
            <option value="Call Attempted">Call Attempted</option>
            <option value="Follow-up Scheduled">Follow-up Scheduled</option>
            <option value="Follow-up Completed">Follow-up Completed</option>
            <option value="Lead Converted to Sale">Lead Converted to Sale</option>
            <option value="User Logged In">User Logged In</option>
            <option value="User Role Switched">User Role Switched</option>
          </Select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Activity / Action</th>
                <th className="p-3">Initiated By</th>
                <th className="p-3">Role</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No activity logs match the filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-500">{log.id}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{log.activity}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{log.user}</td>
                    <td className="p-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.role === 'master'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 font-semibold">{log.entity}</td>
                    <td className="p-3 text-slate-500 font-mono">{formatDateTime(log.timestamp)}</td>
                    <td className="p-3 text-slate-700 leading-relaxed max-w-sm">{log.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
