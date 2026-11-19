import {
  User,
  Lead,
  CallAttempt,
  FollowUp,
  SalesRecord,
  Campaign,
  AttendanceSession,
  WebsiteVisitor,
  ActivityLog,
  IntegrationStatus,
  Permission,
  ALL_PERMISSIONS,
  PERMISSION_TEMPLATES,
} from '../types/crm';

import {
  INITIAL_USERS,
  INITIAL_LEADS,
  INITIAL_CALLS,
  INITIAL_FOLLOWUPS,
  INITIAL_SALES,
  INITIAL_CAMPAIGNS,
  INITIAL_ATTENDANCE,
  INITIAL_VISITORS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_INTEGRATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'crm_demo_users_v1',
  LEADS: 'crm_demo_leads_v1',
  CALLS: 'crm_demo_calls_v1',
  FOLLOWUPS: 'crm_demo_followups_v1',
  SALES: 'crm_demo_sales_v1',
  CAMPAIGNS: 'crm_demo_campaigns_v1',
  ATTENDANCE: 'crm_demo_attendance_v1',
  VISITORS: 'crm_demo_visitors_v1',
  ACTIVITY_LOGS: 'crm_demo_logs_v1',
  INTEGRATIONS: 'crm_demo_integrations_v1',
  CURRENT_USER_ID: 'crm_demo_current_user_id_v1',
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export class StorageService {
  // Users
  static getUsers(): User[] {
    const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    // Ensure all users have default password, status, designation, and permissions if loaded from older localStorage
    return users.map((u) => {
      let defaultPermissions: Permission[] = [];
      let defaultDesignation = u.designation;

      if (u.role === 'master') {
        defaultPermissions = ALL_PERMISSIONS;
        defaultDesignation = defaultDesignation || 'Managing Director & Founder';
      } else if (u.id === 'USR-STAFF-02' || u.name.includes('Priya')) {
        defaultPermissions = PERMISSION_TEMPLATES['Senior Sales Executive'];
        defaultDesignation = defaultDesignation || 'Senior Sales Executive';
      } else {
        defaultPermissions = PERMISSION_TEMPLATES['Sales Executive'];
        defaultDesignation = defaultDesignation || 'Sales Executive';
      }

      return {
        ...u,
        password: u.password || 'Demo@123',
        status: u.status || 'active',
        designation: defaultDesignation,
        permissions: u.permissions && u.permissions.length > 0 ? u.permissions : defaultPermissions,
        createdAt: u.createdAt || '2026-11-01T09:00:00Z',
      };
    });
  }

  static saveUsers(users: User[]): void {
    setStoredItem(STORAGE_KEYS.USERS, users);
  }

  static getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = getStoredItem(STORAGE_KEYS.CURRENT_USER_ID, 'USR-MASTER-01');
    const user = users.find((u) => u.id === currentId);
    return user || users[0];
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  static setCurrentUser(userId: string): void {
    setStoredItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  // Leads
  static getLeads(): Lead[] {
    return getStoredItem(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  }

  static saveLeads(leads: Lead[]): void {
    setStoredItem(STORAGE_KEYS.LEADS, leads);
  }

  static getLeadById(id: string): Lead | undefined {
    return this.getLeads().find((l) => l.id === id);
  }

  static addLead(newLead: Omit<Lead, 'id' | 'createdDate' | 'totalAttempts' | 'connectedAttempts' | 'nonConnectedAttempts' | 'totalTalkTimeSeconds' | 'firstAttemptDate' | 'lastContactDate' | 'notes'> & { notes?: any[] }): Lead {
    const leads = this.getLeads();
    const nextNum = leads.length + 1001;
    const lead: Lead = {
      ...newLead,
      id: `LEAD-${nextNum}`,
      createdDate: new Date().toISOString(),
      totalAttempts: 0,
      connectedAttempts: 0,
      nonConnectedAttempts: 0,
      totalTalkTimeSeconds: 0,
      firstAttemptDate: null,
      lastContactDate: null,
      notes: newLead.notes || [],
    };
    leads.unshift(lead);
    this.saveLeads(leads);

    this.addActivityLog({
      activity: 'Lead Created',
      entity: `Lead ${lead.id}`,
      entityId: lead.id,
      description: `New lead created for ${lead.customerName} (${lead.phone}) from ${lead.source}.`,
    });

    return lead;
  }

  static updateLead(id: string, updates: Partial<Lead>): Lead | undefined {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return undefined;

    const oldLead = leads[index];
    const updatedLead = { ...oldLead, ...updates };
    leads[index] = updatedLead;
    this.saveLeads(leads);

    if (updates.status && updates.status !== oldLead.status) {
      this.addActivityLog({
        activity: 'Lead Status Changed',
        entity: `Lead ${id}`,
        entityId: id,
        description: `Status for ${updatedLead.customerName} updated from ${oldLead.status} to ${updates.status}.`,
      });
    }

    if (updates.assignedStaffId && updates.assignedStaffId !== oldLead.assignedStaffId) {
      this.addActivityLog({
        activity: 'Lead Reassigned',
        entity: `Lead ${id}`,
        entityId: id,
        description: `Lead ${updatedLead.customerName} assigned to ${updates.assignedStaffName}.`,
      });
    }

    return updatedLead;
  }

  static deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const lead = leads.find((l) => l.id === id);
    if (!lead) return false;
    const filtered = leads.filter((l) => l.id !== id);
    this.saveLeads(filtered);

    this.addActivityLog({
      activity: 'Lead Archived',
      entity: `Lead ${id}`,
      entityId: id,
      description: `Lead ${lead.customerName} was archived by user.`,
    });
    return true;
  }

  static addLeadNote(leadId: string, noteText: string, author: User): void {
    const leads = this.getLeads();
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const newNote = {
      id: `NOTE-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      text: noteText,
      createdAt: new Date().toISOString(),
    };

    lead.notes = lead.notes ? [newNote, ...lead.notes] : [newNote];
    this.saveLeads(leads);

    this.addActivityLog({
      activity: 'Note Added',
      entity: `Lead ${leadId}`,
      entityId: leadId,
      description: `${author.name} added a note to lead ${lead.customerName}.`,
    });
  }

  // Calls
  static getCalls(): CallAttempt[] {
    return getStoredItem(STORAGE_KEYS.CALLS, INITIAL_CALLS);
  }

  static saveCalls(calls: CallAttempt[]): void {
    setStoredItem(STORAGE_KEYS.CALLS, calls);
  }

  static recordCall(callData: Omit<CallAttempt, 'id'>): CallAttempt {
    const calls = this.getCalls();
    const call: CallAttempt = {
      ...callData,
      id: `CALL-${Date.now().toString().slice(-4)}`,
    };
    calls.unshift(call);
    this.saveCalls(calls);

    // Update lead statistics
    const lead = this.getLeadById(call.leadId);
    if (lead) {
      const isConnected = ['completed', 'answered'].includes(call.status);
      const updates: Partial<Lead> = {
        totalAttempts: (lead.totalAttempts || 0) + 1,
        connectedAttempts: (lead.connectedAttempts || 0) + (isConnected ? 1 : 0),
        nonConnectedAttempts: (lead.nonConnectedAttempts || 0) + (isConnected ? 0 : 1),
        totalTalkTimeSeconds: (lead.totalTalkTimeSeconds || 0) + call.durationSeconds,
        lastContactDate: new Date().toISOString(),
        firstAttemptDate: lead.firstAttemptDate || new Date().toISOString(),
      };

      // Auto update status if currently new or assigned
      if (['new', 'assigned'].includes(lead.status)) {
        updates.status = isConnected ? 'contacted' : 'not_connected';
      } else if (lead.status === 'not_connected' && isConnected) {
        updates.status = 'contacted';
      }

      this.updateLead(lead.id, updates);
    }

    // Update staff attendance talk time
    this.incrementAttendanceTalkTime(call.staffId, call.durationSeconds);

    this.addActivityLog({
      activity: 'Call Attempted',
      entity: `Call ${call.id}`,
      entityId: call.id,
      description: `${call.staffName} made a ${call.direction} call to ${call.leadName} (${call.status}, duration: ${call.durationSeconds}s).`,
    });

    return call;
  }

  // Follow-ups
  static getFollowUps(): FollowUp[] {
    return getStoredItem(STORAGE_KEYS.FOLLOWUPS, INITIAL_FOLLOWUPS);
  }

  static saveFollowUps(followups: FollowUp[]): void {
    setStoredItem(STORAGE_KEYS.FOLLOWUPS, followups);
  }

  static addFollowUp(item: Omit<FollowUp, 'id' | 'createdAt'>): FollowUp {
    const followups = this.getFollowUps();
    const followUp: FollowUp = {
      ...item,
      id: `FLP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    followups.unshift(followUp);
    this.saveFollowUps(followups);

    // Update lead next follow up date
    this.updateLead(item.leadId, {
      nextFollowUpDate: `${item.date}T${item.time}:00Z`,
      status: 'followup',
    });

    this.addActivityLog({
      activity: 'Follow-up Scheduled',
      entity: `Follow-up ${followUp.id}`,
      entityId: followUp.id,
      description: `Follow-up scheduled with ${item.customerName} for ${item.date} at ${item.time}.`,
    });

    return followUp;
  }

  static updateFollowUp(id: string, updates: Partial<FollowUp>): FollowUp | undefined {
    const list = this.getFollowUps();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...updates };
    this.saveFollowUps(list);

    if (updates.status === 'completed') {
      this.addActivityLog({
        activity: 'Follow-up Completed',
        entity: `Follow-up ${id}`,
        entityId: id,
        description: `Follow-up with ${list[idx].customerName} marked as completed.`,
      });
    }

    return list[idx];
  }

  // Sales
  static getSales(): SalesRecord[] {
    return getStoredItem(STORAGE_KEYS.SALES, INITIAL_SALES);
  }

  static saveSales(sales: SalesRecord[]): void {
    setStoredItem(STORAGE_KEYS.SALES, sales);
  }

  static addSale(saleData: Omit<SalesRecord, 'id' | 'invoiceNumber'>): SalesRecord {
    const sales = this.getSales();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sale: SalesRecord = {
      ...saleData,
      id: `SALE-${Date.now().toString().slice(-4)}`,
      invoiceNumber,
    };
    sales.unshift(sale);
    this.saveSales(sales);

    // Also mark the lead as converted
    this.updateLead(sale.leadId, {
      status: 'converted',
    });

    this.addActivityLog({
      activity: 'Lead Converted to Sale',
      entity: `Sale ${sale.id}`,
      entityId: sale.id,
      description: `Booking closed for ${sale.customerName} by ${sale.assignedStaffName} — Amount ₹${sale.saleAmount.toLocaleString('en-IN')}.`,
    });

    return sale;
  }

  // Staff Management
  static addStaff(staffData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    designation?: string;
    department?: string;
    status?: 'active' | 'inactive';
    avatar?: string;
    permissions?: Permission[];
  }): User {
    const users = this.getUsers();

    // Check duplicate email
    const trimmedEmail = staffData.email.toLowerCase().trim();
    const existing = users.find((u) => u.email.toLowerCase().trim() === trimmedEmail);
    if (existing) {
      throw new Error(`An account with email "${staffData.email}" already exists.`);
    }

    const nextStaffNum = (users.filter((u) => u.role === 'staff').length + 1).toString().padStart(2, '0');
    const newStaff: User = {
      id: `USR-STAFF-${nextStaffNum}-${Date.now().toString().slice(-3)}`,
      name: staffData.name.trim(),
      email: trimmedEmail,
      phone: staffData.phone.trim(),
      password: staffData.password || 'Demo@123',
      role: 'staff',
      designation: staffData.designation?.trim() || 'Sales Executive',
      department: staffData.department || 'Inbound Sales',
      status: staffData.status || 'active',
      permissions: staffData.permissions && staffData.permissions.length > 0
        ? staffData.permissions
        : PERMISSION_TEMPLATES['Sales Executive'],
      loginStatus: 'offline',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      avatar:
        staffData.avatar?.trim() ||
        `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=250&q=80`,
    };

    users.push(newStaff);
    this.saveUsers(users);

    this.addActivityLog({
      activity: 'Staff Account Created',
      entity: `User ${newStaff.id}`,
      entityId: newStaff.id,
      description: `New staff member ${newStaff.name} (${newStaff.designation}) registered with ${newStaff.permissions?.length || 0} permissions.`,
    });

    return newStaff;
  }

  static getEligibleAssignees(): User[] {
    const users = this.getUsers();
    return users.filter(
      (u) =>
        u.role === 'staff' &&
        u.status === 'active' &&
        (!u.permissions || u.permissions.includes('leads.view') || u.permissions.includes('leads.view_all'))
    );
  }

  static updateStaff(id: string, updates: Partial<User>): User | undefined {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;

    // Check duplicate email if changing
    if (updates.email && updates.email.toLowerCase().trim() !== users[idx].email.toLowerCase().trim()) {
      const trimmedEmail = updates.email.toLowerCase().trim();
      const existing = users.find((u) => u.id !== id && u.email.toLowerCase().trim() === trimmedEmail);
      if (existing) {
        throw new Error(`An account with email "${updates.email}" already exists.`);
      }
    }

    const oldStatus = users[idx].status;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);

    const desc =
      updates.status && updates.status !== oldStatus
        ? `Staff member ${users[idx].name} account was ${updates.status === 'active' ? 'activated' : 'deactivated'}.`
        : `Updated profile details for staff member ${users[idx].name}.`;

    this.addActivityLog({
      activity: updates.status && updates.status !== oldStatus ? 'Staff Status Changed' : 'Staff Profile Updated',
      entity: `User ${id}`,
      entityId: id,
      description: desc,
    });

    return users[idx];
  }

  static resetStaffPassword(id: string, newPassword?: string): boolean {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;

    const finalPass = newPassword || 'Demo@123';
    users[idx].password = finalPass;
    this.saveUsers(users);

    this.addActivityLog({
      activity: 'Staff Password Reset',
      entity: `User ${id}`,
      entityId: id,
      description: `Password reset for ${users[idx].name} (${users[idx].email}).`,
    });

    return true;
  }

  // Attendance & Sessions
  static getAttendance(): AttendanceSession[] {
    return getStoredItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }

  static saveAttendance(sessions: AttendanceSession[]): void {
    setStoredItem(STORAGE_KEYS.ATTENDANCE, sessions);
  }

  static incrementAttendanceTalkTime(staffId: string, talkSeconds: number): void {
    const attendance = this.getAttendance();
    const today = new Date().toISOString().slice(0, 10);
    const session = attendance.find((a) => a.staffId === staffId && a.date === today && a.status === 'active');
    if (session) {
      session.totalTalkTimeMinutes += Math.round(talkSeconds / 60);
      session.totalCallingTimeMinutes += Math.max(1, Math.round(talkSeconds / 60));
      this.saveAttendance(attendance);
    }
  }

  // Campaigns
  static getCampaigns(): Campaign[] {
    return getStoredItem(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  }

  static saveCampaigns(campaigns: Campaign[]): void {
    setStoredItem(STORAGE_KEYS.CAMPAIGNS, campaigns);
  }

  // Website Visitors
  static getVisitors(): WebsiteVisitor[] {
    return getStoredItem(STORAGE_KEYS.VISITORS, INITIAL_VISITORS);
  }

  // Activity Logs
  static getActivityLogs(): ActivityLog[] {
    return getStoredItem(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  }

  static addActivityLog(logData: { activity: string; entity: string; entityId: string; description: string }): void {
    const logs = this.getActivityLogs();
    const currentUser = this.getCurrentUser();
    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      activity: logData.activity,
      user: currentUser.name,
      role: currentUser.role,
      entity: logData.entity,
      entityId: logData.entityId,
      timestamp: new Date().toISOString(),
      description: logData.description,
    };
    logs.unshift(newLog);
    // Keep max 100 logs
    setStoredItem(STORAGE_KEYS.ACTIVITY_LOGS, logs.slice(0, 100));
  }

  // Integrations
  static getIntegrations(): IntegrationStatus[] {
    return getStoredItem(STORAGE_KEYS.INTEGRATIONS, INITIAL_INTEGRATIONS);
  }

  static updateIntegration(id: string, updates: Partial<IntegrationStatus>): void {
    const list = this.getIntegrations();
    const idx = list.findIndex((i) => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStoredItem(STORAGE_KEYS.INTEGRATIONS, list);
    }
  }

  // Reset entire database to factory seed data
  static resetDemoDatabase(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }
}
