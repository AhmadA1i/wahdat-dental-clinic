import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  doctor_id?: string;
}

interface EditPatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onPatientUpdated: () => void;
}

export const EditPatientForm = ({ open, onOpenChange, patient, onPatientUpdated }: EditPatientFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    doctor_id: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age?.toString() || '',
        phone: patient.phone || '',
        email: patient.email || '',
        doctor_id: patient.doctor_id || ''
      });
    }
  }, [patient]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty')
        .eq('status', 'active');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          name: formData.name,
          age: parseInt(formData.age),
          phone: formData.phone,
          email: formData.email,
          doctor_id: formData.doctor_id || null,
        })
        .eq('id', patient.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient updated successfully",
      });

      onPatientUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Patient Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="doctor">Assign Doctor</Label>
            <Select value={formData.doctor_id} onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No doctor assigned</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};