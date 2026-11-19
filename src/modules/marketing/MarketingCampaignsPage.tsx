import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Campaign } from '../../types/crm';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { CampaignBarChart } from '../../components/charts/CampaignBarChart';
import { formatCurrency } from '../../utils/formatters';
import {
  Megaphone,
  Share2,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

export const MarketingCampaignsPage: React.FC = () => {
  const { campaigns } = useCRM();
  const [activeTab, setActiveTab] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'facebook') return c.platform === 'facebook' || c.platform === 'meta_bundle';
    if (activeTab === 'instagram') return c.platform === 'instagram' || c.platform === 'meta_bundle';
    return true;
  });

  // Aggregated Marketing KPIs
  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalSpend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.totalLeads, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const totalCampaignRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const avgCPL = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
  const overallROI = totalSpend > 0 ? Math.round(((totalCampaignRevenue - totalSpend) / totalSpend) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Marketing & Meta Ads Funnel</h2>
          <p className="text-xs text-slate-500">
            Performance attribution across Facebook Lead Forms, Instagram Reels, and Search Ad Sets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="brand" size="sm" onClick={() => setIsConnectOpen(true)}>
            <Share2 className="w-3.5 h-3.5 mr-1" /> Connect Meta Ads Account
          </Button>
        </div>
      </div>

      {/* Meta API Integration Notice Card */}
      <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl shadow-sm border border-indigo-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/40 border border-blue-400/40 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Integration Status
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Demo Mode — Meta Ads API not connected
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Currently visualizing simulated Meta Marketing API metrics and instant webhook lead dispatches.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 whitespace-nowrap"
          onClick={() => setIsConnectOpen(true)}
        >
          API Setup Guide <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>

      {/* 4 Marketing KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Total Ad Spend"
          value={formatCurrency(totalSpend)}
          subtext="Meta + Google Ads"
          icon={DollarSign}
          iconColor="text-rose-600 bg-rose-50"
        />
        <StatCard
          title="Inbound Paid Leads"
          value={totalLeads}
          change="+24% WoW"
          trend="up"
          subtext="Form completions"
          icon={Megaphone}
          iconColor="text-brand-600 bg-brand-50"
        />
        <StatCard
          title="Average Cost Per Lead"
          value={formatCurrency(avgCPL)}
          change="-8% cheaper"
          trend="down"
          subtext="Blended CPL"
          icon={TrendingUp}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Marketing ROI"
          value={`${overallROI}%`}
          change="₹2.9 Cr rev"
          trend="up"
          subtext="Return on Ad Spend"
          icon={Percent}
          iconColor="text-purple-600 bg-purple-50"
        />
      </div>

      {/* Chart */}
      <Card className="p-5">
        <CampaignBarChart />
      </Card>

      {/* Campaigns Table with Platform Tabs */}
      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Active Ad Sets & Marketing Campaigns</CardTitle>
            <p className="text-xs text-slate-500">Live cost breakdown, lead yield, and conversion velocity</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs">
            {[
              { key: 'all', label: 'All Campaigns' },
              { key: 'facebook', label: 'Facebook Ads' },
              { key: 'instagram', label: 'Instagram Ads' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  activeTab === t.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Campaign Name & ID</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Target Ad Set</th>
                <th className="p-3">Total Spend</th>
                <th className="p-3 text-center">Leads Yield</th>
                <th className="p-3">Cost Per Lead (CPL)</th>
                <th className="p-3 text-center">Conversions</th>
                <th className="p-3">Closed Revenue</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{camp.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{camp.campaignId}</span>
                  </td>
                  <td className="p-3 capitalize font-medium text-slate-700">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        camp.platform.includes('facebook')
                          ? 'bg-blue-100 text-blue-800'
                          : camp.platform.includes('instagram')
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {camp.platform}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-[180px] truncate">{camp.adSet}</td>
                  <td className="p-3 font-mono font-semibold text-slate-800">
                    {formatCurrency(camp.totalSpend)}
                  </td>
                  <td className="p-3 text-center font-bold text-brand-600 font-mono">
                    {camp.totalLeads}
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">
                    {formatCurrency(camp.costPerLead)}
                  </td>
                  <td className="p-3 text-center font-bold text-emerald-600 font-mono">
                    {camp.conversions}
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-700">
                    {formatCurrency(camp.revenue)}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Realistic Meta Connect Modal */}
      <Modal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        maxWidth="md"
        title="Meta Ads Integration Setup (Production Blueprint)"
      >
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
            <strong>Architecture for Production Integration:</strong> In production, you will connect your Meta Business Manager app via Facebook Graph API v20.0 using System User Access Tokens and Webhook subscriptions for <code>leadgen</code> real-time events.
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block">Step 1: Meta App Verification</span>
              <p className="text-slate-500 mt-0.5">
                Register app on developers.facebook.com with <code>leads_retrieval</code> and <code>pages_manage_ads</code> permissions.
              </p>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block">Step 2: Real-time Webhook URL</span>
              <p className="text-slate-500 mt-0.5 font-mono">
                Endpoint: https://api.yourcrm.com/api/v1/webhooks/meta-leadgen
              </p>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-800 block">Step 3: Instant Lead Ingestion</span>
              <p className="text-slate-500 mt-0.5">
                New leads appear in this CRM within &lt;2 seconds of form completion on Instagram/Facebook.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsConnectOpen(false)}>
              Close
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={() => {
                alert('In production, this triggers the official Meta OAuth dialog. Currently running in demo mode.');
                setIsConnectOpen(false);
              }}
            >
              Simulate OAuth Handshake
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
