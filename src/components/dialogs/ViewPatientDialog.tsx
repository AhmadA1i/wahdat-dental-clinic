import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  created_at: string;
  doctors?: { name: string; specialty: string };
  treatment_plans?: Array<{
    id: string;
    treatment_name: string;
    status: string;
    total_cost: number;
    start_date?: string;
    end_date?: string;
  }>;
  appointments?: Array<{
    id: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    treatment_name: string;
  }>;
}

interface ViewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

export const ViewPatientDialog = ({ open, onOpenChange, patient }: ViewPatientDialogProps) => {
  if (!patient) return null;

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Patient Details - {patient.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-foreground">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="text-foreground">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="flex items-center text-foreground">
                  <Phone className="h-3 w-3 mr-1" />
                  {patient.phone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="flex items-center text-foreground">
                  <Mail className="h-3 w-3 mr-1" />
                  {patient.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Doctor</p>
                <p className="text-foreground">
                  {patient.doctors ? `${patient.doctors.name} (${patient.doctors.specialty})` : 'Not assigned'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="flex items-center text-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(patient.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Treatment Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.treatment_plans && patient.treatment_plans.length > 0 ? (
                <div className="space-y-3">
                  {patient.treatment_plans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{plan.treatment_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {plan.start_date && plan.end_date ? 
                              `${new Date(plan.start_date).toLocaleDateString()} - ${new Date(plan.end_date).toLocaleDateString()}` :
                              'Dates not set'
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(plan.status)}
                          <p className="text-sm font-medium flex items-center mt-1">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${plan.total_cost}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No treatment plans assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.appointments && patient.appointments.length > 0 ? (
                <div className="space-y-3">
                  {patient.appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{appointment.treatment_name || 'General Consultation'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.preferred_date).toLocaleDateString()} at {appointment.preferred_time}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No appointments scheduled</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};