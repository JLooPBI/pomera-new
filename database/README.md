# Pomera Care Database Setup

This directory contains the database schema for the Pomera Care recruitment platform.

## Database Schema Files

- **`schema.sql`** - Complete database schema with all tables, indexes, and sample data
- **`README.md`** - This file with setup instructions

## CRM Module Database Requirements

The CRM module requires the following database structure:

### Core Tables
1. **`companies`** - Main company/lead records
2. **`company_contacts`** - Contact information for companies
3. **`company_notes`** - Activity tracking and notes
4. **`company_files`** - Document storage

### Dimension Tables (Required for Dropdowns)
1. **`dim_company_status`** - Lead, Prospect, Client, Inactive
2. **`dim_lead_source`** - Website, Referral, Cold Call, etc.
3. **`dim_lead_score`** - Hot, Warm, Cold
4. **`dim_company_size`** - Employee count ranges
5. **`dim_annual_revenue`** - Revenue ranges
6. **`dim_position_type`** - Temporary, Contract, Direct Hire
7. **`dim_note_type`** - Call, Email, Meeting, etc.
8. **`dim_contact_method`** - Email, Phone, Mobile
9. **`dim_file_category`** - Contract, Proposal, Resume, etc.

## Setup Instructions

### 1. Create Database
```sql
-- Create the database (if not exists)
CREATE DATABASE pomera_care;
```

### 2. Run Schema
```sql
-- Connect to the database and run the complete schema
\i schema.sql
```

### 3. Verify Setup
```sql
-- Check that all tables were created
\dt

-- Verify dimension tables have data
SELECT * FROM dim_company_status;
SELECT * FROM dim_lead_source;
SELECT * FROM dim_lead_score;
```

## Environment Variables

Ensure these environment variables are set in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Common Issues

### "Failed to create company" Error
This usually indicates:
1. Database connection issues
2. Missing environment variables
3. Permission issues with the database

## Database Maintenance

- **Backup**: Regular backups of the database
- **Updates**: Run schema updates carefully, testing in development first
- **Performance**: Monitor query performance, especially for large datasets