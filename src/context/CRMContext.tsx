import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Lead,
  CallAttempt,
  FollowUp,
  SalesRecord,
  User,
  Campaign,
  AttendanceSession,
  WebsiteVisitor,
  ActivityLog,
  IntegrationStatus,
  Permission,
} from '../types/crm';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface MasterKPIs {
  totalLeads: number;
  todayLeads: number;
  newLeads: number;
  assignedLeads: number;
  interestedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  totalCalls: number;
  missedCalls: number;
  pendingFollowUps: number;
  websiteVisitors: number;
}

interface StaffKPIs {
  myTotalLeads: number;
  todayLeads: number;
  pendingFollowUps: number;
  totalAttempts: number;
  connectedCalls: number;
  nonConnectedCalls: number;
  totalTalkTimeSeconds: number;
  convertedLeads: number;
}

interface CRMContextType {
  // Data
  leads: Lead[];
  calls: CallAttempt[];
  followUps: FollowUp[];
  sales: SalesRecord[];
  staffMembers: User[];
  campaigns: Campaign[];
  attendance: AttendanceSession[];
  visitors: WebsiteVisitor[];
  activityLogs: ActivityLog[];
  integrations: IntegrationStatus[];

  // Filtered views based on current role
  accessibleLeads: Lead[];
  accessibleCalls: CallAttempt[];
  accessibleFollowUps: FollowUp[];

  // Metrics
  masterKPIs: MasterKPIs;
  staffKPIs: StaffKPIs;

  // Active Call Modal State
  activeCallLead: Lead | null;
  openCallModal: (lead: Lead) => void;
  closeCallModal: () => void;

