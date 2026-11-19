export type UserRole = 'master' | 'staff';

export type Permission =
  | 'dashboard.view'
  | 'leads.view'
  | 'leads.view_all'
  | 'leads.create'
  | 'leads.edit'
  | 'leads.assign'
  | 'leads.archive'
  | 'leads.export'
  | 'calls.view'
  | 'calls.initiate'
  | 'calls.record_attempt'
  | 'calls.view_history'
  | 'calls.view_all_history'
  | 'followups.view'
  | 'followups.create'
  | 'followups.edit'
  | 'followups.complete'
  | 'followups.view_all'
  | 'sales.view'
  | 'sales.create'
  | 'sales.edit'
  | 'sales.view_revenue'
  | 'marketing.view'
  | 'campaigns.view'
  | 'campaigns.manage'
  | 'website_analytics.view'
  | 'website_analytics.export'
  | 'reports.view'
  | 'reports.export'
  | 'team.view'
  | 'team.manage'
  | 'attendance.view_own'
  | 'attendance.view_all'
  | 'activity_logs.view';

export interface PermissionGroup {
  id: string;
  label: string;
  description: string;
  permissions: {
    key: Permission;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Analytics, overview widgets, and KPI summaries',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard', description: 'Access main overview analytics and activity feeds' },
    ],
  },
  {
    id: 'leads',
    label: 'Lead Management',
    description: 'Inbound Meta Ads inquiries, contacts, pipeline stages, and allocation',
    permissions: [
      { key: 'leads.view', label: 'View Own Assigned Leads', description: 'Access leads assigned to this staff account' },
      { key: 'leads.view_all', label: 'View All System Leads', description: 'Access all team leads across all sources and reps' },
      { key: 'leads.create', label: 'Create New Leads', description: 'Manually register inbound prospects and WhatsApp leads' },
      { key: 'leads.edit', label: 'Edit Lead Details', description: 'Update customer contact info, budget, and pipeline stage' },
      { key: 'leads.assign', label: 'Assign & Reassign Leads', description: 'Distribute leads and execute round-robin routing' },
      { key: 'leads.archive', label: 'Archive / Delete Leads', description: 'Archive obsolete or junk inquiry records' },
      { key: 'leads.export', label: 'Export Leads to CSV', description: 'Download filtered lead data to CSV spreadsheets' },
    ],
  },
  {
    id: 'calling',
    label: 'Calling Management',
    description: 'Outbound tele-calling, virtual dialer, call disposition, and call recordings',
    permissions: [
      { key: 'calls.view', label: 'Access Calling Module', description: 'Access tele-calling queue and telephony dashboard' },
      { key: 'calls.initiate', label: 'Initiate Calls', description: 'Trigger virtual call dialer and click-to-call actions' },
      { key: 'calls.record_attempt', label: 'Record Call Attempts', description: 'Log disposition outcomes, duration, and remarks' },
      { key: 'calls.view_history', label: 'View Own Calling History', description: 'Review past calls initiated by this employee' },
      { key: 'calls.view_all_history', label: 'View All Team Calling Logs', description: 'Review calls made by all employees across the team' },
    ],
  },
  {
    id: 'followups',
    label: 'Follow-ups Management',
    description: 'Calendar scheduler, task reminders, and prospect callback triggers',
    permissions: [
      { key: 'followups.view', label: 'View Own Follow-ups', description: 'Access scheduled reminders for assigned leads' },
      { key: 'followups.create', label: 'Schedule Follow-ups', description: 'Set upcoming callback dates, times, and notes' },
      { key: 'followups.edit', label: 'Edit / Reschedule Follow-ups', description: 'Modify dates, times, and reminder notes' },
      { key: 'followups.complete', label: 'Mark Follow-ups Completed', description: 'Complete callback reminders and log resolutions' },
      { key: 'followups.view_all', label: 'View All Team Follow-ups', description: 'Monitor pending follow-ups for all staff' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales & Bookings',
    description: 'Order realization, confirmed sales, payment milestones, and revenue ledger',
    permissions: [
      { key: 'sales.view', label: 'View Sales Ledger', description: 'Review closed customer deal records and booking units' },
      { key: 'sales.create', label: 'Record New Conversions', description: 'Convert interested leads into realized sales bookings' },
      { key: 'sales.edit', label: 'Edit Sales Records', description: 'Update booking values, payment stages, and invoices' },
      { key: 'sales.view_revenue', label: 'View Financial Revenue Totals', description: 'Access aggregate revenue metrics and turnover totals' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing & Campaigns',
    description: 'Meta Ads (Facebook & Instagram) ad sets, leadgen webhooks, and CPL metrics',
    permissions: [
      { key: 'marketing.view', label: 'View Marketing Hub', description: 'Access ad campaign analytics and Meta Ads tracking' },
      { key: 'campaigns.view', label: 'View Campaign Performance', description: 'Review clicks, impressions, CPL, and lead yield' },
      { key: 'campaigns.manage', label: 'Manage Ad Connectors', description: 'Configure campaign webhooks and tracking budgets' },
    ],
  },
  {
    id: 'website_analytics',
    label: 'Website Analytics',
    description: 'Visitor attribution, landing page tracking, and traffic sources',
    permissions: [
      { key: 'website_analytics.view', label: 'View Website Traffic', description: 'Analyze visitor sessions, dwell times, and referrals' },
      { key: 'website_analytics.export', label: 'Export Visitor Logs', description: 'Export web attribution data to CSV' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports & Business Intelligence',
    description: 'Executive summaries, team productivity comparisons, and CSV data exports',
    permissions: [
      { key: 'reports.view', label: 'View Reports', description: 'Access aggregated performance charts and audit summaries' },
      { key: 'reports.export', label: 'Export Executive Reports', description: 'Download executive summary spreadsheets' },
    ],
  },
  {
    id: 'team',
    label: 'Team Management',
    description: 'Employee roster, duty permissions, staff profiles, and account controls',
    permissions: [
      { key: 'team.view', label: 'View Team Roster', description: 'See employee list, contact details, and status' },
      { key: 'team.manage', label: 'Manage Staff Accounts', description: 'Create, edit, deactivate, and assign duties to employees' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance & Sessions',
    description: 'Staff working hours, clock-in logs, and daily active calling time',
    permissions: [
      { key: 'attendance.view_own', label: 'View Own Attendance', description: 'Check personal login sessions and clock-in records' },
      { key: 'attendance.view_all', label: 'View All Staff Attendance', description: 'Monitor live login state and hours for the whole team' },
    ],
  },
  {
    id: 'activity_logs',
    label: 'System Activity Logs',
    description: 'Immutable system audit trail of administrative and operational events',
    permissions: [
      { key: 'activity_logs.view', label: 'View System Audit Logs', description: 'Access administrative audit trail and change logs' },
    ],
  },
];

export const ALL_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.key)
);

export type PermissionTemplateName =
  | 'Sales Executive'
  | 'Senior Sales Executive'
  | 'Lead Manager'
  | 'Calling Executive'
  | 'Custom Role';

export const PERMISSION_TEMPLATES: Record<PermissionTemplateName, Permission[]> = {
  'Sales Executive': [
    'dashboard.view',
    'leads.view',
    'leads.create',
    'leads.edit',
    'calls.view',
    'calls.initiate',
    'calls.record_attempt',
    'calls.view_history',
    'followups.view',
    'followups.create',
    'followups.edit',
    'followups.complete',
    'sales.view',
    'sales.create',
    'attendance.view_own',
  ],
  'Senior Sales Executive': [
    'dashboard.view',
    'leads.view',
    'leads.create',
    'leads.edit',
    'leads.export',
    'leads.assign',
    'calls.view',
    'calls.initiate',
    'calls.record_attempt',
    'calls.view_history',
    'calls.view_all_history',
    'followups.view',
    'followups.create',
    'followups.edit',
    'followups.complete',
    'followups.view_all',
    'sales.view',
    'sales.create',
    'sales.edit',
    'sales.view_revenue',
    'reports.view',
    'attendance.view_own',
  ],
  'Lead Manager': [
    'dashboard.view',
    'leads.view',
    'leads.view_all',
    'leads.create',
    'leads.edit',
    'leads.assign',
    'leads.archive',
    'leads.export',
    'calls.view',
    'calls.view_all_history',
    'followups.view',
    'followups.view_all',
    'reports.view',
    'reports.export',
    'team.view',
    'attendance.view_all',
    'marketing.view',
    'campaigns.view',
  ],
  'Calling Executive': [
    'dashboard.view',
    'leads.view',
    'calls.view',
    'calls.initiate',
    'calls.record_attempt',
    'calls.view_history',
    'followups.view',
    'followups.create',
    'followups.complete',
    'attendance.view_own',
  ],
  'Custom Role': [],
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  designation?: string;
  avatar?: string;
  department?: string;
  status: 'active' | 'inactive';
  loginStatus: 'online' | 'offline' | 'away';
  lastActive: string;
  createdAt?: string;
  permissions?: Permission[];
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  assignedLeads: number;
  totalCalls: number;
  connectedCalls: number;
  talkTimeSeconds: number;
  conversions: number;
  revenueGenerated: number;
  conversionRate: number;
}

export type LeadSource = 
  | 'facebook_ads' 
  | 'instagram_ads' 
  | 'meta_bundle'
  | 'whatsapp' 
  | 'website_form' 
  | 'google'
  | 'manual' 
  | 'referral';

export type LeadStatus = 
  | 'new' 
  | 'assigned' 
  | 'contacted' 
  | 'interested' 
  | 'followup' 
  | 'converted' 
  | 'lost' 
  | 'not_connected';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface LeadNote {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export type CallDirection = 'outgoing' | 'incoming';

export type CallStatus = 
  | 'initiated' 
  | 'ringing' 
  | 'answered' 
  | 'completed' 
  | 'no_answer' 
  | 'busy' 
  | 'failed' 
  | 'cancelled' 
  | 'rejected';

export interface CallAttempt {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  staffId: string;
  staffName: string;
  direction: CallDirection;
  status: CallStatus;
  attemptNumber: number;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  remarks: string;
  recordingUrl?: string;
}

export type FollowUpStatus = 'pending' | 'completed' | 'rescheduled' | 'cancelled';

export interface FollowUp {
  id: string;
  leadId: string;
  customerName: string;
  phone: string;
  assignedStaffId: string;
  assignedStaffName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  remarks: string;
  status: FollowUpStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface WebsiteEvent {
  id: string;
  page: string;
  title: string;
  timestamp: string;
  timeSpentSeconds: number;
}

export interface Lead {
  id: string; // e.g. "LEAD-1001"
  customerName: string;
  phone: string;
  email: string;
  source: LeadSource;
  campaign: string;
  interestedProduct: string;
  assignedStaffId: string | null;
  assignedStaffName: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  totalAttempts: number;
  connectedAttempts: number;
  nonConnectedAttempts: number;
  totalTalkTimeSeconds: number;
  firstAttemptDate: string | null;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  createdDate: string;
  remarks: string;
  city?: string;
  budget?: number;
  notes: LeadNote[];
  websiteActivity?: WebsiteEvent[];
}

export interface SalesRecord {
  id: string; // SALE-1001
  leadId: string;
  customerName: string;
  phone: string;
  product: string;
  saleAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  conversionDate: string;
  assignedStaffId: string;
  assignedStaffName: string;
  invoiceNumber: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'meta_bundle' | 'google' | 'direct';
  campaignId: string;
  adSet: string;
  totalSpend: number;
  totalLeads: number;
  costPerLead: number;
  conversions: number;
  revenue: number;
  roi: number;
  status: 'active' | 'paused' | 'completed';
}

export interface AttendanceSession {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  loginTime: string; // ISO
  logoutTime: string | null; // ISO
  totalSessionDurationMinutes: number;
  totalCallingTimeMinutes: number;
  totalTalkTimeMinutes: number;
  idleTimeMinutes: number; // estimated
  status: 'active' | 'completed';
}

export interface WebsiteVisitor {
  id: string;
  visitorId: string;
  firstVisit: string;
  lastVisit: string;
  sessions: number;
  pagesVisited: number;
  timeSpentSeconds: number;
  trafficSource: string;
  leadConvertedStatus: 'converted' | 'lead_captured' | 'anonymous';
  ipLocation: string;
  device: string;
}

export interface ActivityLog {
  id: string;
  activity: string;
  user: string;
  role: UserRole;
  entity: string;
  entityId: string;
  timestamp: string;
  description: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: 'advertising' | 'messaging' | 'telephony' | 'tracking' | 'notifications';
  icon: string;
  description: string;
  status: 'connected' | 'not_connected' | 'pending';
  lastSync?: string;
  features: string[];
}
