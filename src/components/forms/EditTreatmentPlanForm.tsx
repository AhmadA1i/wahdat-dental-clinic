import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TreatmentPlan {
  id: string;
  treatment_name: string;
  description?: string;
  duration: string;
  total_cost: number;
  status: string;
  start_date?: string;
  end_date?: string;
  patient_id: string;
  doctor_id: string;
}

interface EditTreatmentPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatmentPlan: TreatmentPlan | null;
  onTreatmentPlanUpdated: () => void;
}

interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export const EditTreatmentPlanForm = ({
  open,
  onOpenChange,
  treatmentPlan,
  onTreatmentPlanUpdated
}: EditTreatmentPlanFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    treatment_name: '',
    description: '',
    duration: '',
    total_cost: '',
    status: 'active',
    start_date: '',
    end_date: '',
    patient_id: '',
    doctor_id: ''
  });

  useEffect(() => {
    if (treatmentPlan) {
      setFormData({
        treatment_name: treatmentPlan.treatment_name,
        description: treatmentPlan.description || '',
        duration: treatmentPlan.duration,
        total_cost: treatmentPlan.total_cost.toString(),
        status: treatmentPlan.status,
        start_date: treatmentPlan.start_date || '',
        end_date: treatmentPlan.end_date || '',
        patient_id: treatmentPlan.patient_id,
        doctor_id: treatmentPlan.doctor_id
      });
    }
  }, [treatmentPlan]);

  useEffect(() => {
    if (open) {
      fetchPatients();
      fetchDoctors();
    }
  }, [open]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatmentPlan) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('treatment_plans')
        .update({
          treatment_name: formData.treatment_name,
          description: formData.description || null,
          duration: formData.duration,
          total_cost: parseFloat(formData.total_cost),
          status: formData.status,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          patient_id: formData.patient_id,
          doctor_id: formData.doctor_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', treatmentPlan.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Treatment plan updated successfully",
      });

      onTreatmentPlanUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Treatment Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="treatment_name">Treatment Name</Label>
              <Input
                id="treatment_name"
                value={formData.treatment_name}
                onChange={(e) => setFormData({ ...formData, treatment_name: e.target.value })}
                placeholder="e.g., Root Canal, Teeth Whitening"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2 weeks, 1 month"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the treatment plan..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient</Label>
              <Select value={formData.patient_id} onValueChange={(value) => setFormData({ ...formData, patient_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_id">Doctor</Label>
              <Select value={formData.doctor_id} onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_cost">Total Cost ($)</Label>
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                value={formData.total_cost}
                onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Treatment Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};