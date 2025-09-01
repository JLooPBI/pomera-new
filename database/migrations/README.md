# Database Migrations

This directory contains database migration scripts for the Pomera Care platform.

## Migration 001: Add Address and Contact Type Fields

**File**: `001_add_address_contact_types.sql`

**Purpose**: 
- Add `address_type` field to classify addresses (Billing, Shipping, Main Office, etc.)
- Add `contact_type` field to classify contacts (Primary Contact, Decision Maker, etc.)
- Combine `street_number` and `street_name` into a single `street_address` field

**Changes Made**:
1. Added `address_type VARCHAR(50)` field
2. Added `contact_type VARCHAR(50)` field  
3. Added `street_address VARCHAR(255)` field
4. Migrated existing data from separate street fields
5. Set default values for new fields
6. Added performance indexes
7. Added field documentation

**To Apply Migration**:
```sql
-- Run the migration script in your Supabase SQL editor
\i database/migrations/001_add_address_contact_types.sql
```

**Rollback** (if needed):
```sql
-- Remove new fields
ALTER TABLE companies DROP COLUMN IF EXISTS address_type;
ALTER TABLE companies DROP COLUMN IF EXISTS contact_type;
ALTER TABLE companies DROP COLUMN IF EXISTS street_address;

-- Restore old fields if they were dropped
ALTER TABLE companies ADD COLUMN street_number VARCHAR(20);
ALTER TABLE companies ADD COLUMN street_name VARCHAR(255);

-- Drop indexes
DROP INDEX IF EXISTS idx_companies_address_type;
DROP INDEX IF EXISTS idx_companies_contact_type;
DROP INDEX IF EXISTS idx_companies_street_address;
```

**Impact**: 
- Existing data will be preserved and migrated
- New fields will have sensible defaults
- Performance will be improved with new indexes
- UI forms now include dropdowns for better data organization

## Future Migrations

When adding new migrations:
1. Create a new numbered SQL file
2. Update this README with migration details
3. Test the migration on a copy of production data
4. Document any rollback procedures
5. Update the DATA_DICTIONARY.md file
