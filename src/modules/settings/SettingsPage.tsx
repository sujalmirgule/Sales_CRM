import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  Settings,
  Building2,
  PhoneCall,
  ShieldAlert,
  RotateCcw,
  Download,
  CheckCircle,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetAllData, leads, calls, sales, staffMembers } = useCRM();
  const { currentUser, isMaster } = useAuth();

  const [companyName, setCompanyName] = useState('Apex Real Estate & Developments');
  const [supportEmail, setSupportEmail] = useState('sales@apexrealty.in');
  const [supportPhone, setSupportPhone] = useState('+91 22 6123 4567');
  const [defaultCurrency, setDefaultCurrency] = useState('INR (₹)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBackupJson = () => {
    const backupData = {
      leads,
      calls,
      sales,
      staffMembers,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm_demo_state_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">CRM Workspace Settings</h2>
        <p className="text-xs text-slate-500">
          Configure business metadata, telecommunication dialer defaults, and demo local storage
        </p>
      </div>

      {/* Company Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company & Organization Profile</CardTitle>
          <p className="text-xs text-slate-500">Company branding and currency localization</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Organization / Builder Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Input
                label="Sales Enquiry Email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
              <Input
                label="Headquarters Phone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
              <Input
                label="Base Currency"
                value={defaultCurrency}
                disabled
                helperText="Fixed to Indian Rupee (INR ₹) for demo"
              />
            </div>

            {savedSuccess && (
              <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 p-2 rounded">
                ✓ Company settings saved.
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="brand" size="sm">
                Save Company Info
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pipeline Stage Definitions */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Pipeline Stages</CardTitle>
          <p className="text-xs text-slate-500">Fixed sequence for lead life cycle</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded bg-orange-50 border border-orange-200">
              <span className="font-bold text-orange-900 block">1. New Lead</span>
              <p className="text-[11px] text-orange-700 mt-0.5">Fresh Meta ad submission</p>
            </div>
            <div className="p-2.5 rounded bg-blue-50 border border-blue-200">
              <span className="font-bold text-blue-900 block">2. Assigned</span>
              <p className="text-[11px] text-blue-700 mt-0.5">Allocated to sales rep</p>
            </div>
            <div className="p-2.5 rounded bg-slate-100 border border-slate-200">
              <span className="font-bold text-slate-800 block">3. Contacted</span>
              <p className="text-[11px] text-slate-600 mt-0.5">Dialed & spoken with rep</p>
            </div>
            <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900 block">4. Interested</span>
              <p className="text-[11px] text-amber-700 mt-0.5">Qualified buyer budget</p>
            </div>
            <div className="p-2.5 rounded bg-indigo-50 border border-indigo-200">
              <span className="font-bold text-indigo-900 block">5. Follow-up</span>
              <p className="text-[11px] text-indigo-700 mt-0.5">Site visit or meet due</p>
            </div>
            <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 block">6. Converted</span>
              <p className="text-[11px] text-emerald-700 mt-0.5">Token paid & signed</p>
            </div>
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-900 block">7. Lost</span>
              <p className="text-[11px] text-rose-700 mt-0.5">Budget or location exit</p>
            </div>
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-900 block">8. Not Connected</span>
              <p className="text-[11px] text-rose-700 mt-0.5">Repeated no-answers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Database Controls */}
      <Card className="border-rose-200 bg-rose-50/20">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" /> Demo Persistence & State Management
          </CardTitle>
          <p className="text-xs text-rose-700">
            This prototype stores all state reactively in browser LocalStorage. You can backup or reset anytime.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBackupJson}>
              <Download className="w-3.5 h-3.5 mr-1" /> Backup State to JSON
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('Reset all demo leads, call records, and follow-ups to factory seed data?')) {
                  resetAllData();
                }
              }}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Entire Database to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
