// lib/supabase-crm.ts

import { supabase } from './supabase';

// Types
export interface Company {
  company_id: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  annual_revenue?: string;
  company_website?: string;
  
  // Address
  street_number?: string;
  street_name?: string;
  apt_suite?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  
  // Contact Info (primary contact) 
  contact_first_name?: string;
  contact_last_name?: string;
  contact_job_title?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_mobile?: string;
  preferred_contact_method?: string;
  
  // Status fields
  company_status: 'lead' | 'prospect' | 'client' | 'inactive';
  status_id?: number;
  lead_source?: string;
  source_id?: number;
  lead_score?: 'hot' | 'warm' | 'cold';
  score_id?: number;
  size_id?: number;
  revenue_id?: number;
  position_type_id?: number;
  
  // Dates
  expected_close_date?: string;
  
  // Opportunity
  staffing_needs_overview?: string;
  immediate_positions?: number;
  annual_positions?: number;
  opportunity_value?: number;
  position_names?: string;
  position_type?: string;
  additional_staffing_details?: string;
  
  // Metadata
  created_date: string;
  updated_date: string;
  created_by_user_id?: string;
}

export interface CompanyContact {
  contact_id: string;
  company_id: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_job_title?: string;
  contact_email: string;
  contact_phone?: string;
  contact_mobile?: string;
  preferred_contact_method?: 'email' | 'phone' | 'mobile';
  is_primary_contact: boolean;
  created_date: string;
  updated_date: string;
}

export interface CompanyNote {
  note_id: string;
  company_id: string;
  note_type?: string;
  note_type_id?: number;
  note_text: string;
  created_date: string;
  created_by_user_id?: string;
}

export interface CompanyFile {
  file_id: string;
  company_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  file_category?: string;
  file_category_id?: number;
  uploaded_date: string;
  uploaded_by_user_id?: string;
}

// Dimension Types
export interface DimensionValue {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
  color?: string;
}

// Error handling wrapper
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await operation();
    return { data };
  } catch (error: any) {
    console.error(errorMessage, error);
    return { error: error.message || errorMessage };
  }
}

class CRMDatabase {
  // ==================== DIMENSION MANAGEMENT ====================
  
