-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  phone TEXT,
  email TEXT,
  treatment_name TEXT,
  price DECIMAL(10,2),
  duration TEXT,
  appointment_date DATE,
  appointment_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  phone TEXT,
  treatment_name TEXT,
  preferred_date DATE,
  preferred_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'doctor', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients
CREATE POLICY "Allow all operations for authenticated users" 
ON public.patients 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for appointments
CREATE POLICY "Allow all operations for authenticated users" 
ON public.appointments 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for messages
CREATE POLICY "Allow all operations for authenticated users" 
ON public.messages 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.patients (name, age, phone, email, treatment_name, price, duration, appointment_date, appointment_time) VALUES
('John Doe', 32, '+1234567890', 'john@example.com', 'Teeth Cleaning', 150.00, '30 minutes', '2024-01-20', '10:00'),
('Jane Smith', 28, '+1234567891', 'jane@example.com', 'Root Canal', 800.00, '1.5 hours', '2024-01-21', '14:00'),
('Mike Johnson', 45, '+1234567892', 'mike@example.com', 'Dental Implant', 2500.00, '2 hours', '2024-01-22', '09:00');

INSERT INTO public.appointments (patient_name, phone, treatment_name, preferred_date, preferred_time, status) VALUES
('Sarah Wilson', '+1234567893', 'Orthodontic Consultation', '2024-01-25', '11:00', 'pending'),
('Bob Anderson', '+1234567894', 'Teeth Whitening', '2024-01-26', '15:30', 'pending'),
('Lisa Brown', '+1234567895', 'Cavity Filling', '2024-01-27', '13:00', 'approved');

INSERT INTO public.messages (name, email, phone, message) VALUES
('Tom Davis', 'tom@example.com', '+1234567896', 'I would like to schedule an appointment for a dental checkup.'),
('Emma Wilson', 'emma@example.com', '+1234567897', 'Do you accept insurance? I need information about coverage.'),
('David Miller', 'david@example.com', '+1234567898', 'I have severe tooth pain and need an emergency appointment.');