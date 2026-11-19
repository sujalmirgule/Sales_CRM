import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/common/StatCard';
import { Clock, CheckCircle2, UserCheck, AlertCircle, Calendar, Download } from 'lucide-react';
import { formatDuration, formatDateTime, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportCsv';
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

export const AttendanceSessionsPage: React.FC = () => {
  const { attendance, staffMembers } = useCRM();
  const { currentUser, isMaster } = useAuth();

  const [viewFilter, setViewFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Filter attendance if staff user
  const displayAttendance = isMaster
    ? attendance
    : attendance.filter((a) => a.staffId === currentUser.id);

  const activeSessions = displayAttendance.filter((a) => a.status === 'active');
  const totalSessionMinutes = displayAttendance.reduce((acc, a) => acc + a.totalSessionDurationMinutes, 0);
  const totalTalkMinutes = displayAttendance.reduce((acc, a) => acc + a.totalTalkTimeMinutes, 0);
  const totalIdleMinutes = displayAttendance.reduce((acc, a) => acc + a.idleTimeMinutes, 0);

  // Staff-wise hours chart data
  const staffHoursData = staffMembers.map((staff) => {
    const records = attendance.filter((a) => a.staffId === staff.id);
    const sessionHours = records.reduce((acc, r) => acc + r.totalSessionDurationMinutes, 0) / 60;
    const talkHours = records.reduce((acc, r) => acc + r.totalTalkTimeMinutes, 0) / 60;
    const idleHours = records.reduce((acc, r) => acc + r.idleTimeMinutes, 0) / 60;

    return {
      name: staff.name.split(' ')[0],
      fullName: staff.name,
      workingHours: Number(sessionHours.toFixed(1)),
      talkHours: Number(talkHours.toFixed(1)),
      idleHours: Number(idleHours.toFixed(1)),
    };
  });

  const handleExportCSV = () => {
    exportToCSV(
      displayAttendance,
      'Staff_Attendance_Report',
      [
        { key: 'id', header: 'Session ID' },
        { key: 'staffName', header: 'Staff Agent' },
        { key: 'date', header: 'Date' },
        { key: 'loginTime', header: 'Login Time', transform: (v) => formatDateTime(v) },
        { key: 'logoutTime', header: 'Logout Time', transform: (v) => (v ? formatDateTime(v) : 'Active Session') },
        { key: 'totalSessionDurationMinutes', header: 'Session Minutes' },
        { key: 'totalTalkTimeMinutes', header: 'Talk Minutes' },
        { key: 'idleTimeMinutes', header: 'Est. Idle Minutes' },
        { key: 'status', header: 'Status' },
      ]
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Attendance & Login Sessions Monitor</h2>
          <p className="text-xs text-slate-500">
            Workstation active hours, calling time distribution, and productivity logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export Attendance CSV
          </Button>
        </div>
      </div>

      {/* Notice on Idle Time */}
      <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Note:</strong> Idle time displayed is an algorithmic client estimation based on keyboard/dialer inactivity, not legally verified biometric attendance.
        </span>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Active Live Sessions"
          value={activeSessions.length}
          subtext="Currently logged in"
          icon={UserCheck}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Total Logged Hours"
          value={`${(totalSessionMinutes / 60).toFixed(1)} hrs`}
          subtext="Cumulative shift time"
          icon={Clock}
          iconColor="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Total Talk Hours"
          value={`${(totalTalkMinutes / 60).toFixed(1)} hrs`}
          subtext="Active customer calling"
          icon={CheckCircle2}
          iconColor="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Estimated Idle Hours"
          value={`${(totalIdleMinutes / 60).toFixed(1)} hrs`}
          subtext="Inactivity windows"
          icon={AlertCircle}
          iconColor="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Working Hours Chart */}
      {isMaster && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Staff-wise Working Hours vs Talk Time</h4>
              <p className="text-xs text-slate-500">Cumulative logged hours comparison</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="workingHours" name="Shift Duration (hrs)" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="talkHours" name="Talk Time (hrs)" fill="#10B981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="idleHours" name="Est. Idle Time (hrs)" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Sessions History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Attendance Session Records</CardTitle>
            <p className="text-xs text-slate-500">Logins, durations, and call talk times</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs">
            {(['daily', 'weekly', 'monthly'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewFilter(v)}
                className={`px-2.5 py-1 rounded font-semibold capitalize transition-all ${
                  viewFilter === v
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Session ID</th>
                  <th className="p-3">Staff Agent</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Login Time</th>
                  <th className="p-3">Logout Time</th>
                  <th className="p-3">Session Length</th>
                  <th className="p-3">Calling Time</th>
                  <th className="p-3">Talk Time</th>
                  <th className="p-3">Est. Idle Time</th>
                  <th className="p-3 text-right">Live Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayAttendance.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-600">{session.id}</td>
                    <td className="p-3 font-bold text-slate-900">{session.staffName}</td>
                    <td className="p-3 text-slate-600">{formatDate(session.date)}</td>
                    <td className="p-3 font-mono text-slate-700">{formatDateTime(session.loginTime)}</td>
                    <td className="p-3 font-mono text-slate-700">
                      {session.logoutTime ? formatDateTime(session.logoutTime) : '— Active'}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {Math.floor(session.totalSessionDurationMinutes / 60)}h{' '}
                      {session.totalSessionDurationMinutes % 60}m
                    </td>
                    <td className="p-3 font-mono text-blue-700 font-semibold">
                      {session.totalCallingTimeMinutes}m
                    </td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">
                      {session.totalTalkTimeMinutes}m
                    </td>
                    <td className="p-3 font-mono text-amber-700">
                      ~{session.idleTimeMinutes}m
                    </td>
                    <td className="p-3 text-right">
                      {session.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          Closed
                        </span>
                      )}
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
