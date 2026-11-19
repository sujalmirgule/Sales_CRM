import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Users, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface PermissionDeniedStateProps {
  requiredPermission: string;
  moduleName?: string;
}

export const PermissionDeniedState: React.FC<PermissionDeniedStateProps> = ({
  requiredPermission,
  moduleName,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-600">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 inline-block mb-2">
          Duty Permission Required
        </span>

        <h3 className="text-base font-bold text-slate-900">
          Access Restricted {moduleName ? `to ${moduleName}` : ''}
        </h3>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Your account (<strong>{currentUser.name}</strong>,{' '}
          <span className="text-slate-500 font-medium">{currentUser.designation || 'Staff'}</span>) does not have the{' '}
          <code className="px-1.5 py-0.5 bg-slate-100 text-brand-600 rounded font-mono text-[11px] font-semibold">
            {requiredPermission}
          </code>{' '}
          permission enabled.
        </p>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-left text-[11px] text-slate-500 flex items-start gap-2">
          <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Duty assignments are managed by the Master Administrator under <strong>Team Management → Assign Duties & Permissions</strong>.
          </span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button variant="brand" size="sm" onClick={() => navigate('/')} className="w-full sm:w-auto">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to My Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/leads')} className="w-full sm:w-auto">
            <Users className="w-3.5 h-3.5 mr-1" /> View My Assigned Leads
          </Button>
        </div>
      </div>
    </div>
  );
};
