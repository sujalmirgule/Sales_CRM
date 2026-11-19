import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Permission } from '../../types/crm';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  PhoneCall,
  CalendarClock,
  ShieldCheck,
  Clock,
  BadgeDollarSign,
  Megaphone,
  Globe,
  FileBarChart2,
  Plug,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  User,
  RefreshCw,
  X,
  Shield,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentUser, isMaster, role, switchUser, allUsers, logout, hasPermission, hasAnyPermission } = useAuth();
  const { masterKPIs, staffKPIs, resetAllData } = useCRM();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const location = useLocation();

  interface NavItemDef {
    name: string;
    path: string;
    icon: any;
    badge?: string;
    requiredPermission?: Permission;
    anyPermission?: Permission[];
    masterOnly?: boolean;
  }

  const allNavItems: NavItemDef[] = [
    {
      name: isMaster ? 'Master Dashboard' : 'My Dashboard',
      path: '/',
      icon: LayoutDashboard,
      requiredPermission: 'dashboard.view',
    },
    {
      name: isMaster || hasPermission('leads.view_all') ? 'All Leads Pipeline' : 'My Assigned Leads',
      path: '/leads',
      icon: Users,
      badge: isMaster
        ? masterKPIs.newLeads > 0 ? `${masterKPIs.newLeads} new` : undefined
        : `${staffKPIs.myTotalLeads}`,
      anyPermission: ['leads.view', 'leads.view_all'],
    },
    {
      name: 'Lead Assignment',
      path: '/lead-assignment',
      icon: UserCheck,
      requiredPermission: 'leads.assign',
    },
    {
      name: isMaster ? 'Calling Management' : 'Calling Center',
      path: '/calling',
      icon: PhoneCall,
      anyPermission: ['calls.view', 'calls.view_history', 'calls.view_all_history'],
    },
    {
      name: isMaster ? 'Follow-ups Management' : 'My Follow-ups',
      path: '/followups',
      icon: CalendarClock,
      badge:
        (isMaster ? masterKPIs.pendingFollowUps : staffKPIs.pendingFollowUps) > 0
          ? `${isMaster ? masterKPIs.pendingFollowUps : staffKPIs.pendingFollowUps}`
          : undefined,
      anyPermission: ['followups.view', 'followups.view_all'],
    },
    {
      name: 'Team Management',
      path: '/team',
      icon: ShieldCheck,
      anyPermission: ['team.view', 'team.manage'],
    },
    {
      name: isMaster ? 'Attendance & Sessions' : 'My Attendance',
      path: '/attendance',
      icon: Clock,
      anyPermission: ['attendance.view_own', 'attendance.view_all'],
    },
    {
      name: 'Sales & Revenue',
      path: '/sales',
      icon: BadgeDollarSign,
      requiredPermission: 'sales.view',
    },
    {
      name: 'Marketing & Campaigns',
      path: '/marketing',
      icon: Megaphone,
      anyPermission: ['marketing.view', 'campaigns.view'],
    },
    {
      name: 'Website Analytics',
      path: '/website-analytics',
      icon: Globe,
      requiredPermission: 'website_analytics.view',
    },
    {
      name: 'Reports & BI',
      path: '/reports',
      icon: FileBarChart2,
      requiredPermission: 'reports.view',
    },
    {
      name: 'Integrations',
      path: '/integrations',
      icon: Plug,
      masterOnly: true,
    },
    {
      name: 'Activity Logs',
      path: '/activity-logs',
      icon: History,
      requiredPermission: 'activity_logs.view',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      masterOnly: true,
    },
  ];

  const navigation = allNavItems.filter((item) => {
    if (isMaster) return true;
    if (item.masterOnly) return false;
    if (item.requiredPermission) return hasPermission(item.requiredPermission);
    if (item.anyPermission) return hasAnyPermission(item.anyPermission);
    return true;
  });

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#171717] text-[#A3A3A3] flex flex-col transition-all duration-200 border-r border-neutral-800 select-none
          ${mobileOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-16' : 'md:w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/80 shrink-0">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#EA580C] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-white leading-none">
                  SALES <span className="text-[#EA580C]">CRM</span>
                </span>
                <span className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
                  Meta Ads Pipeline
                </span>
              </div>
            </div>
          )}

          {collapsed && !mobileOpen && (
            <div className="mx-auto w-8 h-8 rounded-lg bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm">
              SC
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors hidden md:block"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role & Designation Banner */}
        <div className="px-3 py-2 border-b border-neutral-800/60 bg-neutral-900/60">
          {!collapsed || mobileOpen ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  {isMaster ? 'Master Control' : 'Assigned Duty Role'}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isMaster
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isMaster ? 'Master User' : 'Active Staff'}
                </span>
              </div>
              {!isMaster && currentUser.designation && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-300 font-medium truncate">
                  <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate">{currentUser.designation}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <span className="w-2 h-2 rounded-full inline-block bg-[#EA580C]" />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 custom-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onCloseMobile?.()}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#2F2F2F] text-white shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/70'
                }`}
                title={collapsed && !mobileOpen ? item.name : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#EA580C]' : 'text-neutral-400 group-hover:text-white'
                  }`}
                />

                {(!collapsed || mobileOpen) && (
                  <>
                    <span className="truncate flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-900/60 text-brand-300 font-bold border border-brand-800 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Demo Controls & Role Quick Switcher */}
        <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 relative">
          {/* Role Selector Popup */}
          {showRoleMenu && (
            <div className="absolute bottom-16 left-2 right-2 bg-neutral-900 border border-neutral-700 rounded-lg p-2 shadow-2xl z-50 text-xs">
              <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Switch Demo User Account
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {allUsers.length} Users
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                {allUsers.map((u) => {
                  const isInactive = u.status === 'inactive';
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        if (!isInactive) {
                          setShowRoleMenu(false);
                          onCloseMobile?.();
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
                        u.id === currentUser.id
                          ? 'bg-neutral-800 text-white font-bold'
                          : isInactive
                          ? 'opacity-60 hover:bg-neutral-800/50 text-neutral-400'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="block font-medium truncate">{u.name}</span>
                          {isInactive && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800 font-semibold">
                              Inactive
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 truncate block">
                          {u.designation || (u.role === 'master' ? 'Master Admin' : 'Sales Rep')}
                        </span>
                      </div>
                      <span className="text-[9px] px-1 rounded uppercase tracking-wider font-bold ml-1 bg-neutral-700 text-neutral-200 shrink-0">
                        {u.role}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-1.5 mt-1 border-t border-neutral-800">
                <button
                  onClick={() => {
                    if (confirm('Reset entire CRM demo state to seed data?')) {
                      resetAllData();
                    }
                  }}
                  className="w-full flex items-center gap-1.5 px-2 py-1 text-[11px] text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Demo Database
                </button>
              </div>
            </div>
          )}

          {!collapsed || mobileOpen ? (
            <div className="space-y-2">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 truncate">
                  <span className="text-xs font-semibold text-white block truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-neutral-400 block truncate">{currentUser.email}</span>
                </div>
                <span className="text-[10px] font-bold text-amber-500 border border-amber-500/40 px-1 rounded uppercase">
                  {role}
                </span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1 px-1 text-neutral-400">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <User className="w-3 h-3" /> Switch User
                </button>
                <button
                  onClick={logout}
                  className="hover:text-rose-400 flex items-center gap-1 text-[11px] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700"
                title={currentUser.name}
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </button>
              <button onClick={logout} className="text-neutral-400 hover:text-rose-400 p-1" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
