// lib/validators/company.ts

import { z } from 'zod';

export const companySchema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(255),
  industry: z.string().optional(),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  annual_revenue: z.enum(['<1M', '1M-5M', '5M-10M', '10M+']).optional(),
  company_website: z.string().url('Invalid URL').optional().or(z.literal('')),
  
  // Address
  street_number: z.string().max(20).optional(),
  street_name: z.string().max(255).optional(),
  apt_suite: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  state: z.string().length(2, 'State must be 2 characters').optional(),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code').optional(),
  
  // CRM fields
  company_status: z.enum(['lead', 'prospect', 'client', 'inactive']).default('lead'),
  lead_source: z.enum(['website', 'referral', 'cold-call', 'linkedin', 'trade-show', 'other']).optional(),
  lead_score: z.enum(['hot', 'warm', 'cold']).optional(),
  expected_close_date: z.string().optional(),
  
  // Opportunity
  staffing_needs_overview: z.string().optional(),
  immediate_positions: z.number().int().min(0).optional(),
  annual_positions: z.number().int().min(0).optional(),
  opportunity_value: z.number().min(0).optional(),
  position_names: z.string().optional(),
  position_type: z.enum(['full-time', 'temp', 'contract', 'maternity', 'temp-to-perm']).optional(),
  additional_staffing_details: z.string().optional(),
});

export const contactSchema = z.object({
  contact_first_name: z.string().min(1, 'First name is required').max(100),
  contact_last_name: z.string().min(1, 'Last name is required').max(100),
  contact_job_title: z.string().max(150).optional(),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be XXX-XXX-XXXX').optional(),
  contact_mobile: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'Mobile must be XXX-XXX-XXXX').optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'mobile']).optional(),
  is_primary_contact: z.boolean().default(false),
});

export const noteSchema = z.object({
  note_type: z.string().min(1, 'Note type is required'),
  note_text: z.string().min(1, 'Note text is required'),
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NoteFormData = z.infer<typeof noteSchema>;