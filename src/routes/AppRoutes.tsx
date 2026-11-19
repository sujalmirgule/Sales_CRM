import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../modules/auth/LoginPage';
import { DashboardRouter } from '../modules/dashboard/DashboardRouter';
import { LeadListPage } from '../modules/leads/LeadListPage';
import { LeadDetailPage } from '../modules/leads/LeadDetailPage';
import { LeadAssignmentPage } from '../modules/leads/LeadAssignmentPage';
import { CallManagementPage } from '../modules/calling/CallManagementPage';
import { FollowUpManagementPage } from '../modules/followups/FollowUpManagementPage';
import { TeamManagementPage } from '../modules/team/TeamManagementPage';
import { AttendanceSessionsPage } from '../modules/attendance/AttendanceSessionsPage';
import { SalesRevenuePage } from '../modules/sales/SalesRevenuePage';
import { MarketingCampaignsPage } from '../modules/marketing/MarketingCampaignsPage';
import { WebsiteAnalyticsPage } from '../modules/website-analytics/WebsiteAnalyticsPage';
import { ReportsPage } from '../modules/reports/ReportsPage';
import { IntegrationsPage } from '../modules/integrations/IntegrationsPage';
import { ActivityLogsPage } from '../modules/activity-logs/ActivityLogsPage';
import { SettingsPage } from '../modules/settings/SettingsPage';
import { Permission } from '../types/crm';
import { PermissionDeniedState } from '../components/common/PermissionDeniedState';

// Route guard for Master-only pages
const MasterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMaster, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isMaster) return <PermissionDeniedState requiredPermission="master.admin" moduleName="Master Administration" />;
  return <>{children}</>;
};

// Route guard for Authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Granular Duty-Based Permission Route Guard
interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: Permission;
  anyOf?: Permission[];
  moduleName?: string;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({ children, permission, anyOf, moduleName }) => {
  const { isAuthenticated, isMaster, hasPermission, hasAnyPermission } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isMaster) return <>{children}</>;

  if (permission && !hasPermission(permission)) {
    return <PermissionDeniedState requiredPermission={permission} moduleName={moduleName} />;
  }

  if (anyOf && !hasAnyPermission(anyOf)) {
    return <PermissionDeniedState requiredPermission={anyOf.join(' | ')} moduleName={moduleName} />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRouter />} />
        
        <Route
          path="leads"
          element={
            <PermissionRoute anyOf={['leads.view', 'leads.view_all']} moduleName="Leads Pipeline">
              <LeadListPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="leads/:id"
          element={
            <PermissionRoute anyOf={['leads.view', 'leads.view_all']} moduleName="Lead Details">
              <LeadDetailPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="lead-assignment"
          element={
            <PermissionRoute permission="leads.assign" moduleName="Lead Assignment Center">
              <LeadAssignmentPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="calling"
          element={
            <PermissionRoute anyOf={['calls.view', 'calls.view_history', 'calls.view_all_history']} moduleName="Calling Center">
              <CallManagementPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="followups"
          element={
            <PermissionRoute anyOf={['followups.view', 'followups.view_all']} moduleName="Follow-ups Scheduler">
              <FollowUpManagementPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="team"
          element={
            <PermissionRoute anyOf={['team.view', 'team.manage']} moduleName="Team Management">
              <TeamManagementPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="attendance"
          element={
            <PermissionRoute anyOf={['attendance.view_own', 'attendance.view_all']} moduleName="Attendance & Sessions">
              <AttendanceSessionsPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="sales"
          element={
            <PermissionRoute permission="sales.view" moduleName="Sales & Revenue">
              <SalesRevenuePage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="marketing"
          element={
            <PermissionRoute anyOf={['marketing.view', 'campaigns.view']} moduleName="Marketing & Campaigns">
              <MarketingCampaignsPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="website-analytics"
          element={
            <PermissionRoute permission="website_analytics.view" moduleName="Website Analytics">
              <WebsiteAnalyticsPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="reports"
          element={
            <PermissionRoute permission="reports.view" moduleName="Reports & BI">
              <ReportsPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="integrations"
          element={
            <MasterRoute>
              <IntegrationsPage />
            </MasterRoute>
          }
        />
        
        <Route
          path="activity-logs"
          element={
            <PermissionRoute permission="activity_logs.view" moduleName="System Activity Logs">
              <ActivityLogsPage />
            </PermissionRoute>
          }
        />
        
        <Route
          path="settings"
          element={
            <MasterRoute>
              <SettingsPage />
            </MasterRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
