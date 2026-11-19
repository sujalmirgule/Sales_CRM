import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { Lead, LeadStatus, LeadSource } from '../../types/crm';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SourceBadge } from '../../components/common/SourceBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AssignStaffModal } from '../../components/common/AssignStaffModal';
import { exportToCSV } from '../../utils/exportCsv';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  Search,
  Filter,
  Download,
  Plus,
  PhoneCall,
  UserCheck,
  Trash2,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  PhoneOutgoing,
} from 'lucide-react';

export const LeadListPage: React.FC = () => {
  const { accessibleLeads, deleteLead, updateLead, openCallModal, staffMembers } = useCRM();
  const { isMaster, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Lead>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [leadToAssign, setLeadToAssign] = useState<Lead | null>(null);

  // Filter & Sort Logic
  const filteredLeads = useMemo(() => {
    return accessibleLeads.filter((lead) => {
      const matchesSearch =
        search === '' ||
        lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.id.toLowerCase().includes(search.toLowerCase()) ||
        lead.campaign.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesStaff =
        staffFilter === 'all' ||
        (staffFilter === 'unassigned' && !lead.assignedStaffId) ||
        lead.assignedStaffId === staffFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesStaff;
    });
  }, [accessibleLeads, search, statusFilter, sourceFilter, staffFilter]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredLeads, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;
  const paginatedLeads = sortedLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      sortedLeads,
      'CRM_Leads_Report',
      [
        { key: 'id', header: 'Lead ID' },
        { key: 'customerName', header: 'Customer Name' },
        { key: 'phone', header: 'Phone' },
        { key: 'email', header: 'Email' },
        { key: 'source', header: 'Lead Source' },
        { key: 'campaign', header: 'Campaign' },
        { key: 'interestedProduct', header: 'Interested Product' },
        { key: 'assignedStaffName', header: 'Assigned Staff', transform: (val) => val || 'Unassigned' },
        { key: 'status', header: 'Status' },
        { key: 'priority', header: 'Priority' },
        { key: 'totalAttempts', header: 'Total Attempts' },
        { key: 'totalTalkTimeSeconds', header: 'Talk Time (sec)' },
        { key: 'createdDate', header: 'Created Date', transform: (val) => formatDate(val) },
        { key: 'lastContactDate', header: 'Last Contact', transform: (val) => formatDateTime(val) },
        { key: 'remarks', header: 'Remarks' },
      ]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isMaster ? 'All Sales Leads Pipeline' : 'My Assigned Leads'}
          </h2>
          <p className="text-xs text-slate-500">
            Showing {sortedLeads.length} prospects in active sales tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(isMaster || hasPermission('leads.export')) && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-3.5 h-3.5 mr-1" /> Export CSV ({sortedLeads.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer, phone, email, lead ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Statuses ({accessibleLeads.length})</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="followup">Follow-up</option>
            <option value="converted">Converted</option>
            <option value="not_connected">Not Connected</option>
            <option value="lost">Lost</option>
          </Select>

          {/* Source Filter */}
          <Select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Marketing Sources</option>
            <option value="facebook_ads">Meta Facebook Ads</option>
            <option value="instagram_ads">Instagram Ads</option>
            <option value="whatsapp">WhatsApp Enquiry</option>
            <option value="website_form">Website Form</option>
            <option value="google">Google Ads</option>
            <option value="manual">Manual Entry</option>
            <option value="referral">VIP Referral</option>
          </Select>

          {/* Staff Filter (Master only) */}
          {isMaster ? (
            <Select
              value={staffFilter}
              onChange={(e) => {
                setStaffFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Staff Reps</option>
              <option value="unassigned">Unassigned Only</option>
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          ) : (
            <div className="flex items-center text-xs font-semibold text-slate-500 px-3 bg-slate-50 rounded-md border border-slate-200">
              Assigned to you
            </div>
          )}
        </div>
      </Card>

      {/* Main Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider select-none">
              <tr>
                <th className="py-3 px-3">
                  <button onClick={() => handleSort('id')} className="flex items-center gap-1 hover:text-slate-900">
                    Lead ID <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button onClick={() => handleSort('customerName')} className="flex items-center gap-1 hover:text-slate-900">
                    Customer Name <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Phone & Email</th>
                <th className="py-3 px-3">Source & Campaign</th>
                {isMaster && <th className="py-3 px-3">Assigned Staff</th>}
                <th className="py-3 px-3">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-slate-900">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3 text-center">
                  <button onClick={() => handleSort('totalAttempts')} className="flex items-center gap-1 justify-center hover:text-slate-900">
                    Attempts <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Next Follow-up</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No leads matching your current search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-3 font-mono font-bold text-brand-600">
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="hover:underline flex items-center gap-1"
                      >
                        {lead.id}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="font-bold text-slate-900 hover:text-brand-600 block text-left"
                      >
                        {lead.customerName}
                      </button>
                      <span className="text-[11px] text-slate-500">{lead.interestedProduct}</span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-900 block font-medium">{lead.phone}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">{lead.email}</span>
                    </td>

                    {/* Source & Campaign */}
                    <td className="py-3 px-3">
                      <SourceBadge source={lead.source} size="sm" />
                      <span className="text-[11px] text-slate-500 block truncate max-w-[150px] mt-0.5">
                        {lead.campaign}
                      </span>
                    </td>

                    {/* Staff */}
                    {isMaster && (
                      <td className="py-3 px-3">
                        {lead.assignedStaffName ? (
                          <span className="font-medium text-slate-700">{lead.assignedStaffName}</span>
                        ) : (
                          <button
                            onClick={() => setLeadToAssign(lead)}
                            className="text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 font-semibold"
                          >
                            + Assign Staff
                          </button>
                        )}
                      </td>
                    )}

                    {/* Status */}
                    <td className="py-3 px-3">
                      <StatusBadge status={lead.status} size="sm" />
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3">
                      <PriorityBadge priority={lead.priority} size="sm" />
                    </td>

                    {/* Attempts */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold text-xs ${
                          lead.totalAttempts > 0 ? 'bg-slate-100 text-slate-800' : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {lead.totalAttempts || 0}
                      </span>
                    </td>

                    {/* Next Follow-up */}
                    <td className="py-3 px-3 text-slate-600">
                      {formatDateTime(lead.nextFollowUpDate)}
                    </td>

                    {/* Created */}
                    <td className="py-3 px-3 text-slate-400">
                      {formatDate(lead.createdDate)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(isMaster || hasPermission('calls.initiate')) && (
                          <Button
                            variant="brand"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => openCallModal(lead)}
                            title="Call Customer Now (Simulated)"
                          >
                            <PhoneOutgoing className="w-3 h-3 mr-1" /> Call
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          title="View Dossier"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>

                        {(isMaster || hasPermission('leads.archive')) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border-slate-200"
                            onClick={() => setLeadToDelete(lead)}
                            title="Archive Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedLeads.length)} of {sortedLeads.length} leads
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </Button>
            <span className="px-2 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete / Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={() => {
          if (leadToDelete) {
            deleteLead(leadToDelete.id);
            setLeadToDelete(null);
          }
        }}
        title="Archive Lead Prospect"
        message={`Are you sure you want to archive "${leadToDelete?.customerName}" (${leadToDelete?.phone})? It will be moved to archived records.`}
        confirmText="Archive Lead"
      />

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={!!leadToAssign}
        onClose={() => setLeadToAssign(null)}
        lead={leadToAssign}
      />
    </div>
  );
};
