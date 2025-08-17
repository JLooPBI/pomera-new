-- Pomera Care Recruitment Platform Database Schema
-- Created: [Current Date]
-- Supabase Project: pomera-care

-- =====================================================
-- COMPANIES TABLE (Main CRM Entity)
-- =====================================================
CREATE TABLE companies (
  company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  annual_revenue VARCHAR(50),
  company_website VARCHAR(255),
  
  -- Address fields
  street_number VARCHAR(20),
  street_name VARCHAR(255),
  apt_suite VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  
  -- CRM pipeline fields
  company_status VARCHAR(20) NOT NULL DEFAULT 'lead',
  lead_source VARCHAR(50),
  lead_score VARCHAR(20),
  expected_close_date DATE,
  
  -- Staffing overview
  staffing_needs_overview TEXT,
  
  -- Opportunity details
  immediate_positions INTEGER,
  annual_positions INTEGER,
  opportunity_value DECIMAL(12,2),
  position_names TEXT,
  position_type VARCHAR(50),
  additional_staffing_details TEXT,
  
  -- Metadata
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_user_id UUID REFERENCES auth.users(id)
);

-- =====================================================
-- COMPANY CONTACTS TABLE
-- =====================================================
CREATE TABLE company_contacts (
  contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  
  contact_first_name VARCHAR(100) NOT NULL,
  contact_last_name VARCHAR(100) NOT NULL,
  contact_job_title VARCHAR(150),
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  contact_mobile VARCHAR(20),
  preferred_contact_method VARCHAR(20) DEFAULT 'email',
  
  is_primary_contact BOOLEAN DEFAULT FALSE,
  is_decision_maker BOOLEAN DEFAULT FALSE,
  is_active_contact BOOLEAN DEFAULT TRUE,
  
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMPANY NOTES TABLE (Dynamic Notes System)
-- =====================================================
CREATE TABLE company_notes (
  note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  
  note_content TEXT NOT NULL,
  
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_user_id UUID REFERENCES auth.users(id),
  created_by_name VARCHAR(255)
);

-- =====================================================
-- COMPANY FILES TABLE (Secure Document Upload)
-- =====================================================
CREATE TABLE company_files (
  file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_category VARCHAR(50) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by_user_id UUID REFERENCES auth.users(id),
  uploaded_by_name VARCHAR(255)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_companies_status ON companies(company_status);
CREATE INDEX idx_companies_created_date ON companies(created_date);
CREATE INDEX idx_contacts_company_id ON company_contacts(company_id);
CREATE INDEX idx_contacts_email ON company_contacts(contact_email);
CREATE INDEX idx_notes_company_id ON company_notes(company_id);
CREATE INDEX idx_files_company_id ON company_files(company_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_files ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================
CREATE POLICY "Enable all operations for companies" ON companies FOR ALL USING (true);
CREATE POLICY "Enable all operations for company_contacts" ON company_contacts FOR ALL USING (true);
CREATE POLICY "Enable all operations for company_notes" ON company_notes FOR ALL USING (true);
CREATE POLICY "Enable all operations for company_files" ON company_files FOR ALL USING (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE