-- Update RLS policies to allow anonymous access for clinic staff usage

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.patients;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.appointments;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.doctors;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.treatment_plans;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.messages;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow all operations for clinic staff" ON public.patients
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for clinic staff" ON public.appointments
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for clinic staff" ON public.doctors
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for clinic staff" ON public.treatment_plans
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for clinic staff" ON public.messages
FOR ALL USING (true) WITH CHECK (true);