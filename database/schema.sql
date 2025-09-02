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
  tin VARCHAR(20),
  
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
-- COMPANY ADDRESSES TABLE
-- =====================================================
CREATE TABLE company_addresses (
  address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  
  address_type VARCHAR(50) NOT NULL,
  street_address VARCHAR(255),
  apt_suite VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  
  is_primary_address BOOLEAN DEFAULT FALSE,
  is_billing_address BOOLEAN DEFAULT FALSE,
  is_shipping_address BOOLEAN DEFAULT FALSE,
  
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMPANY CONTACTS TABLE
-- =====================================================
CREATE TABLE company_contacts (
  contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
  
  contact_type VARCHAR(50) NOT NULL,
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
  
  note_type VARCHAR(100),
  note_type_id INTEGER,
  note_text TEXT NOT NULL,
  note_content TEXT,
  follow_up_date DATE,
  follow_up_type VARCHAR(50),
  follow_up_completed BOOLEAN DEFAULT FALSE,
  follow_up_notes TEXT,
  
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
CREATE INDEX idx_addresses_company_id ON company_addresses(company_id);
CREATE INDEX idx_contacts_company_id ON company_contacts(company_id);
CREATE INDEX idx_contacts_email ON company_contacts(contact_email);
CREATE INDEX idx_notes_company_id ON company_notes(company_id);
CREATE INDEX idx_files_company_id ON company_files(company_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_files ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================
CREATE POLICY "Enable all operations for companies" ON companies FOR ALL USING (true);
CREATE POLICY "Enable all operations for company_addresses" ON company_addresses FOR ALL USING (true);
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

-- =====================================================
-- DIMENSION TABLES FOR CRM DROPDOWNS
-- =====================================================

-- Industry Dimension
CREATE TABLE dim_industry (
  industry_id SERIAL PRIMARY KEY,
  industry_name VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Status Dimension
CREATE TABLE dim_company_status (
  status_id SERIAL PRIMARY KEY,
  status_name VARCHAR(50) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Source Dimension
CREATE TABLE dim_lead_source (
  source_id SERIAL PRIMARY KEY,
  source_name VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Score Dimension
CREATE TABLE dim_lead_score (
  score_id SERIAL PRIMARY KEY,
  score_name VARCHAR(20) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  score_color VARCHAR(20),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Size Dimension
CREATE TABLE dim_company_size (
  size_id SERIAL PRIMARY KEY,
  size_name VARCHAR(50) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Annual Revenue Dimension
CREATE TABLE dim_annual_revenue (
  revenue_id SERIAL PRIMARY KEY,
  revenue_range VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Position Type Dimension
CREATE TABLE dim_position_type (
  position_type_id SERIAL PRIMARY KEY,
  position_type_name VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note Type Dimension
CREATE TABLE dim_note_type (
  note_type_id SERIAL PRIMARY KEY,
  note_type_name VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Method Dimension
CREATE TABLE dim_contact_method (
  method_id SERIAL PRIMARY KEY,
  method_name VARCHAR(50) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Type Dimension
CREATE TABLE dim_contact_type (
  contact_type_id SERIAL PRIMARY KEY,
  contact_type_name VARCHAR(50) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Address Type Dimension
CREATE TABLE dim_address_type (
  address_type_id SERIAL PRIMARY KEY,
  address_type_name VARCHAR(50) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Category Dimension
CREATE TABLE dim_file_category (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INSERT DEFAULT DIMENSION VALUES
-- =====================================================

-- Industries
INSERT INTO dim_industry (industry_name, display_order) VALUES 
  ('Skilled Nursing', 1),
  ('Long Term Care', 2),
  ('Vendor for Post-Acute', 3),
  ('Assisted Living', 4),
  ('Multi-Specialty Clinic', 5),
  ('Hospital', 6),
  ('Other', 7);

-- Company Statuses
INSERT INTO dim_company_status (status_name, display_order) VALUES 
  ('lead', 1),
  ('prospect', 2),
  ('client', 3),
  ('inactive', 4);

-- Lead Sources
INSERT INTO dim_lead_source (source_name, display_order) VALUES 
  ('Website', 1),
  ('Referral', 2),
  ('Cold Call', 3),
  ('Trade Show', 4),
  ('Social Media', 5),
  ('Email Campaign', 6),
  ('Other', 7);

-- Lead Scores
INSERT INTO dim_lead_score (score_name, display_order, score_color) VALUES 
  ('hot', 1, 'red'),
  ('warm', 2, 'orange'),
  ('cold', 3, 'blue');

-- Company Sizes
INSERT INTO dim_company_size (size_name, display_order) VALUES 
  ('1-10 employees', 1),
  ('11-50 employees', 2),
  ('51-200 employees', 3),
  ('201-500 employees', 4),
  ('501-1000 employees', 5),
  ('1000+ employees', 6);

-- Annual Revenues
INSERT INTO dim_annual_revenue (revenue_range, display_order) VALUES 
  ('Under $1M', 1),
  ('$1M - $5M', 2),
  ('$5M - $10M', 3),
  ('$10M - $25M', 4),
  ('$25M - $50M', 5),
  ('$50M - $100M', 6),
  ('$100M+', 7);

-- Position Types
INSERT INTO dim_position_type (position_type_name, display_order) VALUES 
  ('Temporary', 1),
  ('Contract', 2),
  ('Direct Hire', 3),
  ('Contract-to-Hire', 4);

-- Note Types
INSERT INTO dim_note_type (note_type_name, display_order) VALUES 
  ('Call', 1),
  ('Email', 2),
  ('Meeting', 3),
  ('Follow-up', 4),
  ('Proposal', 5),
  ('Other', 6);

-- Contact Methods
INSERT INTO dim_contact_method (method_name, display_order) VALUES 
  ('Email', 1),
  ('Phone', 2),
  ('Mobile', 3);

-- Contact Types
INSERT INTO dim_contact_type (contact_type_name, display_order) VALUES 
  ('Primary Contact', 1),
  ('Decision Maker', 2),
  ('Technical Contact', 3),
  ('Billing Contact', 4),
  ('Secondary Contact', 5),
  ('Influencer', 6),
  ('Gatekeeper', 7),
  ('Other', 8);

-- Address Types
INSERT INTO dim_address_type (address_type_name, display_order) VALUES 
  ('Billing Address', 1),
  ('Shipping Address', 2),
  ('Main Office', 3),
  ('Branch Office', 4),
  ('Remote Office', 5),
  ('Home Office', 6),
  ('Other', 7);

-- File Categories
INSERT INTO dim_file_category (category_name, display_order) VALUES 
  ('Contract', 1),
  ('Proposal', 2),
  ('Resume', 3),
  ('Reference', 4),
  ('Other', 5);

-- =====================================================
-- TRIGGERS FOR UPDATED_DATE
-- =====================================================

CREATE TRIGGER update_companies_updated_date 
  BEFORE UPDATE ON companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_company_contacts_updated_date 
  BEFORE UPDATE ON company_contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();