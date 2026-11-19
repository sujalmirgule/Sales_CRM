import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMContext';
import {
  Search,
  Bell,
  Plus,
  User,
  Shield,
  PhoneCall,
  Calendar,
  X,
  ExternalLink,
  ChevronDown,
  Users,
  Menu,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenAddLead: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddLead, onToggleMobileSidebar }) => {
  const { currentUser, role, isMaster, switchUser, allUsers, logout, hasPermission } = useAuth();
  const { leads, followUps } = useCRM();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  // Generate title and breadcrumb from route
  const getRouteInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: isMaster ? 'Master Overview & Analytics' : 'Sales Executive Workspace', breadcrumb: 'Dashboard' };
      case '/leads':
        return { title: isMaster ? 'All Sales Leads Pipeline' : 'My Assigned Leads', breadcrumb: 'Leads' };
      case '/lead-assignment':
        return { title: 'Lead Assignment & Distribution', breadcrumb: 'Lead Assignment' };
      case '/calling':
        return { title: 'Calling Management & Telephony Log', breadcrumb: 'Calling' };
      case '/followups':
        return { title: 'Follow-up Scheduler & Pipeline Reminders', breadcrumb: 'Follow-ups' };
      case '/team':
        return { title: 'Team Roster & Staff Performance', breadcrumb: 'Team Management' };
      case '/attendance':
        return { title: 'Attendance & Login Sessions Monitor', breadcrumb: 'Attendance' };
      case '/sales':
        return { title: 'Sales & Revenue Realization', breadcrumb: 'Sales' };
      case '/marketing':
        return { title: 'Meta Ads & Campaign Performance', breadcrumb: 'Marketing' };
      case '/website-analytics':
        return { title: 'Website Traffic & Visitor Attribution', breadcrumb: 'Website Analytics' };
      case '/reports':
        return { title: 'Executive CRM Reports & CSV Exports', breadcrumb: 'Reports' };
      case '/integrations':
        return { title: 'API Integrations & Telephony Gateways', breadcrumb: 'Integrations' };
      case '/activity-logs':
        return { title: 'System Audit Trail & Activity Logs', breadcrumb: 'Activity Logs' };
      case '/settings':
        return { title: 'CRM Workspace Settings', breadcrumb: 'Settings' };
      default:
        if (pathname.startsWith('/leads/')) {
          return { title: 'Lead Dossier & Calling Activity', breadcrumb: 'Leads / Details' };
        }
        return { title: 'Sales CRM', breadcrumb: 'Home' };
    }
  };

  const routeInfo = getRouteInfo(location.pathname);

  // Quick search results
  const filteredSearchLeads = searchQuery.trim().length > 1
    ? leads.filter(
        (l) =>
          l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.phone.includes(searchQuery) ||
          l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.campaign.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const pendingReminders = followUps.filter((f) => f.status === 'pending');

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6">
      {/* Mobile Hamburger + Title & Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>CRM</span>
            <span>/</span>
            <span className="text-slate-600 font-medium truncate">{routeInfo.breadcrumb}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate max-w-[150px] sm:max-w-none">
            {routeInfo.title}
          </h1>
        </div>
      </div>

      {/* Center Global Search */}
      <div className="relative max-w-md w-full mx-4 hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search leads by name, phone (+91), lead ID or campaign..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full h-9 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchDropdown && searchQuery.trim().length > 1 && (
          <div className="absolute top-11 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-dropdown p-2 z-50">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
              <span>Matching Leads ({filteredSearchLeads.length})</span>
              <button
                onClick={() => setShowSearchDropdown(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            {filteredSearchLeads.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">No leads matching "{searchQuery}"</p>
            ) : (
              <div className="space-y-1">
                {filteredSearchLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      navigate(`/leads/${lead.id}`);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{lead.customerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {lead.phone} • {lead.interestedProduct}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                        {lead.status}
                      </span>
                      <span className="text-[10px] text-brand-600 font-medium block mt-0.5">
                        {lead.id}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher */}
        {allUsers.length <= 3 ? (
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  u.id === currentUser.id
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {u.name.split(' ')[0]} ({u.role === 'master' ? 'Master' : 'Staff'})
              </button>
            ))}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Quick Master toggle */}
            {allUsers.find((u) => u.role === 'master') && (
              <button
                onClick={() => switchUser(allUsers.find((u) => u.role === 'master')!.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  currentUser.role === 'master'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                Master
              </button>
            )}

            {/* Current Staff badge if non-master */}
            {currentUser.role !== 'master' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 shadow-xs">
                {currentUser.name.split(' ')[0]} (Staff)
              </span>
            )}

            {/* Dropdown for unlimited staff */}
            <div className="relative">
              <button
                onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 transition-colors shadow-xs"
                title="Switch Staff Account"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch ({allUsers.length})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserSwitcher && (
                <div className="absolute right-0 top-9 w-64 bg-white border border-slate-200 rounded-lg shadow-dropdown p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-1.5 px-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Select User Profile</span>
                    <span className="font-mono">{allUsers.length} total</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                    {allUsers.map((u) => {
                      const isInactive = u.status === 'inactive';
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            if (!isInactive) setShowUserSwitcher(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-xs transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-brand-50 text-brand-900 font-semibold'
                              : isInactive
                              ? 'opacity-60 text-slate-400 hover:bg-slate-50'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{u.name}</span>
                              {isInactive && (
                                <span className="text-[9px] px-1 rounded bg-rose-50 text-rose-600 border border-rose-200">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">{u.email}</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold text-slate-500 bg-slate-100 shrink-0">
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Lead Quick Button */}
        {(isMaster || hasPermission('leads.create')) && (
          <Button variant="brand" size="sm" onClick={onOpenAddLead} className="px-2 sm:px-3 text-xs shrink-0">
            <Plus className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Add Lead</span>
          </Button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingReminders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-lg shadow-dropdown p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications & Alerts
                </span>
                <span className="text-[11px] font-semibold text-brand-600">
                  {pendingReminders.length} pending
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {pendingReminders.slice(0, 4).map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(`/leads/${rem.leadId}`);
                    }}
                    className="p-2 bg-slate-50 hover:bg-slate-100/80 rounded border border-slate-200/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                      <span>Follow-up: {rem.customerName}</span>
                      <span className="text-[10px] text-amber-600 font-mono">{rem.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{rem.remarks}</p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">
                      Staff: {rem.assignedStaffName}
                    </span>
                  </div>
                ))}

                <div className="p-2 bg-emerald-50 rounded border border-emerald-200/80 text-[11px] text-emerald-800">
                  <strong>Meta Ads Webhook Sync:</strong> Real-time ad form integration is operational in demo simulation.
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/followups');
                  }}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  View All Reminders →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Role Tag */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-slate-900 block leading-none">
              {currentUser.name}
            </span>
            <span className="text-[10px] font-semibold uppercase text-slate-400 mt-0.5 block">
              {role === 'master' ? 'Admin Master' : 'Sales Rep'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
