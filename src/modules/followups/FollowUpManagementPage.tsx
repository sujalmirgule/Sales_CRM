import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { FollowUp } from '../../types/crm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  PhoneOutgoing,
  Edit,
  ExternalLink,
  Plus,
  XCircle,
} from 'lucide-react';
import { formatTime, formatDate } from '../../utils/formatters';

export const FollowUpManagementPage: React.FC = () => {
  const {
    accessibleFollowUps,
    leads,
    openCallModal,
    completeFollowUp,
    updateFollowUp,
    addFollowUp,
    staffMembers,
  } = useCRM();
  const { currentUser, isMaster } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'calendar'>('today');
  const [rescheduleItem, setRescheduleItem] = useState<FollowUp | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('16:00');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New follow-up creation state
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState('14:30');
  const [newRemarks, setNewRemarks] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('high');

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filtered categories
  const todaysList = useMemo(
    () => accessibleFollowUps.filter((f) => f.date === todayStr && f.status === 'pending'),
    [accessibleFollowUps, todayStr]
  );

  const upcomingList = useMemo(
    () => accessibleFollowUps.filter((f) => f.date > todayStr && f.status === 'pending'),
    [accessibleFollowUps, todayStr]
  );

  const overdueList = useMemo(
    () => accessibleFollowUps.filter((f) => f.date < todayStr && f.status === 'pending'),
    [accessibleFollowUps, todayStr]
  );

  const completedList = useMemo(
    () => accessibleFollowUps.filter((f) => f.status === 'completed'),
    [accessibleFollowUps]
  );

  const currentDisplayList =
    activeTab === 'today'
      ? todaysList
      : activeTab === 'upcoming'
      ? upcomingList
      : activeTab === 'overdue'
      ? overdueList
      : activeTab === 'completed'
      ? completedList
      : [];

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleItem) return;
    updateFollowUp(rescheduleItem.id, {
      date: rescheduleDate,
      time: rescheduleTime,
      status: 'pending',
    });
    setRescheduleItem(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    addFollowUp({
      leadId: lead.id,
      customerName: lead.customerName,
      phone: lead.phone,
      assignedStaffId: lead.assignedStaffId || currentUser.id,
      assignedStaffName: lead.assignedStaffName || currentUser.name,
      date: newDate,
      time: newTime,
      remarks: newRemarks.trim() || 'Scheduled customer touchpoint',
      status: 'pending',
      priority: newPriority,
    });

    setIsCreateOpen(false);
    setNewRemarks('');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Follow-up Scheduler & Pipeline Reminders</h2>
          <p className="text-xs text-slate-500">
            Never drop a lead: Track scheduled calls, site visit follow-ups, and overdue tasks
          </p>
        </div>

        <Button variant="brand" size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> New Follow-up
        </Button>
      </div>

      {/* 4 Summary Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('today')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'today'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">Today's Due</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{todaysList.length}</span>
          <span className="text-[10px] text-amber-700 font-semibold">Priority callbacks today</span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'upcoming'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">Upcoming</span>
            <CalendarClock className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{upcomingList.length}</span>
          <span className="text-[10px] text-blue-700 font-semibold">Scheduled next 7 days</span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">Overdue</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-bold text-rose-600 mt-1 block">{overdueList.length}</span>
          <span className="text-[10px] text-rose-700 font-semibold">Missed schedule date</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            activeTab === 'completed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">{completedList.length}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Finished touchpoints</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="border-b border-slate-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-semibold">
            {[
              { key: 'today', label: `Today (${todaysList.length})` },
              { key: 'upcoming', label: `Upcoming (${upcomingList.length})` },
              { key: 'overdue', label: `Overdue (${overdueList.length})` },
              { key: 'completed', label: `Completed (${completedList.length})` },
              { key: 'calendar', label: 'Calendar Planner View' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-brand-600 text-brand-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Body: Standard Follow-up Table */}
        {activeTab !== 'calendar' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Customer / Lead</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Scheduled Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Assigned Rep</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Remarks / Agenda</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentDisplayList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      No follow-ups found in this view.
                    </td>
                  </tr>
                ) : (
                  currentDisplayList.map((item) => {
                    const targetLead = leads.find((l) => l.id === item.leadId);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <button
                            onClick={() => navigate(`/leads/${item.leadId}`)}
                            className="font-bold text-slate-900 hover:text-brand-600 text-left block"
                          >
                            {item.customerName}
                          </button>
                          <span className="text-[11px] text-brand-600 font-mono font-medium">
                            {item.leadId}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-700">{item.phone}</td>
                        <td className="p-3 font-medium text-slate-800">{formatDate(item.date)}</td>
                        <td className="p-3 font-mono font-bold text-amber-700">{item.time}</td>
                        <td className="p-3 text-slate-700">{item.assignedStaffName}</td>
                        <td className="p-3">
                          <PriorityBadge priority={item.priority} size="sm" />
                        </td>
                        <td className="p-3 text-slate-600 max-w-[220px] truncate" title={item.remarks}>
                          {item.remarks}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.date < todayStr
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {targetLead && item.status !== 'completed' && (
                              <Button
                                variant="brand"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => openCallModal(targetLead)}
                              >
                                <PhoneOutgoing className="w-3 h-3 mr-1" /> Call
                              </Button>
                            )}

                            {item.status !== 'completed' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                  onClick={() => completeFollowUp(item.id)}
                                  title="Mark as completed"
                                >
                                  ✓ Done
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-slate-500"
                                  onClick={() => {
                                    setRescheduleItem(item);
                                    setRescheduleDate(item.date);
                                    setRescheduleTime(item.time);
                                  }}
                                  title="Reschedule"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 text-slate-500"
                              onClick={() => navigate(`/leads/${item.leadId}`)}
                              title="Lead Dossier"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Calendar Planner View */
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {['2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22'].map((calendarDate) => {
                const dayItems = accessibleFollowUps.filter((f) => f.date === calendarDate);
                const isToday = calendarDate === todayStr;

                return (
                  <div
                    key={calendarDate}
                    className={`rounded-lg border p-3 flex flex-col justify-between ${
                      isToday ? 'bg-amber-50/40 border-amber-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        {formatDate(calendarDate)}
                      </span>
                      {isToday && (
                        <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 rounded">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 min-h-[120px]">
                      {dayItems.length === 0 ? (
                        <p className="text-[11px] text-slate-400 py-3 text-center">No reminders set</p>
                      ) : (
                        dayItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => navigate(`/leads/${item.leadId}`)}
                            className="p-2 bg-white rounded border border-slate-200 text-xs shadow-sm hover:border-brand-500 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 truncate max-w-[110px]">
                                {item.customerName}
                              </span>
                              <span className="font-mono text-[10px] text-amber-700 font-bold">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.remarks}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleItem}
        onClose={() => setRescheduleItem(null)}
        maxWidth="sm"
        title="Reschedule Follow-up"
      >
        {rescheduleItem && (
          <form onSubmit={handleRescheduleSubmit} className="space-y-3">
            <p className="text-xs text-slate-500">
              Moving callback for <strong>{rescheduleItem.customerName}</strong> ({rescheduleItem.phone})
            </p>
            <Input
              label="New Date *"
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              required
            />
            <Input
              label="New Time *"
              type="time"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setRescheduleItem(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" size="sm">
                Save New Time
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Follow-up Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="sm"
        title="Create New Follow-up Schedule"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3">
          <Select
            label="Target Lead *"
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.customerName} ({l.phone})
              </option>
            ))}
          </Select>

          <Input
            label="Date *"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />

          <Input
            label="Time *"
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            required
          />

          <Select
            label="Priority Level"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as any)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
              Follow-up Agenda / Discussion Topic *
            </label>
            <textarea
              rows={2}
              className="w-full text-xs rounded-md border border-slate-200 p-2 outline-none focus:border-brand-500"
              placeholder="e.g. Discuss down payment terms, arrange weekend site tour..."
              value={newRemarks}
              onChange={(e) => setNewRemarks(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Schedule Follow-up
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
