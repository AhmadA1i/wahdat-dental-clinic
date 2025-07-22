import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface AddTreatmentPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTreatmentPlanAdded: () => void;
  selectedPatientId?: string;
}

export function AddTreatmentPlanForm({ 
  open, 
  onOpenChange, 
  onTreatmentPlanAdded, 
  selectedPatientId 
}: AddTreatmentPlanFormProps) {
  const [formData, setFormData] = useState({
    patient_id: selectedPatientId || "",
    doctor_id: "",
    treatment_name: "",
    description: "",
    duration: "",
    total_cost: "",
    status: "active",
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      setFormData(prev => ({ ...prev, patient_id: selectedPatientId }));
    }
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, name");

    if (error) {
      console.error("Error fetching patients:", error);
    } else {
      setPatients(data || []);
    }
  };

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("id, name, specialty")
      .eq("status", "active");

    if (error) {
      console.error("Error fetching doctors:", error);
    } else {
      setDoctors(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("treatment_plans")
        .insert([
          {
            patient_id: formData.patient_id,
            doctor_id: formData.doctor_id,
            treatment_name: formData.treatment_name,
            description: formData.description,
            duration: formData.duration,
            total_cost: parseFloat(formData.total_cost),
            status: formData.status,
            start_date: formData.start_date?.toISOString().split('T')[0],
            end_date: formData.end_date?.toISOString().split('T')[0],
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Treatment plan added successfully!",
      });

      setFormData({
        patient_id: selectedPatientId || "",
        doctor_id: "",
        treatment_name: "",
        description: "",
        duration: "",
        total_cost: "",
        status: "active",
        start_date: undefined,
        end_date: undefined,
      });
      onTreatmentPlanAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding treatment plan:", error);
      toast({
        title: "Error",
        description: "Failed to add treatment plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Treatment Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select
              value={formData.patient_id}
              onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
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

          <div>
            <Label htmlFor="doctor">Doctor</Label>
            <Select
              value={formData.doctor_id}
              onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="treatment_name">Treatment Name</Label>
            <Input
              id="treatment_name"
              value={formData.treatment_name}
              onChange={(e) => setFormData({ ...formData, treatment_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 2 weeks, 3 months"
              required
            />
          </div>

          <div>
            <Label htmlFor="total_cost">Total Cost</Label>
            <Input
              id="total_cost"
              type="number"
              step="0.01"
              value={formData.total_cost}
              onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? format(formData.start_date, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => setFormData({ ...formData, start_date: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? format(formData.end_date, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.end_date}
                  onSelect={(date) => setFormData({ ...formData, end_date: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Treatment Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}