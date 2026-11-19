import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Lead, CallStatus } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { Phone, PhoneCall, PhoneOff, PhoneIncoming, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

interface CallSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const CallSimulationModal: React.FC<CallSimulationModalProps> = ({ isOpen, onClose, lead }) => {
  const { recordCall } = useCRM();
  const { currentUser } = useAuth();

  const [callState, setCallState] = useState<'initiating' | 'ringing' | 'connected' | 'ended'>('initiating');
  const [seconds, setSeconds] = useState<number>(0);
  const [callOutcome, setCallOutcome] = useState<CallStatus>('completed');
  const [remarks, setRemarks] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let timer: any = null;
    if (isOpen && callState === 'connected') {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, callState]);

  // Ringing simulation
  useEffect(() => {
    if (isOpen && lead) {
      setCallState('initiating');
      setSeconds(0);
      setRemarks('');
      setCallOutcome('completed');

      const ringTimer = setTimeout(() => {
        setCallState('ringing');
      }, 1000);

      const connectTimer = setTimeout(() => {
        setCallState('connected');
      }, 3500);

      return () => {
        clearTimeout(ringTimer);
        clearTimeout(connectTimer);
      };
    }
  }, [isOpen, lead]);

  if (!lead) return null;

  const handleSimulateOutcome = (outcome: CallStatus) => {
    setCallOutcome(outcome);
    setCallState('ended');
  };

  const handleSaveCall = () => {
    if (!lead) return;
    setIsSaving(true);

    const isConnected = ['completed', 'answered'].includes(callOutcome);
    const finalDuration = isConnected ? Math.max(15, seconds || 45) : 0;

    recordCall({
      leadId: lead.id,
      leadName: lead.customerName,
      phone: lead.phone,
      staffId: currentUser.id,
      staffName: currentUser.name,
      direction: 'outgoing',
      status: callOutcome,
      attemptNumber: (lead.totalAttempts || 0) + 1,
      startTime: new Date(Date.now() - finalDuration * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: finalDuration,
      remarks: remarks.trim() || `Demo call simulated with result: ${callOutcome}`,
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Simulated Outbound Call">
      <div className="space-y-4">
        {/* Notice Badge */}
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Demo Simulation Mode — WebRTC telephony emulator. No actual network call placed.</span>
        </div>

        {/* Customer Header Card */}
        <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Target Lead</span>
            <h4 className="text-base font-bold">{lead.customerName}</h4>
            <p className="text-xs text-slate-300 font-mono mt-0.5">{lead.phone}</p>
            <p className="text-xs text-slate-400 mt-1">
              {lead.campaign} • {lead.interestedProduct}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block">Current Status</span>
            <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-xs font-semibold text-slate-200 mt-0.5">
              {lead.status.toUpperCase()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-2">
              Attempts: <strong className="text-white">{lead.totalAttempts || 0}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Dialing Visual State */}
        {callState === 'initiating' && (
          <div className="py-6 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center animate-pulse text-slate-600 mb-2">
              <Phone className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Initiating Virtual Line...</p>
            <p className="text-xs text-slate-400">Connecting cloud PBX gateway</p>
          </div>
        )}

        {callState === 'ringing' && (
          <div className="py-6 flex flex-col items-center justify-center bg-amber-50/60 rounded-lg border border-amber-200">
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center animate-bounce">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-60" />
            </div>
            <p className="text-sm font-bold text-amber-900">Ringing Customer Handset...</p>
            <p className="text-xs text-amber-700 mt-0.5">Awaiting customer pick up</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleSimulateOutcome('no_answer')}>
                Simulate: No Answer
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleSimulateOutcome('busy')}>
                Simulate: Busy
              </Button>
            </div>
          </div>
        )}

        {callState === 'connected' && (
          <div className="py-5 px-4 flex flex-col items-center justify-center bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <PhoneIncoming className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Call In Progress</p>
            <div className="flex items-center gap-1.5 text-2xl font-bold font-mono text-emerald-950 mt-1">
              <Clock className="w-5 h-5 text-emerald-600 animate-pulse" />
              {formatDuration(seconds)}
            </div>
            <p className="text-xs text-emerald-700 mt-1">Recording active: cloud audio channel</p>

            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" variant="danger" onClick={() => setCallState('ended')}>
                <PhoneOff className="w-4 h-4 mr-1.5" /> End Call
              </Button>
            </div>
          </div>
        )}

        {callState === 'ended' && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase">Call Disposition & Outcome</span>
              <span className="text-xs font-mono font-bold text-slate-800">
                Duration: {formatDuration(seconds > 0 ? seconds : 45)}
              </span>
            </div>

            <div>
              <Select
                label="Call Outcome / Status"
                value={callOutcome}
                onChange={(e) => setCallOutcome(e.target.value as CallStatus)}
                options={[
                  { value: 'completed', label: 'Answered & Completed (Talked to Client)' },
                  { value: 'no_answer', label: 'Ringing — No Answer' },
                  { value: 'busy', label: 'Busy Line / Engaged' },
                  { value: 'failed', label: 'Failed / Switched Off' },
                  { value: 'cancelled', label: 'Client Disconnected / Rejected' },
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
                Call Remarks / Notes
              </label>
              <textarea
                rows={3}
                className="w-full text-xs rounded-md border border-slate-200 p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                placeholder="Enter client reaction, questions asked, next agreed action..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>

          {callState !== 'ended' ? (
            <Button
              variant="brand"
              size="sm"
              onClick={() => {
                setCallOutcome('completed');
                setCallState('ended');
              }}
            >
              Skip To Logging
            </Button>
          ) : (
            <Button variant="brand" size="sm" onClick={handleSaveCall} isLoading={isSaving}>
              <CheckCircle className="w-4 h-4 mr-1.5" /> Save Call Record
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
