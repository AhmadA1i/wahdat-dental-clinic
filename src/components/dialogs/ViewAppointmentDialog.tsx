import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, FileText, Stethoscope } from "lucide-react";

interface Appointment {
  id: string;
  patient_name: string;
  treatment_name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes?: string;
  created_at: string;
  doctor_id?: string;
  doctors?: { name: string; specialty: string };
}

interface ViewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export const ViewAppointmentDialog = ({ open, onOpenChange, appointment }: ViewAppointmentDialogProps) => {
  if (!appointment) return null;

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Appointment Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Status</h3>
            {getStatusBadge(appointment.status)}
          </div>

          {/* Patient Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Patient Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-foreground">{appointment.patient_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-foreground flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {appointment.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {appointment.preferred_date}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p className="text-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {appointment.preferred_time}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Treatment</p>
                <p className="text-foreground">{appointment.treatment_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                <p className="text-foreground flex items-center">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  {appointment.doctors ? 
                    `${appointment.doctors.name} (${appointment.doctors.specialty})` : 
                    'Not assigned'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-foreground">{appointment.notes}</p>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointment ID</p>
                  <p className="text-foreground text-sm font-mono">{appointment.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-foreground">{new Date(appointment.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};