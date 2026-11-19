import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useCRM } from '../../context/CRMContext';
import { Lead } from '../../types/crm';
import { UserCheck } from 'lucide-react';

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({ isOpen, onClose, lead }) => {
  const { staffMembers, assignLead } = useCRM();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffMembers[0]?.id || '');

  if (!lead) return null;

  const handleAssign = () => {
    if (!selectedStaffId) return;
    assignLead(lead.id, selectedStaffId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" title="Assign Lead to Sales Executive">
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
          <p className="text-xs text-slate-500">Lead Target:</p>
          <p className="text-sm font-bold text-slate-800">{lead.customerName}</p>
          <p className="text-xs text-slate-600">{lead.phone} • {lead.interestedProduct}</p>
        </div>

        <Select
          label="Select Sales Representative"
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
        >
          {staffMembers
            .filter((staff) => staff.status === 'active')
            .map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} — {staff.designation || staff.department || 'Sales'}
              </option>
            ))}
        </Select>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="brand" size="sm" onClick={handleAssign}>
            <UserCheck className="w-4 h-4 mr-1.5" /> Reassign Lead
          </Button>
        </div>
      </div>
    </Modal>
  );
};
