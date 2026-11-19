import React from 'react';
import { LeadPriority } from '../../types/crm';
import { Badge } from '../ui/Badge';

interface PriorityBadgeProps {
  priority: LeadPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const map: Record<LeadPriority, { label: string; variant: 'secondary' | 'info' | 'warning' | 'danger' }> = {
    low: { label: 'Low', variant: 'secondary' },
    medium: { label: 'Medium', variant: 'info' },
    high: { label: 'High Priority', variant: 'warning' },
    urgent: { label: 'URGENT', variant: 'danger' },
  };

  const item = map[priority] || map.medium;

  return (
    <Badge variant={item.variant} size={size}>
      {item.label}
    </Badge>
  );
};
