import React from 'react';
import { LeadStatus } from '../../types/crm';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<
    LeadStatus,
    { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'brand' }
  > = {
    new: { label: 'New Lead', variant: 'brand' },
    assigned: { label: 'Assigned', variant: 'info' },
    contacted: { label: 'Contacted', variant: 'secondary' },
    interested: { label: 'Interested', variant: 'warning' },
    followup: { label: 'Follow-up', variant: 'info' },
    converted: { label: 'Converted', variant: 'success' },
    lost: { label: 'Lost', variant: 'danger' },
    not_connected: { label: 'Not Connected', variant: 'danger' },
  };

  const item = config[status] || { label: status, variant: 'secondary' };

  return (
    <Badge variant={item.variant} size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {item.label}
    </Badge>
  );
};
