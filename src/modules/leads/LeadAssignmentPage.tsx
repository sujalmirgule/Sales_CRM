import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { User, Lead } from '../../types/crm';
import { SourceBadge } from '../../components/common/SourceBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  UserCheck,
  Users,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Filter,
  UserX,
  Shield,
  Layers,
  Inbox,
  SendHorizontal,
  ArrowLeftRight,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const LeadAssignmentPage: React.FC = () => {
  const { leads, staffMembers, updateLead, refreshData } = useCRM();
  const { isMaster } = useAuth();

  // Active eligible staff (only active staff accounts with permission to handle leads)
  const eligibleStaff = staffMembers.filter(
    (s) =>
      s.status === 'active' &&
      (!s.permissions || s.permissions.includes('leads.view') || s.permissions.includes('leads.view_all'))
  );

  const [activeTab, setActiveTab] = useState<'unassigned' | 'assigned'>('unassigned');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [targetStaffId, setTargetStaffId] = useState<string>(eligibleStaff[0]?.id || '');
  const [assignedFilterStaff, setAssignedFilterStaff] = useState<string>('all');
  const [reassignTargetStaffId, setReassignTargetStaffId] = useState<string>(eligibleStaff[0]?.id || '');

  const unassignedLeads = leads.filter((l) => !l.assignedStaffId);
  const assignedLeads = leads.filter((l) => !!l.assignedStaffId);

  // Filtered assigned leads
  const filteredAssignedLeads = assignedFilterStaff === 'all'
    ? assignedLeads
    : assignedLeads.filter((l) => l.assignedStaffId === assignedFilterStaff);

  const handleToggleSelect = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (leadList: Lead[]) => {
    if (selectedLeads.length === leadList.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadList.map((l) => l.id));
    }
  };

  // Bulk assign unassigned leads
  const handleBulkAssign = () => {
    const staff = eligibleStaff.find((s) => s.id === targetStaffId);
    if (!staff || selectedLeads.length === 0) return;

    selectedLeads.forEach((id) => {
      updateLead(id, {
        assignedStaffId: staff.id,
        assignedStaffName: staff.name,
        status: 'assigned',
      });
    });

    setSelectedLeads([]);
  };

  // Bulk reassign assigned leads
  const handleBulkReassign = () => {
    const staff = eligibleStaff.find((s) => s.id === reassignTargetStaffId);
    if (!staff || selectedLeads.length === 0) return;

    selectedLeads.forEach((id) => {
      updateLead(id, {
        assignedStaffId: staff.id,
        assignedStaffName: staff.name,
      });
    });

    setSelectedLeads([]);
  };

  // Automated round-robin routing across eligible active staff
  const handleAutoRoundRobin = () => {
    if (unassignedLeads.length === 0 || eligibleStaff.length === 0) return;

    unassignedLeads.forEach((lead, index) => {
      const staff = eligibleStaff[index % eligibleStaff.length];
      updateLead(lead.id, {
        assignedStaffId: staff.id,
        assignedStaffName: staff.name,
        status: 'assigned',
      });
    });

    setSelectedLeads([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Lead Assignment & Duty Distribution</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              {eligibleStaff.length} Eligible Reps
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamic lead routing engine for Meta Ads inquiries, round-robin allocation, and active workload balancing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="brand"
            size="sm"
            onClick={handleAutoRoundRobin}
            disabled={unassignedLeads.length === 0 || eligibleStaff.length === 0}
            className="w-full sm:w-auto"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300" /> Auto-Distribute Round Robin
          </Button>
        </div>
      </div>

      {/* KPI Workload Summary Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Leads Inbound</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{leads.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">From Meta Ads & forms</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Unassigned Queue</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{unassignedLeads.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting rep assignment</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Assigned Pipeline</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{assignedLeads.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Assigned to sales staff</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Eligible Active Reps</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">{eligibleStaff.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active staff with lead duties</span>
        </Card>
      </div>

      {/* Staff Workload Cards (Fully Dynamic) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Sales Rep Workload & Capacity Roster ({staffMembers.length} Staff)
          </h3>
          <span className="text-[11px] text-slate-400">
            {eligibleStaff.length} active recipients eligible for assignment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {staffMembers.map((staff) => {
            const staffLeads = leads.filter((l) => l.assignedStaffId === staff.id);
            const activePipeline = staffLeads.filter((l) =>
              ['assigned', 'contacted', 'interested', 'followup'].includes(l.status)
            );
            const converted = staffLeads.filter((l) => l.status === 'converted');
            const isInactive = staff.status === 'inactive';
            const maxLeadsBenchmark = 20;
            const workloadPct = Math.min(100, Math.round((staffLeads.length / maxLeadsBenchmark) * 100));

            return (
              <Card
                key={staff.id}
                className={`p-3.5 transition-all ${
                  isInactive ? 'opacity-60 bg-slate-50/80 border-dashed border-slate-300' : 'hover:shadow-card'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{staff.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{staff.designation || 'Sales Executive'}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      isInactive
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isInactive ? 'Inactive' : 'Eligible'}
                  </span>
                </div>

                {/* Workload Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Workload Capacity</span>
                    <span className="font-semibold text-slate-700">{staffLeads.length} leads ({workloadPct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        workloadPct > 80
                          ? 'bg-rose-500'
                          : workloadPct > 50
                          ? 'bg-amber-500'
                          : 'bg-brand-500'
                      }`}
                      style={{ width: `${workloadPct}%` }}
                    />
                  </div>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-semibold block">Total</span>
                    <span className="font-bold text-slate-900">{staffLeads.length}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-semibold block">Active</span>
                    <span className="font-bold text-blue-600">{activePipeline.length}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-semibold block">Won</span>
                    <span className="font-bold text-emerald-600">{converted.length}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('unassigned');
            setSelectedLeads([]);
          }}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px ${
            activeTab === 'unassigned'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Unassigned Inbound Queue</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {unassignedLeads.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('assigned');
            setSelectedLeads([]);
          }}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-px ${
            activeTab === 'assigned'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Assigned Pipeline & Reassignment</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
            {assignedLeads.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Unassigned Inbound Leads */}
      {activeTab === 'unassigned' && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">Inbound Queue Awaiting Assignment ({unassignedLeads.length})</CardTitle>
              <p className="text-xs text-slate-500">
                Assign inquiries manually or use bulk assign to allocate leads to sales representatives
              </p>
            </div>

            {unassignedLeads.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <select
                  value={targetStaffId}
                  onChange={(e) => setTargetStaffId(e.target.value)}
                  className="h-8 text-xs bg-white border border-slate-200 rounded-md px-2 text-slate-700 font-medium focus:outline-none focus:border-brand-500"
                >
                  {eligibleStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      Assign to {s.name} ({s.designation || 'Sales'})
                    </option>
                  ))}
                </select>

                <Button
                  variant="brand"
                  size="sm"
                  onClick={handleBulkAssign}
                  disabled={selectedLeads.length === 0 || eligibleStaff.length === 0}
                >
                  <SendHorizontal className="w-3.5 h-3.5 mr-1" /> Assign Selected ({selectedLeads.length})
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          unassignedLeads.length > 0 && selectedLeads.length === unassignedLeads.length
                        }
                        onChange={() => handleSelectAll(unassignedLeads)}
                        className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Lead ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Source & Campaign</th>
                    <th className="p-3">Product Interest</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Received Time</th>
                    <th className="p-3 text-right">Direct Assign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unassignedLeads.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                        <p className="font-semibold text-slate-700">All inbound leads have been assigned!</p>
                        <p className="text-xs text-slate-400 mt-0.5">New leads from Meta Ads will automatically appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    unassignedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleToggleSelect(lead.id)}
                            className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-brand-600">{lead.id}</td>
                        <td className="p-3 font-bold text-slate-900">{lead.customerName}</td>
                        <td className="p-3 font-mono text-slate-600">{lead.phone}</td>
                        <td className="p-3">
                          <SourceBadge source={lead.source} size="sm" />
                          <span className="text-[11px] text-slate-500 block truncate max-w-[140px] mt-0.5">
                            {lead.campaign}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{lead.interestedProduct}</td>
                        <td className="p-3">
                          <PriorityBadge priority={lead.priority} size="sm" />
                        </td>
                        <td className="p-3 text-slate-400">{formatDate(lead.createdDate)}</td>
                        <td className="p-3 text-right">
                          <select
                            className="h-7 text-xs bg-white border border-slate-200 rounded px-2 text-slate-700 focus:outline-none focus:border-brand-500 font-medium cursor-pointer"
                            defaultValue=""
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const s = eligibleStaff.find((staff) => staff.id === e.target.value);
                              if (s) {
                                updateLead(lead.id, {
                                  assignedStaffId: s.id,
                                  assignedStaffName: s.name,
                                  status: 'assigned',
                                });
                              }
                            }}
                          >
                            <option value="" disabled>
                              Assign to rep...
                            </option>
                            {eligibleStaff.map((s) => (
                              <option key={s.id} value={s.id}>
                                → {s.name} ({s.designation || 'Sales'})
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Assigned Pipeline & Instant Reassignment */}
      {activeTab === 'assigned' && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm">Assigned Lead Pipeline ({filteredAssignedLeads.length})</CardTitle>
              <p className="text-xs text-slate-500">
                Filter by assigned representative or select multiple leads to reassign to another sales executive
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Filter by assigned staff */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Filter:</span>
                <select
                  value={assignedFilterStaff}
                  onChange={(e) => {
                    setAssignedFilterStaff(e.target.value);
                    setSelectedLeads([]);
                  }}
                  className="h-8 text-xs bg-white border border-slate-200 rounded-md px-2 text-slate-700 font-medium focus:outline-none focus:border-brand-500"
                >
                  <option value="all">All Sales Staff ({assignedLeads.length})</option>
                  {staffMembers.map((s) => {
                    const count = leads.filter((l) => l.assignedStaffId === s.id).length;
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({count} leads)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Bulk Reassign Dropdown */}
              {selectedLeads.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <select
                    value={reassignTargetStaffId}
                    onChange={(e) => setReassignTargetStaffId(e.target.value)}
                    className="h-8 text-xs bg-white border border-slate-200 rounded-md px-2 text-slate-700 font-medium focus:outline-none focus:border-brand-500"
                  >
                    {eligibleStaff.map((s) => (
                      <option key={s.id} value={s.id}>
                        Reassign to {s.name}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="brand"
                    size="sm"
                    onClick={handleBulkReassign}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Reassign ({selectedLeads.length})
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          filteredAssignedLeads.length > 0 && selectedLeads.length === filteredAssignedLeads.length
                        }
                        onChange={() => handleSelectAll(filteredAssignedLeads)}
                        className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Lead ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Current Representative</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Attempts</th>
                    <th className="p-3">Last Contact</th>
                    <th className="p-3 text-right">Reassign Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignedLeads.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No assigned leads match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => handleToggleSelect(lead.id)}
                            className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-brand-600">{lead.id}</td>
                        <td className="p-3 font-bold text-slate-900">{lead.customerName}</td>
                        <td className="p-3 font-mono text-slate-600">{lead.phone}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800">{lead.assignedStaffName}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={lead.status} size="sm" />
                        </td>
                        <td className="p-3 font-mono text-slate-700">
                          {lead.totalAttempts} ({lead.connectedAttempts} conn)
                        </td>
                        <td className="p-3 text-slate-400">
                          {lead.lastContactDate ? formatDate(lead.lastContactDate) : 'Not contacted yet'}
                        </td>
                        <td className="p-3 text-right">
                          <select
                            className="h-7 text-xs bg-white border border-slate-200 rounded px-2 text-slate-700 focus:outline-none focus:border-brand-500 font-medium cursor-pointer"
                            value={lead.assignedStaffId || ''}
                            onChange={(e) => {
                              const s = eligibleStaff.find((staff) => staff.id === e.target.value);
                              if (s && s.id !== lead.assignedStaffId) {
                                updateLead(lead.id, {
                                  assignedStaffId: s.id,
                                  assignedStaffName: s.name,
                                });
                              }
                            }}
                          >
                            {eligibleStaff.map((s) => (
                              <option key={s.id} value={s.id}>
                                → {s.name} {s.id === lead.assignedStaffId ? '(Current)' : ''}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
