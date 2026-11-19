import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { LeadStatus, LeadPriority } from '../../types/crm';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SourceBadge } from '../../components/common/SourceBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { AssignStaffModal } from '../../components/common/AssignStaffModal';
import {
  ArrowLeft,
  PhoneCall,
  CalendarClock,
  MessageSquare,
  UserCheck,
  CheckCircle,
  Building,
  MapPin,
  Clock,
  Share2,
  Calendar,
  Send,
  PhoneOutgoing,
  DollarSign,
  TrendingUp,
  History,
  Globe,
} from 'lucide-react';
import { formatCurrency, formatDuration, formatDateTime, formatDate } from '../../utils/formatters';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    leads,
    calls,
    followUps,
    updateLead,
    addLeadNote,
    openCallModal,
    addFollowUp,
    addSale,
  } = useCRM();
  const { currentUser, isMaster, hasPermission } = useAuth();

  const lead = leads.find((l) => l.id === id);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'calls' | 'followups' | 'notes' | 'website'
  >('timeline');

  // Modals state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // New Note state
  const [noteText, setNoteText] = useState('');

  // Follow-up form state
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().slice(0, 10));
  const [followUpTime, setFollowUpTime] = useState('15:00');
  const [followUpRemarks, setFollowUpRemarks] = useState('');
  const [followUpPriority, setFollowUpPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Sale form state
  const [saleAmount, setSaleAmount] = useState(lead?.budget || 12000000);
  const [saleProduct, setSaleProduct] = useState(lead?.interestedProduct || '3BHK Sea-Facing Penthouse');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'pending'>('paid');

  if (!lead) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-base font-bold text-slate-800">Lead Prospect Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested lead ID does not exist or has been removed.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/leads')}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Lead Pipeline
        </Button>
      </div>
    );
  }

  // Related calls and follow-ups
  const leadCalls = calls.filter((c) => c.leadId === lead.id);
  const leadFollowUps = followUps.filter((f) => f.leadId === lead.id);

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addLeadNote(lead.id, noteText.trim());
    setNoteText('');
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    addFollowUp({
      leadId: lead.id,
      customerName: lead.customerName,
      phone: lead.phone,
      assignedStaffId: lead.assignedStaffId || currentUser.id,
      assignedStaffName: lead.assignedStaffName || currentUser.name,
      date: followUpDate,
      time: followUpTime,
      remarks: followUpRemarks.trim() || 'Scheduled customer touchpoint',
      status: 'pending',
      priority: followUpPriority,
    });
    setIsScheduleOpen(false);
    setFollowUpRemarks('');
  };

  const handleConvertSale = (e: React.FormEvent) => {
    e.preventDefault();
    addSale({
      leadId: lead.id,
      customerName: lead.customerName,
      phone: lead.phone,
      product: saleProduct,
      saleAmount: Number(saleAmount),
      paymentStatus: paymentStatus,
      conversionDate: new Date().toISOString(),
      assignedStaffId: lead.assignedStaffId || currentUser.id,
      assignedStaffName: lead.assignedStaffName || currentUser.name,
      notes: 'Deal finalized and marked as converted.',
    });
    setIsSaleOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Back button & Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/leads')}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> All Leads
          </Button>
          <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-200">
            {lead.id}
          </span>
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {(isMaster || hasPermission('calls.initiate')) && (
            <Button variant="brand" size="sm" onClick={() => openCallModal(lead)}>
              <PhoneOutgoing className="w-3.5 h-3.5 mr-1.5" /> Call Customer
            </Button>
          )}

          {(isMaster || hasPermission('followups.create')) && (
            <Button variant="outline" size="sm" onClick={() => setIsScheduleOpen(true)}>
              <CalendarClock className="w-3.5 h-3.5 mr-1.5" /> Schedule Follow-up
            </Button>
          )}

          {(isMaster || hasPermission('leads.edit')) && (
            <Button variant="outline" size="sm" onClick={() => setIsStatusModalOpen(true)}>
              Status: {lead.status}
            </Button>
          )}

          {(isMaster || hasPermission('leads.assign')) && (
            <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(true)}>
              <UserCheck className="w-3.5 h-3.5 mr-1.5" /> Assign Rep
            </Button>
          )}

          {lead.status !== 'converted' && (isMaster || hasPermission('sales.create')) && (
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
              onClick={() => setIsSaleOpen(true)}
            >
              <DollarSign className="w-3.5 h-3.5 mr-1" /> Convert to Sale
            </Button>
          )}
        </div>
      </div>

      {/* Main Dossier Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Customer Details Card */}
        <Card className="p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Lead Dossier
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{lead.customerName}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone}</p>
            <p className="text-xs text-slate-500">{lead.email}</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Interested Product:</span>
              <span className="font-semibold text-slate-800 text-right">{lead.interestedProduct}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Marketing Source:</span>
              <SourceBadge source={lead.source} size="sm" />
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Ad Campaign:</span>
              <span className="font-medium text-slate-700 text-right truncate max-w-[180px]">
                {lead.campaign}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Assigned Executive:</span>
              <span className="font-semibold text-slate-900">
                {lead.assignedStaffName || 'Unassigned'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">City / Location:</span>
              <span className="font-medium text-slate-700">{lead.city || 'Mumbai, MH'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Budget Range:</span>
              <span className="font-bold text-slate-900">
                {lead.budget ? formatCurrency(lead.budget) : 'Not specified'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Inbound Received:</span>
              <span className="text-slate-600">{formatDateTime(lead.createdDate)}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Next Follow-up Due:</span>
              <span className="font-semibold text-amber-700 font-mono">
                {lead.nextFollowUpDate ? formatDateTime(lead.nextFollowUpDate) : 'None scheduled'}
              </span>
            </div>
          </div>

          {/* Initial Remarks Box */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Initial Inbound Remarks
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">{lead.remarks}</p>
          </div>
        </Card>

        {/* Right Column: Telephony Analytics & Tabbed View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Telephony KPI Quick Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Dials</span>
              <span className="text-xl font-bold text-slate-900">{lead.totalAttempts || 0}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Attempt count</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Connected</span>
              <span className="text-xl font-bold text-emerald-600">
                {lead.connectedAttempts || 0}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Answered calls</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Non-Connected</span>
              <span className="text-xl font-bold text-rose-600">
                {lead.nonConnectedAttempts || 0}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Missed / Busy</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Talk Time</span>
              <span className="text-xl font-bold text-indigo-600 font-mono">
                {formatDuration(lead.totalTalkTimeSeconds || 0)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Total duration</span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <Card>
            <div className="border-b border-slate-200 px-4 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
              {[
                { key: 'timeline', label: `Timeline (${leadCalls.length + (lead.notes?.length || 0) + 1})` },
                { key: 'calls', label: `Call History (${leadCalls.length})` },
                { key: 'followups', label: `Follow-ups (${leadFollowUps.length})` },
                { key: 'notes', label: `Notes (${lead.notes?.length || 0})` },
                { key: 'website', label: 'Website Pixel Activity' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-brand-600 text-brand-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <CardContent className="p-4">
              {/* Tab 1: Activity Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {/* Event: Lead Created */}
                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">
                        ★
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">Lead Created via {lead.source}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{formatDateTime(lead.createdDate)}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Inbound submission for campaign: <strong>{lead.campaign}</strong>.
                        </p>
                      </div>
                    </div>

                    {/* All Calls in chronological order */}
                    {leadCalls.map((call, idx) => (
                      <div key={call.id} className="relative">
                        <div
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${
                            ['completed', 'answered'].includes(call.status)
                              ? 'bg-emerald-600'
                              : 'bg-amber-500'
                          }`}
                        >
                          ☎
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                              Attempt #{call.attemptNumber}: {call.status.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {formatDateTime(call.startTime)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 mt-1">{call.remarks}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                            <span>Caller: {call.staffName}</span>
                            <span>•</span>
                            <span>Duration: {formatDuration(call.durationSeconds)}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Notes in timeline */}
                    {lead.notes?.map((note) => (
                      <div key={note.id} className="relative">
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                          ✎
                        </div>
                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-blue-900">Internal Sales Note</span>
                            <span className="text-[11px] text-blue-500 font-mono">
                              {formatDateTime(note.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 mt-1">{note.text}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Author: {note.authorName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Call History */}
              {activeTab === 'calls' && (
                <div className="space-y-3">
                  {leadCalls.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No calls logged yet. Click "Call Customer" to dial.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                          <tr>
                            <th className="p-2">Call ID</th>
                            <th className="p-2">Staff Rep</th>
                            <th className="p-2">Direction</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Duration</th>
                            <th className="p-2">Date & Time</th>
                            <th className="p-2">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {leadCalls.map((call) => (
                            <tr key={call.id} className="hover:bg-slate-50">
                              <td className="p-2 font-mono text-slate-600 font-bold">{call.id}</td>
                              <td className="p-2 font-medium text-slate-800">{call.staffName}</td>
                              <td className="p-2 capitalize">{call.direction}</td>
                              <td className="p-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    ['completed', 'answered'].includes(call.status)
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {call.status}
                                </span>
                              </td>
                              <td className="p-2 font-mono">{formatDuration(call.durationSeconds)}</td>
                              <td className="p-2 text-slate-500">{formatDateTime(call.startTime)}</td>
                              <td className="p-2 text-slate-600 max-w-[200px] truncate">{call.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Follow-ups */}
              {activeTab === 'followups' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <Button variant="brand" size="sm" onClick={() => setIsScheduleOpen(true)}>
                      + Schedule Follow-up
                    </Button>
                  </div>

                  {leadFollowUps.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No follow-ups scheduled for this prospect.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {leadFollowUps.map((flp) => (
                        <div
                          key={flp.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 font-mono">
                                {flp.date} @ {flp.time}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  flp.status === 'completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {flp.status}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1">{flp.remarks}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Assigned: {flp.assignedStaffName}
                            </span>
                          </div>

                          {flp.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                updateLead(lead.id, {});
                              }}
                            >
                              Active
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Note Input */}
                  <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Type internal notes regarding site visits, loan pre-approvals, discount negotiations..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full text-xs rounded-md border border-slate-200 p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" variant="brand" size="sm" disabled={!noteText.trim()}>
                        <Send className="w-3.5 h-3.5 mr-1" /> Post Note
                      </Button>
                    </div>
                  </form>

                  {/* Notes Feed */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {lead.notes?.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notes added yet.</p>
                    ) : (
                      lead.notes?.map((n) => (
                        <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <span className="font-bold text-slate-800">{n.authorName}</span>
                            <span className="font-mono text-[11px]">{formatDateTime(n.createdAt)}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Website Pixel Activity */}
              {activeTab === 'website' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                    <Globe className="w-4 h-4 inline mr-1 text-blue-600" />
                    <strong>Meta Pixel & Website SDK Tracker:</strong> Captured IP session activity for this prospect prior to lead form conversion.
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-800">Pageview: /projects/luxury-penthouses</span>
                        <span className="text-[11px] text-slate-400 font-mono">2m 45s dwell</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Referrer: facebook.com/ads/experience</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-800">Pageview: /pricing-and-emi-calculator</span>
                        <span className="text-[11px] text-slate-400 font-mono">1m 15s dwell</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Interaction: Downloaded Floor Plan Brochure PDF</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-emerald-700">Form Submission: /lead-gen-instant-form</span>
                        <span className="text-[11px] text-emerald-600 font-bold font-mono">CONVERTED</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Utm Campaign: fb_luxury_highrise_q4</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Follow-up Modal */}
      <Modal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        maxWidth="sm"
        title="Schedule Follow-up Call"
      >
        <form onSubmit={handleScheduleFollowUp} className="space-y-3">
          <Input
            label="Follow-up Date *"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            required
          />

          <Input
            label="Follow-up Time *"
            type="time"
            value={followUpTime}
            onChange={(e) => setFollowUpTime(e.target.value)}
            required
          />

          <Select
            label="Priority Level"
            value={followUpPriority}
            onChange={(e) => setFollowUpPriority(e.target.value as any)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
              Follow-up Agenda / Goal
            </label>
            <textarea
              rows={2}
              className="w-full text-xs rounded-md border border-slate-200 p-2 outline-none focus:border-brand-500"
              placeholder="e.g. Discuss down payment terms, send unit floor plans..."
              value={followUpRemarks}
              onChange={(e) => setFollowUpRemarks(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Confirm Follow-up
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        maxWidth="sm"
        title="Update Lead Stage"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Current stage is <strong>{lead.status.toUpperCase()}</strong>. Select new pipeline stage:
          </p>

          <Select
            label="New Status"
            value={lead.status}
            onChange={(e) => {
              updateLead(lead.id, { status: e.target.value as LeadStatus });
              setIsStatusModalOpen(false);
            }}
          >
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="followup">Follow-up</option>
            <option value="converted">Converted (Closed Won)</option>
            <option value="lost">Lost (Closed Lost)</option>
            <option value="not_connected">Not Connected</option>
          </Select>
        </div>
      </Modal>

      {/* Convert to Sale Modal */}
      <Modal
        isOpen={isSaleOpen}
        onClose={() => setIsSaleOpen(false)}
        maxWidth="md"
        title="Record Sale & Mark Converted"
      >
        <form onSubmit={handleConvertSale} className="space-y-3">
          <Input
            label="Sale Agreement Value (₹ INR) *"
            type="number"
            value={saleAmount}
            onChange={(e) => setSaleAmount(Number(e.target.value))}
            required
          />

          <Input
            label="Unit / Property Finalized *"
            value={saleProduct}
            onChange={(e) => setSaleProduct(e.target.value)}
            required
          />

          <Select
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as any)}
          >
            <option value="paid">Fully Cleared / Loan Disbursed</option>
            <option value="partial">Token Advance Received</option>
            <option value="pending">Pending Bank Verification</option>
          </Select>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsSaleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Finalize Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        lead={lead}
      />
    </div>
  );
};
