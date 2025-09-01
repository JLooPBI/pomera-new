# Pomera Care Database Data Dictionary

## Overview
This document provides comprehensive documentation of the Pomera Care recruitment platform database schema, including table descriptions, business logic, field usage, and application integration points.

## Table of Contents
- [Core Business Tables](#core-business-tables)
- [Dimension Tables](#dimension-tables)
- [Supporting Tables](#supporting-tables)
- [Database Relationships](#database-relationships)
- [Business Rules](#business-rules)
- [Application Usage](#application-usage)

---

## Core Business Tables

### 1. `companies` - Main CRM Entity
**Purpose**: Central table storing all company/lead information for the recruitment pipeline.

**Business Logic**: 
- Companies progress through a sales pipeline: Lead → Prospect → Client → Inactive
- Each company represents a potential staffing opportunity
- Tracks both company information and primary contact details
- Stores opportunity value and staffing requirements

**Key Fields & Usage**:
- `company_id`: Unique identifier used throughout the system for relationships
- `company_name`: Primary identifier displayed in CRM lists and forms
- `company_status`: Controls which tab/status the company appears in (leads/prospects/clients)
- `lead_score`: Indicates urgency/priority (hot/warm/cold) - used for prioritization
- `opportunity_value`: Financial value of the staffing opportunity - used in reporting and prioritization
- `expected_close_date`: Sales pipeline management - used for forecasting and follow-up scheduling

**Application Usage**:
- **CRM Dashboard**: Main company list with filtering by status
- **Company Forms**: Add/edit company information
- **Reporting**: Pipeline analysis, opportunity value tracking
- **Search**: Company lookup across all fields

**Related Tables**: `company_contacts`, `company_notes`, `company_files`

**Field Details**:
| Field Name | Type | Description | Business Usage |
|------------|------|-------------|----------------|
| `company_id` | UUID | Primary key, auto-generated | Unique identifier for all relationships |
| `company_name` | VARCHAR(255) | Company name (required) | Primary display field, search key |
| `industry` | VARCHAR(100) | Industry classification | Filtering, reporting, market analysis |
| `company_size` | VARCHAR(50) | Employee count range | Sales targeting, opportunity sizing |
| `annual_revenue` | VARCHAR(50) | Revenue range | Sales prioritization, opportunity value |
| `company_website` | VARCHAR(255) | Company website URL | Research, contact information |
| `street_address` | VARCHAR(255) | Combined street address | Location tracking, shipping/billing |
| `apt_suite` | VARCHAR(50) | Apartment/suite number | Detailed address information |
| `city` | VARCHAR(100) | City name | Geographic filtering, reporting |
| `state` | VARCHAR(2) | State abbreviation | Geographic filtering, reporting |
| `zip_code` | VARCHAR(10) | ZIP code (5 or 9 digits) | Geographic filtering, reporting |
| `address_type` | VARCHAR(50) | Address classification | Address organization, billing vs shipping |
| `contact_first_name` | VARCHAR(100) | Primary contact first name | Communication, relationship management |
| `contact_last_name` | VARCHAR(100) | Primary contact last name | Communication, relationship management |
| `contact_job_title` | VARCHAR(150) | Primary contact job title | Role identification, decision making |
| `contact_email` | VARCHAR(255) | Primary contact email | Primary communication method |
| `contact_phone` | VARCHAR(20) | Primary contact phone | Alternative communication method |
| `contact_mobile` | VARCHAR(20) | Primary contact mobile | Alternative communication method |
| `preferred_contact_method` | VARCHAR(20) | Preferred communication | Communication strategy |
| `contact_type` | VARCHAR(50) | Contact role classification | Contact organization, relationship mapping |
| `company_status` | VARCHAR(20) | Pipeline status (required) | CRM pipeline management, reporting |
| `lead_source` | VARCHAR(50) | Lead origin | Marketing effectiveness, source tracking |
| `lead_score` | VARCHAR(20) | Lead priority/urgency | Sales prioritization, follow-up scheduling |
| `expected_close_date` | DATE | Expected conversion date | Sales forecasting, pipeline management |
| `staffing_needs_overview` | TEXT | Staffing requirements summary | Opportunity assessment, resource planning |
| `immediate_positions` | INTEGER | Immediate hiring needs | Urgency assessment, resource allocation |
| `annual_positions` | INTEGER | Annual hiring projection | Long-term planning, capacity assessment |
| `opportunity_value` | DECIMAL(12,2) | Financial opportunity value | Sales prioritization, revenue forecasting |
| `position_names` | TEXT | Specific position titles | Detailed opportunity information |
| `position_type` | VARCHAR(50) | Position classification | Resource planning, skill matching |
| `additional_staffing_details` | TEXT | Additional requirements | Comprehensive opportunity assessment |
| `created_date` | TIMESTAMP | Record creation date | Audit trail, reporting |
| `updated_date` | TIMESTAMP | Last modification date | Audit trail, change tracking |
| `created_by_user_id` | UUID | User who created record | Audit trail, accountability |

---

### 2. `company_contacts` - Contact Management
**Purpose**: Stores multiple contacts per company with role and preference information.

**Business Logic**:
- Companies can have multiple contacts with different roles
- Primary contact is the main point of contact for the company
- Decision makers are flagged for sales prioritization
- Tracks preferred communication methods

**Key Fields & Usage**:
- `company_id`: Links to the parent company
- `is_primary_contact`: Boolean flag determining main contact
- `is_decision_maker`: Boolean flag for sales prioritization
- `preferred_contact_method`: Used for communication preferences

**Application Usage**:
- **Contact Management**: Add/edit multiple contacts per company
- **Sales Process**: Identify decision makers and primary contacts
- **Communication**: Respect preferred contact methods

**Related Tables**: `companies`

---

### 3. `company_notes` - Activity Tracking
**Purpose**: Tracks all interactions, notes, and activities with companies.

**Business Logic**:
- Maintains audit trail of all company interactions
- Notes are categorized by type for better organization
- Timestamps track when activities occurred
- Links to users who created the notes

**Key Fields & Usage**:
- `note_content`: Free-text field for activity descriptions
- `created_by_user_id`: Links to user who created the note
- `created_date`: Timestamp for activity tracking

**Application Usage**:
- **Activity Log**: View all company interactions chronologically
- **Sales Process**: Track follow-ups, meetings, and communications
- **Reporting**: Analyze activity patterns and frequency

**Related Tables**: `companies`

---

### 4. `company_files` - Document Management
**Purpose**: Stores and organizes company-related documents and files.

**Business Logic**:
- Files are categorized for better organization
- Tracks file metadata (size, type, upload date)
- Links files to specific companies
- Maintains audit trail of uploads

**Key Fields & Usage**:
- `file_category`: Organizes files by type (contract, proposal, resume, etc.)
- `file_path`: Storage location reference
- `uploaded_by_user_id`: Tracks who uploaded the file

**Application Usage**:
- **Document Storage**: Secure file upload and retrieval
- **File Organization**: Categorized file management
- **Audit Trail**: Track document uploads and modifications

**Related Tables**: `companies`

---

## Dimension Tables

### 5. `dim_industry` - Industry Classifications
**Purpose**: Standardized list of healthcare industry types for company categorization.

**Business Logic**:
- Healthcare-focused industry classifications
- Used for market segmentation and reporting
- Companies are assigned one primary industry

**Sample Values**: Skilled Nursing, Long Term Care, Hospital, Assisted Living, etc.

**Application Usage**:
- **Company Forms**: Dropdown selection for industry
- **Reporting**: Industry-based analysis and segmentation
- **Filtering**: Filter companies by industry type

---

### 6. `dim_company_status` - Sales Pipeline Status
**Purpose**: Defines the stages in the sales pipeline.

**Business Logic**:
- Represents the progression of companies through the sales process
- Status changes trigger different workflows and views
- Used for pipeline management and forecasting

**Sample Values**: lead, prospect, client, inactive

**Application Usage**:
- **CRM Tabs**: Separate views for leads, prospects, and clients
- **Pipeline Management**: Track company progression
- **Reporting**: Pipeline analysis and conversion rates

---

### 7. `dim_lead_source` - Lead Origin Tracking
**Purpose**: Tracks how companies became leads.

**Business Logic**:
- Identifies most effective lead generation channels
- Used for marketing ROI analysis
- Helps optimize lead generation strategies

**Sample Values**: Website, Referral, Cold Call, Trade Show, Social Media, etc.

**Application Usage**:
- **Company Forms**: Dropdown for lead source
- **Marketing Analysis**: Track lead source effectiveness
- **Reporting**: Lead source performance metrics

---

### 8. `dim_lead_score` - Lead Priority Scoring
**Purpose**: Indicates urgency and priority of leads.

**Business Logic**:
- Hot leads require immediate attention
- Warm leads need follow-up within days
- Cold leads can be contacted less frequently
- Color coding provides visual priority indicators

**Sample Values**: hot (red), warm (orange), cold (blue)

**Application Usage**:
- **Lead Prioritization**: Visual indicators for urgency
- **Workflow Management**: Different follow-up schedules
- **Reporting**: Lead quality analysis

---

### 9. `dim_company_size` - Employee Count Ranges
**Purpose**: Categorizes companies by employee count.

**Business Logic**:
- Larger companies typically have bigger staffing needs
- Used for opportunity sizing and resource allocation
- Helps determine sales approach and timeline

**Sample Values**: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+ employees

**Application Usage**:
- **Company Forms**: Dropdown for company size
- **Opportunity Sizing**: Estimate staffing needs
- **Reporting**: Company size distribution analysis

---

### 10. `dim_annual_revenue` - Revenue Range Classifications
**Purpose**: Categorizes companies by annual revenue.

**Business Logic**:
- Revenue indicates ability to pay for staffing services
- Higher revenue companies may have larger opportunities
- Used for pricing strategy and opportunity prioritization

**Sample Values**: Under $1M, $1M-$5M, $5M-$10M, $10M-$25M, $25M-$50M, $50M-$100M, $100M+

**Application Usage**:
- **Company Forms**: Dropdown for annual revenue
- **Opportunity Prioritization**: Focus on companies with budget
- **Reporting**: Revenue-based opportunity analysis

---

### 11. `dim_position_type` - Job Position Classifications
**Purpose**: Defines types of staffing positions offered.

**Business Logic**:
- Different position types have different timelines and requirements
- Temporary vs. permanent positions have different sales cycles
- Used for opportunity scoping and resource planning

**Sample Values**: Temporary, Contract, Direct Hire, Contract-to-Hire

**Application Usage**:
- **Company Forms**: Dropdown for position type
- **Opportunity Scoping**: Define staffing requirements
- **Reporting**: Position type distribution analysis

---

### 12. `dim_note_type` - Activity Categorization
**Purpose**: Categorizes different types of company interactions.

**Business Logic**:
- Organizes activities for better tracking and reporting
- Different note types may have different follow-up requirements
- Used for activity analysis and process improvement

**Sample Values**: Call, Email, Meeting, Follow-up, Proposal, Other

**Application Usage**:
- **Note Creation**: Dropdown for note categorization
- **Activity Tracking**: Organize interactions by type
- **Reporting**: Activity type analysis and frequency

---

### 13. `dim_contact_method` - Communication Preferences
**Purpose**: Defines preferred communication methods for contacts.

**Business Logic**:
- Respects contact preferences for better relationship building
- Different methods may have different response rates
- Used for communication strategy and follow-up planning

**Sample Values**: Email, Phone, Mobile

**Application Usage**:
- **Contact Forms**: Dropdown for preferred method
- **Communication Planning**: Respect contact preferences
- **Reporting**: Communication method effectiveness

---

### 14. `dim_contact_type` - Contact Role Classifications
**Purpose**: Defines the role and relationship of contacts within companies.

**Business Logic**:
- Different contact types have different influence levels
- Decision makers are critical for sales success
- Used for sales strategy and relationship mapping

**Sample Values**: Primary Contact, Decision Maker, Technical Contact, Billing Contact, etc.

**Application Usage**:
- **Contact Forms**: Dropdown for contact type
- **Sales Strategy**: Identify key decision makers
- **Reporting**: Contact type distribution analysis

---

### 15. `dim_address_type` - Address Classification
**Purpose**: Categorizes different types of company addresses.

**Business Logic**:
- Companies may have multiple addresses for different purposes
- Billing vs. shipping addresses have different business implications
- Used for address management and business operations

**Sample Values**: Billing Address, Shipping Address, Main Office, Branch Office, etc.

**Application Usage**:
- **Address Management**: Organize multiple addresses
- **Business Operations**: Different address types for different purposes
- **Reporting**: Address type distribution analysis

---

### 16. `dim_file_category` - Document Classification
**Purpose**: Organizes uploaded files by type and purpose.

**Business Logic**:
- Different file types have different retention and access requirements
- Used for document organization and compliance
- Helps users quickly find relevant documents

**Sample Values**: Contract, Proposal, Resume, Reference, Other

**Application Usage**:
- **File Upload**: Dropdown for file categorization
- **Document Organization**: Group files by type
- **Reporting**: File type distribution analysis

---

## Database Relationships

### Primary Relationships
```
companies (1) ←→ (many) company_contacts
companies (1) ←→ (many) company_notes  
companies (1) ←→ (many) company_files
```

### Foreign Key References
- `company_contacts.company_id` → `companies.company_id`
- `company_notes.company_id` → `companies.company_id`
- `company_files.company_id` → `companies.company_id`
- `companies.created_by_user_id` → `auth.users(id)`
- `company_contacts.created_by_user_id` → `auth.users(id)`
- `company_notes.created_by_user_id` → `auth.users(id)`
- `company_files.uploaded_by_user_id` → `auth.users(id)`

---

## Business Rules

### 1. Company Status Progression
- Companies start as "lead" status
- Progress through "prospect" to "client"
- Can be marked "inactive" at any stage
- Status changes should trigger appropriate workflows

### 2. Contact Management
- Each company must have at least one contact
- Only one contact can be marked as primary
- Decision makers should be prioritized in sales process

### 3. Data Validation
- Company names are required and must be unique
- Email addresses must be valid format
- Phone numbers should follow standard formatting
- Dates must be valid and logical

### 4. File Management
- Files must be categorized upon upload
- File size and type restrictions apply
- Access control based on company association

---

## Application Usage

### CRM Dashboard
- **Main View**: List of companies filtered by status
- **Search**: Company lookup across all fields
- **Filtering**: By status, industry, size, revenue, etc.
- **Actions**: Add, edit, view company details

### Company Management
- **Forms**: Comprehensive company information entry
- **Validation**: Required field checking and format validation
- **Relationships**: Contact, note, and file management
- **Status Management**: Pipeline progression tracking

### Reporting & Analytics
- **Pipeline Analysis**: Status distribution and conversion rates
- **Opportunity Tracking**: Value and timeline analysis
- **Activity Analysis**: Note and interaction frequency
- **Performance Metrics**: Lead source effectiveness, industry distribution

### Data Export
- **Company Lists**: Filtered exports for sales activities
- **Contact Lists**: Communication and follow-up management
- **Activity Reports**: Interaction history and patterns

---

## Maintenance & Updates

### Schema Changes
- All schema modifications must be documented here
- Update table descriptions and field usage
- Document new business rules and relationships
- Update application usage sections

### Data Quality
- Regular validation of required fields
- Cleanup of orphaned records
- Maintenance of dimension table values
- Performance monitoring and optimization

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| Initial | 1.0 | Initial data dictionary creation |
| 2024-01-XX | 1.1 | Added address_type and contact_type fields to companies table, combined street_number and street_name into street_address |
| Current | 1.1 | Complete documentation of all tables and relationships with enhanced address and contact management |

---

*This document should be updated whenever database schema changes are made to maintain accurate documentation of the system.*
