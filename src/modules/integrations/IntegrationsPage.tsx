import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { IntegrationStatus } from '../../types/crm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Plug,
  Share2,
  MessageSquare,
  PhoneCall,
  Activity,
  Mail,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code2,
  ShieldAlert,
  Server,
  Key,
  Webhook,
} from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const { integrations, updateIntegration } = useCRM();
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationStatus | null>(null);
  const [isDocOpen, setIsDocOpen] = useState(false);

  const getIcon = (category: string) => {
    switch (category) {
      case 'advertising':
        return <Share2 className="w-6 h-6 text-blue-600" />;
      case 'messaging':
        return <MessageSquare className="w-6 h-6 text-emerald-600" />;
      case 'telephony':
        return <PhoneCall className="w-6 h-6 text-indigo-600" />;
      case 'tracking':
        return <Activity className="w-6 h-6 text-purple-600" />;
      default:
        return <Mail className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">API Integrations & Telephony Gateways</h2>
          <p className="text-xs text-slate-500">
            Pre-architected connectors for Meta Ads Graph API, WhatsApp Cloud API, and Cloud Telephony PBX
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDocOpen(true)}
          className="w-full sm:w-auto"
        >
          <Code2 className="w-3.5 h-3.5 mr-1" /> Backend Integration Architecture Guide
        </Button>
      </div>

      {/* Integration Notice */}
      <div className="p-3.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Sandbox Mode:</strong> All services are strictly in <em>Not Connected / Demo Simulation</em> state. No real external APIs or phone lines are charged. Modals below contain the production-ready Node.js controller payloads.
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 shrink-0">
          Target: Node.js / Express
        </span>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col justify-between hover:shadow-card transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  {getIcon(item.category)}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Not Connected
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.description}</p>

              {/* Feature Tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Supported Features
                </span>
                {item.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setSelectedIntegration(item)}
              >
                Configure
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-brand-600"
                onClick={() => setSelectedIntegration(item)}
              >
                Docs <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Configure Modal */}
      <Modal
        isOpen={!!selectedIntegration}
        onClose={() => setSelectedIntegration(null)}
        maxWidth="lg"
        title={selectedIntegration ? `Configure ${selectedIntegration.name}` : ''}
      >
        {selectedIntegration && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Connection Status: Not Connected (Demo Sandbox)</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                This client prototype simulates data locally. To activate real two-way communication in production, deploy the Express.js backend and configure the verified credentials below in your <code>.env</code> file.
              </p>
            </div>

            {/* Integration-specific details */}
            {selectedIntegration.id === 'int-whatsapp' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Cloud API Requirements
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>Verified Meta Business Manager Account (WABA).</li>
                    <li>Phone Number ID registered under WhatsApp Accounts in Meta Developer Portal.</li>
                    <li>Permanent System User Access Token with <code>whatsapp_business_messaging</code> scope.</li>
                    <li>Webhook verify token matching <code>hub.verify_token</code> challenge.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedIntegration.id === 'int-meta' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" /> Meta Ads LeadGen Webhook Architecture
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>Webhook subscription on <code>page</code> object with <code>leadgen</code> topic.</li>
                    <li>Page Access Token with <code>leads_retrieval</code> and <code>pages_manage_ads</code>.</li>
                    <li>Immediate lead retrieval upon receiving webhook payload via <code>GET /&#123;leadgen_id&#125;</code>.</li>
                    <li>Payload signature verified using HMAC-SHA256 with <code>APP_SECRET</code>.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedIntegration.id === 'int-telephony' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-indigo-600" /> Cloud Telephony Virtual PBX Specs
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>Supported providers: Exotel, Knowlarity, Twilio, MCube, or Tata Smartflo.</li>
                    <li>Click-to-call initiates agent leg first, bridges customer leg upon pickup.</li>
                    <li>In-demo calls use realistic WebRTC audio emulation with disposition logging.</li>
                    <li>Call events (ringing, answered, hung up) stream to CRM via WebSockets.</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" /> Production Environment Variables (.env)
              </label>
              <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
{selectedIntegration.id === 'int-meta'
  ? `META_APP_ID=449201938102
META_APP_SECRET=f3b14e9102...
META_PAGE_ACCESS_TOKEN=EAAGw091...
META_WEBHOOK_VERIFY_TOKEN=crm_secure_token_99
WEBHOOK_ENDPOINT=/api/v1/webhooks/meta-leadgen`
  : selectedIntegration.id === 'int-whatsapp'
  ? `WHATSAPP_PHONE_NUMBER_ID=1092837461
WHATSAPP_BUSINESS_ACCOUNT_ID=881920391
WHATSAPP_ACCESS_TOKEN=EAAGw...
WEBHOOK_VERIFY_TOKEN=crm_whatsapp_verify_99
WEBHOOK_ENDPOINT=/api/v1/webhooks/whatsapp`
  : selectedIntegration.id === 'int-telephony'
  ? `TELEPHONY_PROVIDER=exotel # or knowlarity / twilio / tata
TELEPHONY_API_KEY=api_key_4481
TELEPHONY_API_TOKEN=token_9921
VIRTUAL_CALLER_ID=+918047192831
WEBHOOK_CALL_EVENT_URL=/api/v1/telephony/events`
  : `TRACKING_SDK_SITE_ID=CRM-PROD-99
TRACKING_DOMAIN=https://yourclientwebsite.com
PIXEL_COOKIE_CONSENT=true`}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(null)}>
                Close
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={() => {
                  alert('Integration template configuration saved in demo memory. Service remains in Demo Sandbox state.');
                  setSelectedIntegration(null);
                }}
              >
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Backend Architecture Modal */}
      <Modal
        isOpen={isDocOpen}
        onClose={() => setIsDocOpen(false)}
        maxWidth="lg"
        title="CRM Backend Architecture & Integration Specs"
      >
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            The Sales CRM frontend is built with strict TypeScript interfaces that map 1:1 to standard PostgreSQL relational tables and Node.js Prisma schemas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-brand-600" /> Database & Caching
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>PostgreSQL 16 relational store</li>
                <li>Prisma ORM with typed migrations</li>
                <li>Redis for token session caching & rate limits</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5 text-brand-600" /> API & Webhooks
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Express.js REST controllers</li>
                <li>Socket.IO for live call screen pops</li>
                <li>HMAC SHA256 webhook signature validation</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button variant="brand" size="sm" onClick={() => setIsDocOpen(false)}>
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
