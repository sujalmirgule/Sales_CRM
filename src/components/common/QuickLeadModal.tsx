import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useCRM } from '../../context/CRMContext';
import { LeadPriority, LeadSource } from '../../types/crm';

const leadSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid 10+ digit phone number is required'),
  email: z.string().email('Valid email address required'),
  source: z.string(),
  campaign: z.string().min(2, 'Campaign name required'),
  interestedProduct: z.string().min(2, 'Product/service interest required'),
  assignedStaffId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  city: z.string().optional(),
  budget: z.coerce.number().optional(),
  remarks: z.string().min(3, 'Initial notes/remarks required'),
  followUpDate: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface QuickLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickLeadModal: React.FC<QuickLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead, staffMembers, campaigns } = useCRM();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      customerName: '',
      phone: '+91 ',
      email: '',
      source: 'facebook_ads',
      campaign: 'FB — Luxury Highrise Showcase (Mumbai & Thane)',
      interestedProduct: '3BHK Sea-Facing Penthouse',
      priority: 'high',
      city: 'Mumbai',
      budget: 15000000,
      remarks: 'Inquired about floor plans and pricing brochure.',
    },
  });

  const onSubmit = (data: LeadFormData) => {
    const assignedStaff = staffMembers.find((s) => s.id === data.assignedStaffId);

    addLead({
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      source: data.source as LeadSource,
      campaign: data.campaign,
      interestedProduct: data.interestedProduct,
      assignedStaffId: assignedStaff ? assignedStaff.id : null,
      assignedStaffName: assignedStaff ? assignedStaff.name : null,
      status: assignedStaff ? 'assigned' : 'new',
      priority: data.priority as LeadPriority,
      city: data.city || 'Mumbai',
      budget: data.budget || 0,
      remarks: data.remarks,
      nextFollowUpDate: data.followUpDate ? `${data.followUpDate}T12:00:00Z` : null,
      notes: [
        {
          id: `NOTE-${Date.now()}`,
          authorId: 'SYSTEM',
          authorName: 'System / Manual Entry',
          text: data.remarks,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" title="Add New Lead">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Customer Full Name *"
            placeholder="e.g. Vikramaditya Singhania"
            error={errors.customerName?.message}
            {...register('customerName')}
          />

          <Input
            label="Phone Number (WhatsApp) *"
            placeholder="+91 98200 XXXXX"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="customer@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Select label="Lead Source *" error={errors.source?.message} {...register('source')}>
            <option value="facebook_ads">Meta Facebook Ads</option>
            <option value="instagram_ads">Instagram Reels Ads</option>
            <option value="whatsapp">WhatsApp Direct Enquiry</option>
            <option value="website_form">Website Form Submission</option>
            <option value="google">Google Search Intent</option>
            <option value="manual">Manual Sales Intake</option>
            <option value="referral">VIP Client Referral</option>
          </Select>

          <Select label="Campaign Name *" error={errors.campaign?.message} {...register('campaign')}>
            {campaigns.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Manual Direct Inbound">Manual Direct Inbound</option>
          </Select>

          <Input
            label="Interested Product / Service *"
            placeholder="e.g. 3BHK Luxury Penthouse"
            error={errors.interestedProduct?.message}
            {...register('interestedProduct')}
          />

          <Select
            label="Assign Sales Executive"
            error={errors.assignedStaffId?.message}
            {...register('assignedStaffId')}
          >
            <option value="">Leave Unassigned (Master Pool)</option>
            {staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.department || 'Sales'})
              </option>
            ))}
          </Select>

          <Select label="Priority Level *" error={errors.priority?.message} {...register('priority')}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">URGENT (Call in 15 mins)</option>
          </Select>

          <Input
            label="City / Location"
            placeholder="e.g. Mumbai, Pune, Delhi NCR"
            error={errors.city?.message}
            {...register('city')}
          />

          <Input
            label="Estimated Budget (₹ INR)"
            type="number"
            placeholder="e.g. 15000000"
            error={errors.budget?.message}
            {...register('budget')}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">
            Initial Remarks / Enquiry Requirements *
          </label>
          <textarea
            rows={2}
            className="w-full text-sm rounded-md border border-slate-200 p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            placeholder="Note key customer requirements, possession timeline, financing preference..."
            {...register('remarks')}
          />
          {errors.remarks && <p className="text-xs text-rose-500 mt-1">{errors.remarks.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="brand" size="sm" isLoading={isSubmitting}>
            Save & Add Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};
