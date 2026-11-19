import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Lead,
  CallAttempt,
  Permission,
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
  PERMISSION_TEMPLATES,
  PermissionTemplateName,
} from '../../types/crm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { formatDuration, formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  UserPlus,
  Edit,
  KeyRound,
  CheckCircle,
  XCircle,
  Users,
  PhoneCall,
  Clock,
  ExternalLink,
  Lock,
  UserX,
  UserCheck,
  AlertTriangle,
  Eye,
  Calendar,
  BadgeDollarSign,
  PhoneOutgoing,
  CheckSquare,
  Square,
  Sparkles,
  Shield,
  Layers,
  Award,
} from 'lucide-react';

export const TeamManagementPage: React.FC = () => {
  const {
    staffMembers,
    leads,
    calls,
    sales,
    attendance,
    addStaff,
    updateStaff,
    resetStaffPassword,
    openCallModal,
  } = useCRM();
  const { isMaster, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Modals state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState<User | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<'overview' | 'leads' | 'calls' | 'attendance' | 'duties'>('overview');
  const [deactivatingStaff, setDeactivatingStaff] = useState<User | null>(null);
  const [passwordResetStaff, setPasswordResetStaff] = useState<User | null>(null);

  // Add staff form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newPassword, setNewPassword] = useState('Demo@123');
  const [confirmPassword, setConfirmPassword] = useState('Demo@123');
  const [newDesignation, setNewDesignation] = useState('Sales Executive');
  const [newDept, setNewDept] = useState('Inbound Meta Sales');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');
  const [newAvatar, setNewAvatar] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(PERMISSION_TEMPLATES['Sales Executive']);
  const [activeTemplate, setActiveTemplate] = useState<PermissionTemplateName>('Sales Executive');
  const [addFormError, setAddFormError] = useState('');

  // Edit staff form state
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [editDesignation, setEditDesignation] = useState('');
  const [editError, setEditError] = useState('');

  // Password reset form state
  const [resetPassInput, setResetPassInput] = useState('Demo@123');
  const [resetPassConfirm, setResetPassConfirm] = useState('Demo@123');
  const [resetError, setResetError] = useState('');

  // Metrics
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((s) => s.status === 'active').length;
  const inactiveStaff = totalStaff - activeStaff;
  const totalTeamCalls = calls.length;

  const handleOpenAddStaff = () => {
    setNewName('');
    setNewEmail('');
    setNewPhone('+91 ');
    setNewPassword('Demo@123');
    setConfirmPassword('Demo@123');
    setNewDesignation('Sales Executive');
    setNewDept('Inbound Meta Sales');
    setNewStatus('active');
    setNewAvatar('');
    setSelectedPermissions([...PERMISSION_TEMPLATES['Sales Executive']]);
    setActiveTemplate('Sales Executive');
    setAddFormError('');
    setIsAddStaffOpen(true);
  };

  const handleApplyTemplate = (templateName: PermissionTemplateName) => {
    setActiveTemplate(templateName);
    setSelectedPermissions([...PERMISSION_TEMPLATES[templateName]]);
  };

  const handleTogglePermission = (key: Permission) => {
    setSelectedPermissions((prev) => {
      const exists = prev.includes(key);
      const updated = exists ? prev.filter((p) => p !== key) : [...prev, key];
      setActiveTemplate('Custom Role');
      return updated;
    });
  };

  const handleToggleGroup = (permissions: { key: Permission }[]) => {
    const keys = permissions.map((p) => p.key);
    const allSelected = keys.every((k) => selectedPermissions.includes(k));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !keys.includes(p)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...keys])));
    }
    setActiveTemplate('Custom Role');
  };

  const handleSelectAll = () => {
    setSelectedPermissions([...ALL_PERMISSIONS]);
    setActiveTemplate('Custom Role');
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
    setActiveTemplate('Custom Role');
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError('');

    if (!newName.trim() || newName.trim().length < 2) {
      setAddFormError('Full name must be at least 2 characters.');
      return;
    }

    if (!newEmail.trim() || !newEmail.includes('@') || !newEmail.includes('.')) {
      setAddFormError('Please enter a valid work email address.');
      return;
    }

    if (newPassword.length < 6) {
      setAddFormError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setAddFormError('Password and Confirm Password do not match.');
      return;
    }

    try {
      addStaff({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        password: newPassword,
        designation: newDesignation.trim(),
        department: newDept,
        status: newStatus,
        avatar: newAvatar.trim() || undefined,
        permissions: selectedPermissions,
      });

      setIsAddStaffOpen(false);
    } catch (err: any) {
      setAddFormError(err.message || 'Error creating staff account.');
    }
  };

  const handleOpenEdit = (staff: User) => {
    setEditingStaff(staff);
    setEditDesignation(staff.designation || 'Sales Executive');
    setEditPermissions(staff.permissions && staff.permissions.length > 0 ? staff.permissions : PERMISSION_TEMPLATES['Sales Executive']);
    setEditError('');
  };

  const handleToggleEditPermission = (key: Permission) => {
    setEditPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setEditError('');

    try {
      updateStaff(editingStaff.id, {
        name: editingStaff.name.trim(),
        email: editingStaff.email.trim(),
        phone: editingStaff.phone.trim(),
        designation: editDesignation.trim(),
        department: editingStaff.department,
        status: editingStaff.status,
        permissions: editPermissions,
      });
      setEditingStaff(null);
    } catch (err: any) {
      setEditError(err.message || 'Error updating staff account.');
    }
  };

  const handleConfirmDeactivate = () => {
    if (!deactivatingStaff) return;
    updateStaff(deactivatingStaff.id, { status: 'inactive' });
    setDeactivatingStaff(null);
  };

  const handleActivate = (staff: User) => {
    updateStaff(staff.id, { status: 'active' });
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetStaff) return;
    setResetError('');

    if (resetPassInput.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }

    if (resetPassInput !== resetPassConfirm) {
      setResetError('Passwords do not match.');
      return;
    }

    resetStaffPassword(passwordResetStaff.id, resetPassInput);
    setPasswordResetStaff(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Sales Team & Dynamic Duty Roster</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              Unlimited Staff Roster
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage sales representatives, customize individual duty permissions, review dialer workloads, and control logins
          </p>
        </div>

        {isMaster && (
          <Button
            variant="brand"
            size="md"
            className="shadow-md hover:shadow-lg transition-all text-xs sm:text-sm font-semibold px-4 py-2 w-full sm:w-auto"
            onClick={handleOpenAddStaff}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add New Staff
          </Button>
        )}
      </div>

      {/* Aggregate Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Staff Accounts</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalStaff}</span>
          <span className="text-[11px] text-slate-500">Registered sales reps</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Active Sales Reps</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{activeStaff}</span>
          <span className="text-[11px] text-emerald-700">Eligible to receive leads</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Deactivated Accounts</span>
          <span className="text-2xl font-bold text-slate-500 mt-1 block">{inactiveStaff}</span>
          <span className="text-[11px] text-slate-500">Login blocked, logs preserved</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-blue-600 block">Team Calling Output</span>
          <span className="text-2xl font-bold text-blue-600 mt-1 block">{totalTeamCalls} dials</span>
          <span className="text-[11px] text-blue-700">PBX call attempts tracked</span>
        </div>
      </div>

      {/* Team Roster Table */}
      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm">Sales Staff Directory ({staffMembers.length})</CardTitle>
            <p className="text-xs text-slate-500">Live roster of sales representatives, their assigned duties, and performance</p>
          </div>
          {isMaster && (
            <Button variant="outline" size="sm" onClick={handleOpenAddStaff} className="w-full sm:w-auto">
              <UserPlus className="w-3.5 h-3.5 mr-1" /> Add Staff Member
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Staff Member</th>
                <th className="py-3 px-3">Designation & Duties</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3 text-center">Assigned Leads</th>
                <th className="py-3 px-3 text-center">Calls Made</th>
                <th className="py-3 px-3">Talk Time</th>
                <th className="py-3 px-3 text-center">Won</th>
                <th className="py-3 px-3">Account Status</th>
                {isMaster && <th className="py-3 px-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff) => {
                const staffLeads = leads.filter((l) => l.assignedStaffId === staff.id);
                const staffCalls = calls.filter((c) => c.staffId === staff.id);
                const connectedCalls = staffCalls.filter((c) => ['completed', 'answered'].includes(c.status));
                const totalTalkSeconds = staffCalls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
                const converted = staffLeads.filter((l) => l.status === 'converted');
                const isInactive = staff.status === 'inactive';
                const dutyCount = staff.permissions?.length || 0;

                return (
                  <tr
                    key={staff.id}
                    className={`transition-colors ${
                      isInactive ? 'bg-slate-50/60 opacity-75 hover:bg-slate-100/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Name & Avatar */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <button
                            onClick={() => {
                              setSelectedStaffProfile(staff);
                              setProfileActiveTab('overview');
                            }}
                            className="font-bold text-slate-900 hover:text-brand-600 block text-left"
                            title="Click to view full dossier"
                          >
                            {staff.name}
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono">{staff.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Duties */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block truncate max-w-[170px]">
                        {staff.designation || 'Sales Executive'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                          {dutyCount} duties
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {staff.department || 'Inbound Sales'}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3">
                      <span className="text-slate-900 block font-medium">{staff.email}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{staff.phone}</span>
                    </td>

                    {/* Leads */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700">
                        {staffLeads.length}
                      </span>
                    </td>

                    {/* Calls */}
                    <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">
                      {staffCalls.length}
                    </td>

                    {/* Talk Time */}
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {formatDuration(totalTalkSeconds)}
                    </td>

                    {/* Converted */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700">
                        {converted.length}
                      </span>
                    </td>

                    {/* Account Status */}
                    <td className="py-3 px-3">
                      {staff.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" /> Deactivated
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {isMaster && (
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-slate-600 hover:text-slate-900"
                            onClick={() => {
                              setSelectedStaffProfile(staff);
                              setProfileActiveTab('overview');
                            }}
                            title="View Profile Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-slate-600 hover:text-slate-900"
                            onClick={() => handleOpenEdit(staff)}
                            title="Edit Staff & Permissions"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                            onClick={() => {
                              setPasswordResetStaff(staff);
                              setResetPassInput('Demo@123');
                              setResetPassConfirm('Demo@123');
                              setResetError('');
                            }}
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </Button>

                          {staff.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                              onClick={() => setDeactivatingStaff(staff)}
                              title="Deactivate Account"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                              onClick={() => handleActivate(staff)}
                              title="Reactivate Account"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add New Staff & Duty Assignment Modal */}
      <Modal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        maxWidth="2xl"
        title="Add New Sales Representative & Assign Duties"
        description="Register an inside sales team member, define customized operational duties, and set login credentials"
      >
        <form onSubmit={handleAddStaffSubmit} className="space-y-5">
          {addFormError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{addFormError}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-600" /> Step 1: Employee Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. Vikramaditya Rathore"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setAddFormError('');
                }}
                required
              />

              <Input
                label="Email Address (Login Username) *"
                type="email"
                placeholder="e.g. vikram@demo.com"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setAddFormError('');
                }}
                required
              />

              <Input
                label="Mobile Number *"
                placeholder="+91 98200 XXXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Employee Designation *
                </label>
                <select
                  value={newDesignation}
                  onChange={(e) => {
                    setNewDesignation(e.target.value);
                    if (e.target.value in PERMISSION_TEMPLATES) {
                      handleApplyTemplate(e.target.value as PermissionTemplateName);
                    }
                  }}
                  className="w-full h-9 bg-white border border-slate-300 rounded-md px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                >
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Senior Sales Executive">Senior Sales Executive</option>
                  <option value="Lead Manager">Lead Manager</option>
                  <option value="Calling Executive">Calling Executive</option>
                  <option value="Key Account Manager">Key Account Manager</option>
                  <option value="Telecaller">Telecaller</option>
                  <option value="Inside Sales Specialist">Inside Sales Specialist</option>
                </select>
              </div>

              <Select
                label="Department / Sales Team *"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              >
                <option value="Inbound Meta Sales">Inbound Meta Sales</option>
                <option value="High-Ticket Closing">High-Ticket Closing</option>
                <option value="WhatsApp Lead Response">WhatsApp Lead Response</option>
                <option value="Direct Web Inquiries">Direct Web Inquiries</option>
                <option value="Luxury Villa Sales">Luxury Villa Sales</option>
              </Select>

              <Select
                label="Account Status *"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="active">Active (Permit Immediate Login)</option>
                <option value="inactive">Inactive (Deactivated on Creation)</option>
              </Select>

              <Input
                label="Password *"
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setAddFormError('');
                }}
                required
              />

              <Input
                label="Confirm Password *"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setAddFormError('');
                }}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Profile Image URL (Optional)"
                  placeholder="https://images.unsplash.com/... or leave empty for auto-avatar"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Granular Duty & Permission Assignment */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-600" /> Step 2: Assign Duties & Permissions
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select a pre-built template or customize individual operational permissions
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                >
                  Deselect All
                </button>
                <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold font-mono text-[11px] border border-brand-200">
                  {selectedPermissions.length} / {ALL_PERMISSIONS.length} Enabled
                </span>
              </div>
            </div>

            {/* Template Selector Pills */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Quick Role Templates
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    'Sales Executive',
                    'Senior Sales Executive',
                    'Lead Manager',
                    'Calling Executive',
                    'Custom Role',
                  ] as PermissionTemplateName[]
                ).map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                      activeTemplate === tpl
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {tpl === 'Sales Executive' && '💼 '}
                    {tpl === 'Senior Sales Executive' && '🌟 '}
                    {tpl === 'Lead Manager' && '🎯 '}
                    {tpl === 'Calling Executive' && '📞 '}
                    {tpl === 'Custom Role' && '⚙️ '}
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Groups Checkboxes */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              {PERMISSION_GROUPS.map((group) => {
                const groupKeys = group.permissions.map((p) => p.key);
                const isGroupAllSelected = groupKeys.every((k) => selectedPermissions.includes(k));
                const selectedInGroup = groupKeys.filter((k) => selectedPermissions.includes(k)).length;

                return (
                  <div key={group.id} className="bg-white p-3 rounded-lg border border-slate-200/80">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{group.label}</span>
                        <p className="text-[10px] text-slate-400">{group.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleGroup(group.permissions)}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                      >
                        {isGroupAllSelected ? 'Deselect Group' : `Select All (${selectedInGroup}/${groupKeys.length})`}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.permissions.map((p) => {
                        const checked = selectedPermissions.includes(p.key);
                        return (
                          <label
                            key={p.key}
                            className={`flex items-start gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                              checked
                                ? 'bg-brand-50/50 border-brand-200'
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleTogglePermission(p.key)}
                              className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block leading-tight">
                                {p.label}
                              </span>
                              <span className="text-[10px] text-brand-600 font-mono font-medium block">
                                {p.key}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                                {p.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStaffOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Register Staff & Assign Duties
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff & Permissions Modal */}
      <Modal
        isOpen={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        maxWidth="2xl"
        title="Edit Staff Information & Duty Permissions"
        description={editingStaff ? `Updating employee record for ${editingStaff.name}` : ''}
      >
        {editingStaff && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {editError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700">
                {editError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                required
              />

              <Input
                label="Email Address *"
                type="email"
                value={editingStaff.email}
                onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                required
              />

              <Input
                label="Mobile Number"
                value={editingStaff.phone}
                onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
              />

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Employee Designation
                </label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full h-9 bg-white border border-slate-300 rounded-md px-3 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <Select
                label="Department"
                value={editingStaff.department || 'Inbound Meta Sales'}
                onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
              >
                <option value="Inbound Meta Sales">Inbound Meta Sales</option>
                <option value="High-Ticket Closing">High-Ticket Closing</option>
                <option value="WhatsApp Lead Response">WhatsApp Lead Response</option>
                <option value="Direct Web Inquiries">Direct Web Inquiries</option>
                <option value="Luxury Villa Sales">Luxury Villa Sales</option>
              </Select>

              <Select
                label="Account Status"
                value={editingStaff.status}
                onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
              >
                <option value="active">Active (Can log in & receive leads)</option>
                <option value="inactive">Inactive (Deactivated)</option>
              </Select>
            </div>

            {/* Granular Permissions Editor */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Assigned Duties ({editPermissions.length} Active)
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditPermissions([...ALL_PERMISSIONS])}
                    className="text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setEditPermissions([])}
                    className="text-[11px] font-semibold text-slate-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.id} className="bg-white p-2.5 rounded border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900 block mb-1.5">{group.label}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {group.permissions.map((p) => {
                        const checked = editPermissions.includes(p.key);
                        return (
                          <label key={p.key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleEditPermission(p.key)}
                              className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                            />
                            <span className="font-medium truncate">{p.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingStaff(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" size="sm">
                Save Profile & Duties
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Deactivation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deactivatingStaff}
        onClose={() => setDeactivatingStaff(null)}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate Staff Account?"
        message={`Are you sure you want to deactivate ${deactivatingStaff?.name}'s account? They will be immediately blocked from logging in. All historical leads, calls, performance logs, and attendance records will remain preserved.`}
        confirmText="Confirm Deactivation"
        variant="danger"
      />

      {/* Reset Password Modal */}
      <Modal
        isOpen={!!passwordResetStaff}
        onClose={() => setPasswordResetStaff(null)}
        maxWidth="sm"
        title="Reset Staff Password"
        description={passwordResetStaff ? `Set new login password for ${passwordResetStaff.name} (${passwordResetStaff.email})` : ''}
      >
        <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
          {resetError && (
            <p className="text-xs text-rose-500 bg-rose-50 p-2 rounded border border-rose-200">
              {resetError}
            </p>
          )}

          <Input
            label="New Password *"
            type="password"
            value={resetPassInput}
            onChange={(e) => setResetPassInput(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password *"
            type="password"
            value={resetPassConfirm}
            onChange={(e) => setResetPassConfirm(e.target.value)}
            required
          />

          <div className="pt-1 flex items-center justify-between text-xs">
            <button
              type="button"
              className="text-brand-600 hover:underline font-semibold"
              onClick={() => {
                setResetPassInput('Demo@123');
                setResetPassConfirm('Demo@123');
              }}
            >
              Set to Default (Demo@123)
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setPasswordResetStaff(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Save New Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Comprehensive Staff Profile View Modal */}
      <Modal
        isOpen={!!selectedStaffProfile}
        onClose={() => setSelectedStaffProfile(null)}
        maxWidth="2xl"
        title={selectedStaffProfile ? `${selectedStaffProfile.name} — Staff Profile & Performance Dossier` : ''}
      >
        {selectedStaffProfile && (() => {
          const staffLeads = leads.filter((l) => l.assignedStaffId === selectedStaffProfile.id);
          const staffCalls = calls.filter((c) => c.staffId === selectedStaffProfile.id);
          const staffSales = sales.filter((s) => s.assignedStaffId === selectedStaffProfile.id);
          const staffAttendance = attendance.filter((a) => a.staffId === selectedStaffProfile.id);
          const connectedCalls = staffCalls.filter((c) => ['completed', 'answered'].includes(c.status));
          const totalTalk = staffCalls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
          const totalRev = staffSales.reduce((acc, s) => acc + s.saleAmount, 0);
          const staffDuties = selectedStaffProfile.permissions || [];

          return (
            <div className="space-y-4">
              {/* Header Profile Snippet */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedStaffProfile.avatar}
                    alt={selectedStaffProfile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{selectedStaffProfile.name}</h4>
                      {selectedStaffProfile.status === 'active' ? (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                          Deactivated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {selectedStaffProfile.email} • {selectedStaffProfile.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-slate-800">
                        {selectedStaffProfile.designation || 'Sales Executive'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {selectedStaffProfile.department || 'Inbound Sales'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[11px]">Registered On</span>
                  <span className="font-semibold text-slate-700">{formatDate(selectedStaffProfile.createdAt)}</span>
                </div>
              </div>

              {/* Profile Sub-tabs */}
              <div className="border-b border-slate-200 flex flex-wrap items-center gap-3 text-xs font-semibold">
                {[
                  { key: 'overview', label: 'Performance Overview' },
                  { key: 'duties', label: `Duties (${staffDuties.length})` },
                  { key: 'leads', label: `Assigned Leads (${staffLeads.length})` },
                  { key: 'calls', label: `Calling Log (${staffCalls.length})` },
                  { key: 'attendance', label: `Attendance (${staffAttendance.length})` },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setProfileActiveTab(t.key as any)}
                    className={`py-2.5 border-b-2 transition-all ${
                      profileActiveTab === t.key
                        ? 'border-brand-600 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab 1: Performance Overview */}
              {profileActiveTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Leads</span>
                      <span className="text-xl font-bold text-slate-900 mt-1 block">{staffLeads.length}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Dials</span>
                      <span className="text-xl font-bold text-blue-600 mt-1 block">{staffCalls.length}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Connected</span>
                      <span className="text-xl font-bold text-emerald-600 mt-1 block">{connectedCalls.length}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Talk Time</span>
                      <span className="text-xl font-bold text-slate-900 mt-1 block">{formatDuration(totalTalk)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs font-bold text-slate-800 block mb-1">Conversion Yield</span>
                      <p className="text-2xl font-bold text-emerald-600">
                        {staffLeads.length > 0 ? Math.round((staffSales.length / staffLeads.length) * 100) : 0}%
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {staffSales.length} closed deals from {staffLeads.length} prospects
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs font-bold text-slate-800 block mb-1">Closed Revenue</span>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRev)}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Turnover realized in bookings
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Duties & Permissions */}
              {profileActiveTab === 'duties' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Operational Duty Entitlements</span>
                    <span className="font-mono text-brand-600 font-bold">{staffDuties.length} Duties Assigned</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {PERMISSION_GROUPS.map((group) => {
                      const grantedInGroup = group.permissions.filter((p) => staffDuties.includes(p.key));
                      if (grantedInGroup.length === 0) return null;

                      return (
                        <div key={group.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">{group.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              {grantedInGroup.length} of {group.permissions.length}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {grantedInGroup.map((p) => (
                              <div key={p.key} className="flex items-center gap-1.5 text-xs text-slate-800">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-medium truncate">{p.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Assigned Leads */}
              {profileActiveTab === 'leads' && (
                <div className="max-h-72 overflow-y-auto">
                  {staffLeads.length === 0 ? (
                    <p className="py-8 text-center text-slate-400 text-xs">No leads currently assigned to this representative.</p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase">
                        <tr>
                          <th className="p-2">Lead ID</th>
                          <th className="p-2">Customer</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Attempts</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {staffLeads.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50">
                            <td className="p-2 font-mono font-bold text-brand-600">{l.id}</td>
                            <td className="p-2 font-bold text-slate-900">{l.customerName}</td>
                            <td className="p-2 font-mono text-slate-600">{l.phone}</td>
                            <td className="p-2">
                              <StatusBadge status={l.status} size="sm" />
                            </td>
                            <td className="p-2 font-mono">{l.totalAttempts}</td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => {
                                  setSelectedStaffProfile(null);
                                  navigate(`/leads/${l.id}`);
                                }}
                                className="text-brand-600 hover:underline font-semibold"
                              >
                                View Lead →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Sub-tab 4: Calling History */}
              {profileActiveTab === 'calls' && (
                <div className="max-h-72 overflow-y-auto">
                  {staffCalls.length === 0 ? (
                    <p className="py-8 text-center text-slate-400 text-xs">No call attempts logged for this representative.</p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase">
                        <tr>
                          <th className="p-2">Call ID</th>
                          <th className="p-2">Lead Name</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Duration</th>
                          <th className="p-2">Date & Time</th>
                          <th className="p-2">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {staffCalls.slice(0, 15).map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-2 font-mono text-brand-600 font-bold">{c.id}</td>
                            <td className="p-2 font-medium text-slate-900">{c.leadName}</td>
                            <td className="p-2">
                              <span className="font-bold text-[10px] uppercase text-slate-700">{c.status}</span>
                            </td>
                            <td className="p-2 font-mono">{formatDuration(c.durationSeconds || 0)}</td>
                            <td className="p-2 text-slate-400 font-mono text-[11px]">{formatDateTime(c.startTime)}</td>
                            <td className="p-2 text-slate-600 max-w-[150px] truncate">{c.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Sub-tab 5: Attendance */}
              {profileActiveTab === 'attendance' && (
                <div className="max-h-72 overflow-y-auto">
                  {staffAttendance.length === 0 ? (
                    <p className="py-8 text-center text-slate-400 text-xs">No login sessions recorded.</p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase">
                        <tr>
                          <th className="p-2">Date</th>
                          <th className="p-2">Clock In</th>
                          <th className="p-2">Clock Out</th>
                          <th className="p-2">Session Duration</th>
                          <th className="p-2">Talk Time</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {staffAttendance.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-slate-900">{a.date}</td>
                            <td className="p-2 font-mono text-slate-600">{a.loginTime ? formatDateTime(a.loginTime) : '—'}</td>
                            <td className="p-2 font-mono text-slate-600">{a.logoutTime ? formatDateTime(a.logoutTime) : 'Active'}</td>
                            <td className="p-2 font-mono">{a.totalSessionDurationMinutes} min</td>
                            <td className="p-2 font-mono text-emerald-600 font-bold">{a.totalTalkTimeMinutes} min</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${a.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setSelectedStaffProfile(null)}>
                  Close Dossier
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
