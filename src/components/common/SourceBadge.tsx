import React from 'react';
import { LeadSource } from '../../types/crm';
import { Badge } from '../ui/Badge';

interface SourceBadgeProps {
  source: LeadSource | string;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, size = 'md' }) => {
  const getSourceLabel = (src: string) => {
    switch (src) {
      case 'facebook_ads':
        return { label: 'Meta FB Ads', variant: 'brand' as const };
      case 'instagram_ads':
        return { label: 'Instagram Ads', variant: 'info' as const };
      case 'meta_bundle':
        return { label: 'Meta Retargeting', variant: 'brand' as const };
      case 'whatsapp':
        return { label: 'WhatsApp', variant: 'success' as const };
      case 'website_form':
        return { label: 'Website Form', variant: 'secondary' as const };
      case 'google':
        return { label: 'Google Search', variant: 'warning' as const };
      case 'manual':
        return { label: 'Manual Entry', variant: 'outline' as const };
      case 'referral':
        return { label: 'Referral VIP', variant: 'success' as const };
      default:
        return { label: src, variant: 'secondary' as const };
    }
  };

  const item = getSourceLabel(source);

  return (
    <Badge variant={item.variant} size={size}>
      {item.label}
    </Badge>
  );
};
