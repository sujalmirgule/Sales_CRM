import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building2, ArrowRight, ShieldAlert, Lock, Mail, UserX, CheckCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchUser, allUsers } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Demo@123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter an email address.');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickLogin = (user: (typeof allUsers)[0]) => {
    if (user.status === 'inactive') {
      setErrorMsg(
        `Account Deactivated: ${user.name}'s account is currently inactive. Please log in as Master to reactivate this account.`
      );
      return;
    }

    const result = switchUser(user.id);
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error || 'Failed to switch user.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EA580C] text-white shadow-lg mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sales CRM System</h2>
          <p className="text-xs text-slate-500 mt-1">
            Meta Ads Lead Pipeline & Telephony Calling Solution
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl shadow-card border border-slate-200 p-6">
          <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Client Demo Sign In
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
              Interactive Prototype
            </span>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. master@demo.com or staff member email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Demo@123"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              required
            />

            {errorMsg && (
              <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded border border-rose-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button type="submit" variant="brand" className="w-full">
              Sign In to Workspace <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-600">
                Or Click Any Registered Profile to Log In:
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {allUsers.length} accounts
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {allUsers.map((user) => {
                const isDeactivated = user.status === 'inactive';
                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    type="button"
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all group ${
                      isDeactivated
                        ? 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100 cursor-not-allowed'
                        : 'border-slate-200 hover:border-brand-500 hover:bg-orange-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-brand-700 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      {isDeactivated ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                          <UserX className="w-2.5 h-2.5" /> Deactivated
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            user.role === 'master'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {user.role === 'master' ? 'Master Admin' : 'Sales Staff'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Demo Security Notice */}
        <p className="text-[11px] text-center text-slate-400 mt-5">
          Dynamic staff management enabled • Create unlimited staff accounts in Master view.
        </p>
      </div>
    </div>
  );
};
