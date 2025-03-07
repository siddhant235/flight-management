-- Create a type for payment method
CREATE TYPE payment_method_type AS ENUM ('credit_card', 'debit_card');

-- Add payment_methods column to profile table
ALTER TABLE profile
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN profile.payment_methods IS 'Array of payment methods stored as JSONB';

-- Create an index on the payment_methods column for better query performance
CREATE INDEX IF NOT EXISTS idx_profile_payment_methods ON profile USING GIN (payment_methods);

-- Enable RLS on the profile table if not already enabled
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profile;
DROP POLICY IF EXISTS "Users can update their own profile" ON profile;

-- Create RLS policies for the entire profile table
CREATE POLICY "Users can view their own profile"
ON profile FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profile FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a function to validate payment method data
CREATE OR REPLACE FUNCTION validate_payment_method(payment_method JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        payment_method ? 'type' AND
        payment_method ? 'cardNumber' AND
        payment_method ? 'expiryDate' AND
        payment_method ? 'cardholderName' AND
        payment_method ? 'isDefault' AND
        (payment_method->>'type')::payment_method_type IS NOT NULL AND
        (payment_method->>'isDefault')::boolean IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to validate payment methods before insert/update
CREATE OR REPLACE FUNCTION validate_payment_methods_trigger()
RETURNS TRIGGER AS $$
DECLARE
    i INTEGER;
BEGIN
    IF NEW.payment_methods IS NOT NULL THEN
        FOR i IN 0..jsonb_array_length(NEW.payment_methods) - 1 LOOP
            IF NOT validate_payment_method(NEW.payment_methods->i) THEN
                RAISE EXCEPTION 'Invalid payment method data at index %', i;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_payment_methods_trigger ON profile;
CREATE TRIGGER validate_payment_methods_trigger
    BEFORE INSERT OR UPDATE ON profile
    FOR EACH ROW
    EXECUTE FUNCTION validate_payment_methods_trigger(); 