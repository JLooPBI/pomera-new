import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export interface Company {
  company_id?: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  annual_revenue?: string;
  company_website?: string;
  street_number?: string;
  street_name?: string;
  apt_suite?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  company_status: 'lead' | 'prospect' | 'client';
  lead_source?: string;
  lead_score?: 'hot' | 'warm' | 'cold';
  expected_close_date?: string;
  staffing_needs_overview?: string;
  immediate_positions?: number;
  annual_positions?: number;
  opportunity_value?: number;
  position_names?: string;
  position_type?: string;
  additional_staffing_details?: string;
  created_date?: string;
  updated_date?: string;
}

export interface CompanyContact {
  contact_id?: string;
  company_id: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_job_title?: string;
  contact_email: string;
  contact_phone?: string;
  contact_mobile?: string;
  preferred_contact_method: 'email' | 'phone' | 'mobile';
  is_primary_contact: boolean;
  is_decision_maker: boolean;
  is_active_contact: boolean;
  created_date?: string;
  updated_date?: string;
}

export interface CompanyActivity {
  activity_id?: string;
  company_id: string;
  activity_type: string;
  activity_notes: string;
  created_by_name: string;
  follow_up_date?: string;
  created_date?: string;
}

export interface CompanyNote {
  note_id?: string;
  company_id: string;
  note_text: string;
  created_by_name: string;
  created_date?: string;
}

// CRM Database functions
export const crmDatabase = {
  // Create a new company with contact
  async createCompany(companyData: Company, contactData: Omit<CompanyContact, 'company_id'>) {
    try {
      // Insert company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (companyError) throw companyError;

      // Insert primary contact
      const { data: contact, error: contactError } = await supabase
        .from('company_contacts')
        .insert([{ ...contactData, company_id: company.company_id }])
        .select()
        .single();

      if (contactError) throw contactError;

      return { company, contact };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Get companies by status
  async getCompaniesByStatus(status: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_contacts!inner(*)
        `)
        .eq('company_status', status)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Get company by ID with all related data
  async getCompanyById(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_contacts(*),
          company_activities(*),
          company_notes(*)
        `)
        .eq('company_id', companyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },

  // Update company status
  async updateCompanyStatus(companyId: string, status: 'lead' | 'prospect' | 'client') {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ 
          company_status: status,
          updated_date: new Date().toISOString()
        })
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating company status:', error);
      throw error;
    }
  },

  // Add activity to a company
  async addActivity(companyId: string, activityType: string, notes: string, userName: string = 'User', followUpDate?: string) {
    try {
      const { data, error } = await supabase
        .from('company_activities')
        .insert([{
          company_id: companyId,
          activity_type: activityType,
          activity_notes: notes,
          created_by_name: userName,
          follow_up_date: followUpDate,
          created_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  },

  // Add note to a company
  async addNote(companyId: string, noteText: string, userName: string = 'User') {
    try {
      const { data, error } = await supabase
        .from('company_notes')
        .insert([{
          company_id: companyId,
          note_text: noteText,
          created_by_name: userName,
          created_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  // Get all activities for a company
  async getCompanyActivities(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('company_activities')
        .select('*')
        .eq('company_id', companyId)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get all notes for a company
  async getCompanyNotes(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('company_notes')
        .select('*')
        .eq('company_id', companyId)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  // Update company information
  async updateCompany(companyId: string, updateData: Partial<Company>) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...updateData,
          updated_date: new Date().toISOString()
        })
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  // Add additional contact to company
  async addContact(contactData: CompanyContact) {
    try {
      const { data, error } = await supabase
        .from('company_contacts')
        .insert([{
          ...contactData,
          created_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  // Update contact
  async updateContact(contactId: string, updateData: Partial<CompanyContact>) {
    try {
      const { data, error } = await supabase
        .from('company_contacts')
        .update({
          ...updateData,
          updated_date: new Date().toISOString()
        })
        .eq('contact_id', contactId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete company (and all related data)
  async deleteCompany(companyId: string) {
    try {
      // Delete in order due to foreign key constraints
      await supabase.from('company_activities').delete().eq('company_id', companyId);
      await supabase.from('company_notes').delete().eq('company_id', companyId);
      await supabase.from('company_contacts').delete().eq('company_id', companyId);
      
      const { data, error } = await supabase
        .from('companies')
        .delete()
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },

  // Search companies
  async searchCompanies(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_contacts(*)
        `)
        .or(`company_name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`)
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  },

  // Get dashboard stats
  async getDashboardStats() {
    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('company_status, opportunity_value');

      if (error) throw error;

      const stats = {
        totalLeads: companies.filter(c => c.company_status === 'lead').length,
        totalProspects: companies.filter(c => c.company_status === 'prospect').length,
        totalClients: companies.filter(c => c.company_status === 'client').length,
        totalPipelineValue: companies
          .filter(c => c.opportunity_value)
          .reduce((sum, c) => sum + (c.opportunity_value || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
};