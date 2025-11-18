/*
# Add address_type column to addresses table

1. Changes
   - Add `address_type` column to addresses table with default value 'home'
   - Column type: text with check constraint for valid values (home, work, other)

2. Notes
   - Existing addresses will default to 'home' type
   - This column is required for the address form functionality
*/

ALTER TABLE addresses 
ADD COLUMN IF NOT EXISTS address_type text DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other'));
