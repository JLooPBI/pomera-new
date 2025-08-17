# Pomera Care Database Schema

## Overview
This directory contains the complete database schema for the Pomera Care Recruitment Platform built on Supabase.

## Files
- `schema.sql` - Complete database schema with all tables, indexes, and policies
- `README.md` - This documentation file

## Database Structure

### Tables
1. **companies** - Main CRM entity storing leads, prospects, and clients
2. **company_contacts** - Contact information for each company (multiple contacts per company)
3. **company_notes** - Dynamic notes system for tracking communications
4. **company_files** - Secure document storage with categorization

### Key Features
- UUID primary keys for security
- Row Level Security (RLS) enabled
- Automatic timestamp updates
- Foreign key constraints for data integrity
- Performance indexes on frequently queried fields

## Supabase Configuration
- Project Name: pomera-care
- Environment: Production
- Auth: Enabled with Google OAuth (planned)
- Storage: Enabled for file uploads (planned)

## Deployment Instructions
1. Log into Supabase dashboard
2. Navigate to SQL Editor
3. Run the complete schema.sql file
4. Verify all tables and policies are created

## Environment Variables Required
- NEXT_PUBLIC_SUPABASE_URL=your_project_url
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
- SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

## Data Flow
Lead → Prospect → Client workflow with status tracking and opportunity management.