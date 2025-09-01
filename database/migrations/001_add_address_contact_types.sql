-- Migration: Add address_type and contact_type fields, combine street fields
-- Date: 2024-01-XX
-- Description: This migration adds address_type and contact_type fields to the companies table
-- and combines street_number and street_name into a single street_address field

-- Step 1: Add new fields
ALTER TABLE companies ADD COLUMN IF NOT EXISTS address_type VARCHAR(50);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS contact_type VARCHAR(50);

-- Step 2: Add the combined street_address field
ALTER TABLE companies ADD COLUMN IF NOT EXISTS street_address VARCHAR(255);

-- Step 3: Migrate existing data (combine street_number + street_name into street_address)
UPDATE companies 
SET street_address = CASE 
    WHEN street_number IS NOT NULL AND street_name IS NOT NULL THEN street_number || ' ' || street_name
    WHEN street_number IS NOT NULL THEN street_number
    WHEN street_name IS NOT NULL THEN street_name
    ELSE NULL
END
WHERE street_address IS NULL;

-- Step 4: Set default values for new fields if they're NULL
UPDATE companies SET address_type = 'Main Office' WHERE address_type IS NULL;
UPDATE companies SET contact_type = 'Primary Contact' WHERE contact_type IS NULL;

-- Step 5: Drop old street fields (optional - uncomment if you want to remove them)
-- ALTER TABLE companies DROP COLUMN IF EXISTS street_number;
-- ALTER TABLE companies DROP COLUMN IF EXISTS street_name;

-- Step 6: Add comments to document the new fields
COMMENT ON COLUMN companies.address_type IS 'Classification of address type (e.g., Billing Address, Shipping Address, Main Office)';
COMMENT ON COLUMN companies.contact_type IS 'Classification of contact role (e.g., Primary Contact, Decision Maker, Technical Contact)';
COMMENT ON COLUMN companies.street_address IS 'Combined street address (number and name)';

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_address_type ON companies(address_type);
CREATE INDEX IF NOT EXISTS idx_companies_contact_type ON companies(contact_type);
CREATE INDEX IF NOT EXISTS idx_companies_street_address ON companies(street_address);

-- Migration complete
SELECT 'Migration 001 completed successfully' as status;