  async getDimensions(tableName: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      
      // Map to consistent format
      return (data || []).map(item => ({
        id: item.status_id || item.source_id || item.score_id || item.size_id || 
            item.revenue_id || item.position_type_id || item.note_type_id || 
            item.method_id || item.category_id,
        name: item.status_name || item.source_name || item.score_name || 
              item.size_name || item.revenue_range || item.position_type_name || 
              item.note_type_name || item.method_name || item.category_name,
        display_order: item.display_order,
        is_active: item.is_active,
        color: item.score_color || item.color
      })) as DimensionValue[];
    }, 'Failed to fetch dimensions');
  }

  async getCompanyStatuses() {
    return this.getDimensions('dim_company_status');
  }

  async getLeadSources() {
    return this.getDimensions('dim_lead_source');
  }

  async getLeadScores() {
    return this.getDimensions('dim_lead_score');
  }

  async getCompanySizes() {
    return this.getDimensions('dim_company_size');
  }

  async getAnnualRevenues() {
    return this.getDimensions('dim_annual_revenue');
  }

  async getPositionTypes() {
    return this.getDimensions('dim_position_type');
  }

  async getNoteTypes() {
    return this.getDimensions('dim_note_type');
  }

  async getContactMethods() {
    return this.getDimensions('dim_contact_method');
  }

  async getFileCategories() {
    return this.getDimensions('dim_file_category');
  }

  // ==================== COMPANIES ====================
  
  async getCompanies(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    return withErrorHandling(async () => {
      // Use the view if it exists, otherwise use the table
      let query = supabase
        .from('companies')
        .select('*')
        .order('created_date', { ascending: false });

      if (filters?.status) {
        query = query.eq('company_status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`company_name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Company[];
    }, 'Failed to fetch companies');
  }

  async getCompanyById(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to fetch company details');
  }

  async createCompany(company: Partial<Company>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to create company');
  }

  async updateCompany(companyId: string, updates: Partial<Company>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to update company');
  }

  async deleteCompany(companyId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('company_id', companyId);

      if (error) throw error;
      return true;
    }, 'Failed to delete company');
  }

  async updateCompanyStatus(companyId: string, status: Company['company_status']) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('companies')
        .update({ company_status: status })
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    }, 'Failed to update company status');
  }

  // ==================== CONTACTS ====================
  
  async getCompanyContacts(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .select('*')
        .eq('company_id', companyId)
        .order('is_primary_contact', { ascending: false });

      if (error) throw error;
      return data as CompanyContact[];
    }, 'Failed to fetch contacts');
  }

  async createContact(contact: Partial<CompanyContact>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .insert([contact])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyContact;
    }, 'Failed to create contact');
  }

  async updateContact(contactId: string, updates: Partial<CompanyContact>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_contacts')
        .update(updates)
        .eq('contact_id', contactId)
        .select()
        .single();

      if (error) throw error;
      return data as CompanyContact;
    }, 'Failed to update contact');
  }

  async deleteContact(contactId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_contacts')
        .delete()
        .eq('contact_id', contactId);

      if (error) throw error;
      return true;
    }, 'Failed to delete contact');
  }

  // ==================== NOTES ====================
  
  async getCompanyNotes(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_notes')
        .select('*')
        .eq('company_id', companyId)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data as CompanyNote[];
    }, 'Failed to fetch notes');
  }

  async createNote(note: Partial<CompanyNote>) {
    return withErrorHandling(async () => {
      // If note_type is provided but not note_type_id, look it up
      if (note.note_type && !note.note_type_id) {
        const noteTypes = await this.getNoteTypes();
        const noteType = noteTypes.data?.find(t => t.name === note.note_type);
        if (noteType) {
          note.note_type_id = noteType.id;
        }
      }

      const { data, error } = await supabase
        .from('company_notes')
        .insert([note])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyNote;
    }, 'Failed to create note');
  }

  async deleteNote(noteId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_notes')
        .delete()
        .eq('note_id', noteId);

      if (error) throw error;
      return true;
    }, 'Failed to delete note');
  }

  // ==================== FILES ====================
  
  async getCompanyFiles(companyId: string) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_files')
        .select('*')
        .eq('company_id', companyId)
        .order('uploaded_date', { ascending: false });

      if (error) throw error;
      return data as CompanyFile[];
    }, 'Failed to fetch files');
  }

  async uploadFile(file: Partial<CompanyFile>) {
    return withErrorHandling(async () => {
      const { data, error } = await supabase
        .from('company_files')
        .insert([file])
        .select()
        .single();

      if (error) throw error;
      return data as CompanyFile;
    }, 'Failed to upload file');
  }

  async deleteFile(fileId: string) {
    return withErrorHandling(async () => {
      const { error } = await supabase
        .from('company_files')
        .delete()
        .eq('file_id', fileId);

      if (error) throw error;
      return true;
    }, 'Failed to delete file');
  }

  // ==================== STATISTICS ====================
  
  async getStatistics() {
    return withErrorHandling(async () => {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('company_status, opportunity_value');

      if (error) throw error;

      const stats = {
        totalLeads: 0,
        totalProspects: 0,
        totalClients: 0,
        totalOpportunityValue: 0
      };

      companies?.forEach(company => {
        switch (company.company_status) {
          case 'lead':
            stats.totalLeads++;
            break;
          case 'prospect':
            stats.totalProspects++;
            break;
          case 'client':
            stats.totalClients++;
            break;
        }
        stats.totalOpportunityValue += company.opportunity_value || 0;
      });

      return stats;
    }, 'Failed to fetch statistics');
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateZipCode(zip: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const crmDatabase = new CRMDatabase();