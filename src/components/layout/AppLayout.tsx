import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { QuickLeadModal } from '../common/QuickLeadModal';
import { CallSimulationModal } from '../common/CallSimulationModal';
import { useCRM } from '../../context/CRMContext';
import { Sparkles, AlertCircle } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { activeCallLead, closeCallModal } = useCRM();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-x-hidden">
      {/* Persistent / Responsive Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col pl-0 md:pl-64 transition-all duration-200 w-full min-w-0">
        {/* Top Header */}
        <Header
          onOpenAddLead={() => setIsAddLeadOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Client Demo Notice Bar */}
        <div className="bg-slate-900 text-slate-300 px-3 sm:px-6 py-2 flex items-center justify-between text-xs border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-semibold text-white">Client Interactive Demo:</span>
            <span className="text-slate-400 hidden lg:inline">
              Simulating Meta Lead Ads, WhatsApp Cloud webhooks, and calling activity with local persistence.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono shrink-0">
            <span>Status: Demo Mode Active</span>
          </div>
        </div>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <QuickLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
      <CallSimulationModal isOpen={!!activeCallLead} onClose={closeCallModal} lead={activeCallLead} />
    </div>
  );
};
