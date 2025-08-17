import { supabase } from './supabase'

// Types for our database entities
export interface Company {
  company_id?: string
  company_name: string
  industry?: string
  company_size?: string
  annual_revenue?: string
  company_website?: string
  
  // Address
  street_number?: string
  street_name?: string
  apt_suite?: string
  city?: string
  state?: string
  zip_code?: string
  
  // CRM fields
  company_status: 'lead' | 'prospect' | 'client' | 'inactive'
  lead_source?: string
  lead_score?: string
  expected_close_date?: string
  
  // Staffing
  staffing_needs_overview?: string
  immediate_positions?: number
  annual_positions?: number
  opportunity_value?: number
  position_names?: string
  position_type?: string
  additional_staffing_details?: string
  
  // Metadata
  created_date?: string
  updated_date?: string
  created_by_user_id?: string
}

export interface CompanyContact {
  contact_id?: string
  company_id: string
  contact_first_name: string
  contact_last_name: string
  contact_job_title?: string
  contact_email: string
  contact_phone?: string
  contact_mobile?: string
  preferred_contact_method: 'email' | 'phone' | 'mobile'
  is_primary_contact: boolean
  is_decision_maker: boolean
  is_active_contact: boolean
}

export interface CompanyNote {
  note_id?: string
  company_id: string
  note_content: string
  created_date?: string
  created_by_user_id?: string
  created_by_name?: string
}

// Database functions
export const crmDatabase = {
  // Create a new company with contact
  async createCompany(companyData: Company, contactData: Omit<CompanyContact, 'company_id'>) {
    try {
      // Insert company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single()

      if (companyError) throw companyError

      // Insert primary contact
      const contactToInsert = {
        ...contactData,
        company_id: company.company_id,
        is_primary_contact: true
      }

      const { data: contact, error: contactError } = await supabase
        .from('company_contacts')
        .insert([contactToInsert])
        .select()
        .single()

      if (contactError) throw contactError

      return { company, contact }
    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  },

  // Get all companies by status
  async getCompaniesByStatus(status: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_contacts (
            contact_id,
            contact_first_name,
            contact_last_name,
            contact_email,
            contact_phone,
            is_primary_contact
          )
        `)
        .eq('company_status', status)
        .order('created_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching companies:', error)
      throw error
    }
  },

  // Get single company with all related data
  async getCompanyById(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_contacts (*),
          company_notes (*),
          company_files (*)
        `)
        .eq('company_id', companyId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching company:', error)
      throw error
    }
  },

  // Add a note to a company
  async addNote(companyId: string, noteContent: string, userName: string = 'User') {
    try {
      const { data, error } = await supabase
        .from('company_notes')
        .insert([{
          company_id: companyId,
          note_content: noteContent,
          created_by_name: userName
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  },

  // Get notes for a company
  async getNotes(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('company_notes')
        .select('*')
        .eq('company_id', companyId)
        .order('created_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw error
    }
  },

  // Search companies
  async searchCompanies(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_contacts (
            contact_first_name,
            contact_last_name,
            contact_email,
            is_primary_contact
          )
        `)
        .or(`company_name.ilike.%${searchTerm}%, industry.ilike.%${searchTerm}%`)
        .order('created_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching companies:', error)
      throw error
    }
  },

  // Update company status (Lead -> Prospect -> Client)
  async updateCompanyStatus(companyId: string, newStatus: string) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ company_status: newStatus })
        .eq('company_id', companyId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating company status:', error)
      throw error
    }
  }
}