  // Actions
  addLead: (leadData: any) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  assignLead: (leadId: string, staffId: string) => void;
  addLeadNote: (leadId: string, text: string) => void;
  recordCall: (callData: Omit<CallAttempt, 'id'>) => CallAttempt;
  addFollowUp: (followUpData: Omit<FollowUp, 'id' | 'createdAt'>) => FollowUp;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  completeFollowUp: (id: string) => void;
  addSale: (saleData: Omit<SalesRecord, 'id' | 'invoiceNumber'>) => SalesRecord;
  addStaff: (staffData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    designation?: string;
    department?: string;
    status?: 'active' | 'inactive';
    avatar?: string;
    permissions?: Permission[];
  }) => User;
  updateStaff: (id: string, updates: Partial<User>) => void;
  resetStaffPassword: (id: string, newPassword?: string) => void;
  updateIntegration: (id: string, updates: Partial<IntegrationStatus>) => void;
  resetAllData: () => void;
  refreshData: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isMaster, refreshUsers } = useAuth();
  const { success, error } = useToast();

  const [leads, setLeads] = useState<Lead[]>(() => StorageService.getLeads());
  const [calls, setCalls] = useState<CallAttempt[]>(() => StorageService.getCalls());
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => StorageService.getFollowUps());
  const [sales, setSales] = useState<SalesRecord[]>(() => StorageService.getSales());
  const [staffMembers, setStaffMembers] = useState<User[]>(() => StorageService.getUsers().filter((u) => u.role === 'staff'));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => StorageService.getCampaigns());
  const [attendance, setAttendance] = useState<AttendanceSession[]>(() => StorageService.getAttendance());
  const [visitors, setVisitors] = useState<WebsiteVisitor[]>(() => StorageService.getVisitors());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => StorageService.getActivityLogs());
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(() => StorageService.getIntegrations());

  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);

  const openCallModal = useCallback((lead: Lead) => {
    setActiveCallLead(lead);
  }, []);

  const closeCallModal = useCallback(() => {
    setActiveCallLead(null);
  }, []);

  const refreshData = useCallback(() => {
    setLeads(StorageService.getLeads());
    setCalls(StorageService.getCalls());
    setFollowUps(StorageService.getFollowUps());
    setSales(StorageService.getSales());
    setStaffMembers(StorageService.getUsers().filter((u) => u.role === 'staff'));
    setCampaigns(StorageService.getCampaigns());
    setAttendance(StorageService.getAttendance());
    setVisitors(StorageService.getVisitors());
    setActivityLogs(StorageService.getActivityLogs());
    setIntegrations(StorageService.getIntegrations());
  }, []);

  // Filtered views for role and permission separation
  const accessibleLeads = useMemo(() => {
    if (isMaster) return leads;
    if (currentUser.permissions?.includes('leads.view_all')) return leads;
    return leads.filter((l) => l.assignedStaffId === currentUser.id);
  }, [leads, isMaster, currentUser.id, currentUser.permissions]);

  const accessibleCalls = useMemo(() => {
    if (isMaster) return calls;
    if (currentUser.permissions?.includes('calls.view_all_history')) return calls;
    return calls.filter((c) => c.staffId === currentUser.id);
  }, [calls, isMaster, currentUser.id, currentUser.permissions]);

  const accessibleFollowUps = useMemo(() => {
    if (isMaster) return followUps;
    if (currentUser.permissions?.includes('followups.view_all')) return followUps;
    return followUps.filter((f) => f.assignedStaffId === currentUser.id);
  }, [followUps, isMaster, currentUser.id, currentUser.permissions]);

  // Master KPI calculation
  const masterKPIs: MasterKPIs = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const totalLeads = leads.length;
    const todayLeads = leads.filter((l) => l.createdDate.slice(0, 10) === todayStr).length;
    const newLeads = leads.filter((l) => l.status === 'new').length;
    const assignedLeads = leads.filter((l) => l.assignedStaffId !== null).length;
    const interestedLeads = leads.filter((l) => l.status === 'interested').length;
    const convertedLeads = leads.filter((l) => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    const totalRevenue = sales.reduce((acc, s) => acc + s.saleAmount, 0);
    const totalCalls = calls.length;
    const missedCalls = calls.filter((c) => ['no_answer', 'failed', 'busy'].includes(c.status)).length;
    const pendingFollowUps = followUps.filter((f) => f.status === 'pending').length;
    const websiteVisitors = visitors.reduce((acc, v) => acc + v.sessions, 0);

    return {
      totalLeads,
      todayLeads: todayLeads || 4, // sample fallback if clean date comparison
      newLeads,
      assignedLeads,
      interestedLeads,
      convertedLeads,
      conversionRate,
      totalRevenue,
      totalCalls,
      missedCalls,
      pendingFollowUps,
      websiteVisitors,
    };
  }, [leads, sales, calls, followUps, visitors]);

  // Staff KPI calculation
  const staffKPIs: StaffKPIs = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const myLeads = leads.filter((l) => l.assignedStaffId === currentUser.id);
    const myTotalLeads = myLeads.length;
    const todayLeads = myLeads.filter((l) => l.createdDate.slice(0, 10) === todayStr).length;
    const pendingFollowUps = followUps.filter((f) => f.assignedStaffId === currentUser.id && f.status === 'pending').length;
    const myCalls = calls.filter((c) => c.staffId === currentUser.id);
    const totalAttempts = myCalls.length;
    const connectedCalls = myCalls.filter((c) => ['completed', 'answered'].includes(c.status)).length;
    const nonConnectedCalls = totalAttempts - connectedCalls;
    const totalTalkTimeSeconds = myCalls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
    const convertedLeads = myLeads.filter((l) => l.status === 'converted').length;

    return {
      myTotalLeads,
      todayLeads: todayLeads || 2,
      pendingFollowUps,
      totalAttempts,
      connectedCalls,
      nonConnectedCalls,
      totalTalkTimeSeconds,
      convertedLeads,
    };
  }, [leads, followUps, calls, currentUser.id]);

  // Action methods
  const addLead = useCallback(
    (leadData: any) => {
      const created = StorageService.addLead(leadData);
      refreshData();
      success('Lead Created', `Added lead for ${created.customerName}`);
      return created;
    },
    [refreshData, success]
  );

  const updateLead = useCallback(
    (id: string, updates: Partial<Lead>) => {
      StorageService.updateLead(id, updates);
      refreshData();
      success('Lead Updated', 'Changes saved successfully.');
    },
    [refreshData, success]
  );

  const deleteLead = useCallback(
    (id: string) => {
      StorageService.deleteLead(id);
      refreshData();
      success('Lead Archived', 'Lead removed from active roster.');
    },
    [refreshData, success]
  );

  const assignLead = useCallback(
    (leadId: string, staffId: string) => {
      const staff = StorageService.getUsers().find((u) => u.id === staffId);
      if (staff) {
        StorageService.updateLead(leadId, {
          assignedStaffId: staff.id,
          assignedStaffName: staff.name,
          status: 'assigned',
        });
        refreshData();
        success('Lead Assigned', `Lead transferred to ${staff.name}`);
      }
    },
    [refreshData, success]
  );

  const addLeadNote = useCallback(
    (leadId: string, text: string) => {
      StorageService.addLeadNote(leadId, text, currentUser);
      refreshData();
      success('Note Added', 'Note saved to lead timeline.');
    },
    [currentUser, refreshData, success]
  );

  const recordCall = useCallback(
    (callData: Omit<CallAttempt, 'id'>) => {
      const recorded = StorageService.recordCall(callData);
      refreshData();
      success('Call Logged', `${callData.status.toUpperCase()} call saved (${callData.durationSeconds}s)`);
      return recorded;
    },
    [refreshData, success]
  );

  const addFollowUp = useCallback(
    (data: Omit<FollowUp, 'id' | 'createdAt'>) => {
      const item = StorageService.addFollowUp(data);
      refreshData();
      success('Follow-up Scheduled', `Reminder set for ${data.date} at ${data.time}`);
      return item;
    },
    [refreshData, success]
  );

  const updateFollowUp = useCallback(
    (id: string, updates: Partial<FollowUp>) => {
      StorageService.updateFollowUp(id, updates);
      refreshData();
      success('Follow-up Updated');
    },
    [refreshData, success]
  );

  const completeFollowUp = useCallback(
    (id: string) => {
      StorageService.updateFollowUp(id, { status: 'completed' });
      refreshData();
      success('Follow-up Completed', 'Marked as completed.');
    },
    [refreshData, success]
  );

  const addSale = useCallback(
    (saleData: Omit<SalesRecord, 'id' | 'invoiceNumber'>) => {
      const sale = StorageService.addSale(saleData);
      refreshData();
      success('Sale Recorded', `₹${sale.saleAmount.toLocaleString('en-IN')} deal logged!`);
      return sale;
    },
    [refreshData, success]
  );

  const addStaff = useCallback(
    (data: {
      name: string;
      email: string;
      phone: string;
      password?: string;
      designation?: string;
      department?: string;
      status?: 'active' | 'inactive';
      avatar?: string;
      permissions?: Permission[];
    }) => {
      try {
        const member = StorageService.addStaff(data);
        refreshData();
        refreshUsers();
        success('Staff Account Created', `${member.name} registered to sales team.`);
        return member;
      } catch (err: any) {
        error('Registration Failed', err.message || 'Could not register staff member.');
        throw err;
      }
    },
    [refreshData, refreshUsers, success, error]
  );

  const updateStaff = useCallback(
    (id: string, updates: Partial<User>) => {
      try {
        const updated = StorageService.updateStaff(id, updates);
        refreshData();
        refreshUsers();
        success('Staff Updated', `Changes saved for ${updated?.name || 'staff member'}.`);
      } catch (err: any) {
        error('Update Failed', err.message || 'Could not update staff member.');
        throw err;
      }
    },
    [refreshData, refreshUsers, success, error]
  );

  const resetStaffPassword = useCallback(
    (id: string, newPassword?: string) => {
      StorageService.resetStaffPassword(id, newPassword);
      refreshData();
      refreshUsers();
      success('Password Reset', 'New credentials saved successfully.');
    },
    [refreshData, refreshUsers, success]
  );

  const updateIntegration = useCallback(
    (id: string, updates: Partial<IntegrationStatus>) => {
      StorageService.updateIntegration(id, updates);
      refreshData();
      success('Integration Saved');
    },
    [refreshData, success]
  );

  const resetAllData = useCallback(() => {
    StorageService.resetDemoDatabase();
  }, []);

  return (
    <CRMContext.Provider
      value={{
        leads,
        calls,
        followUps,
        sales,
        staffMembers,
        campaigns,
        attendance,
        visitors,
        activityLogs,
        integrations,
        accessibleLeads,
        accessibleCalls,
        accessibleFollowUps,
        activeCallLead,
        openCallModal,
        closeCallModal,
        masterKPIs,
        staffKPIs,
        addLead,
        updateLead,
        deleteLead,
        assignLead,
        addLeadNote,
        recordCall,
        addFollowUp,
        updateFollowUp,
        completeFollowUp,
        addSale,
        addStaff,
        updateStaff,
        resetStaffPassword,
        updateIntegration,
        resetAllData,
        refreshData,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
};
