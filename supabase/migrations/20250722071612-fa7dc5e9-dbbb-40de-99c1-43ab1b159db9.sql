-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create treatment_plans table
CREATE TABLE public.treatment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  treatment_name TEXT NOT NULL,
  description TEXT,
  duration TEXT NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add doctor_id to patients table
ALTER TABLE public.patients 
ADD COLUMN doctor_id UUID REFERENCES doctors(id);

-- Add doctor_id to appointments table
ALTER TABLE public.appointments 
ADD COLUMN doctor_id UUID REFERENCES doctors(id);

-- Enable RLS on new tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors table
CREATE POLICY "Allow all operations for authenticated users" 
ON public.doctors 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for treatment_plans table
CREATE POLICY "Allow all operations for authenticated users" 
ON public.treatment_plans 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at
BEFORE UPDATE ON public.treatment_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors
INSERT INTO public.doctors (name, specialty, phone, email, status) VALUES
('Dr. Sarah Johnson', 'General Dentistry', '+1-555-0101', 'sarah.johnson@wahdat.com', 'active'),
('Dr. Michael Chen', 'Orthodontics', '+1-555-0102', 'michael.chen@wahdat.com', 'active'),
('Dr. Emily Davis', 'Periodontics', '+1-555-0103', 'emily.davis@wahdat.com', 'active'),
('Dr. James Wilson', 'Oral Surgery', '+1-555-0104', 'james.wilson@wahdat.com', 'active');

-- Insert sample treatment plans
INSERT INTO public.treatment_plans (patient_id, doctor_id, treatment_name, description, duration, total_cost, status, start_date, end_date) 
SELECT 
  p.id,
  d.id,
  'Teeth Cleaning',
  'Regular dental cleaning and checkup',
  '1 hour',
  150.00,
  'active',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 month'
FROM patients p 
CROSS JOIN doctors d 
WHERE p.name = 'John Smith' AND d.name = 'Dr. Sarah Johnson'
LIMIT 1;