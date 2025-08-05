import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddPatientForm } from '@/components/forms/AddPatientForm';
import { AddTreatmentPlanForm } from '@/components/forms/AddTreatmentPlanForm';
import { ViewPatientDialog } from '@/components/dialogs/ViewPatientDialog';
import { EditPatientForm } from '@/components/forms/EditPatientForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  treatment_name?: string;
  price?: number;
  appointment_date?: string;
  appointment_time?: string;
  created_at: string;
  doctor_id?: string;
  doctors?: { name: string; specialty: string };
  treatment_plans?: Array<{
    id: string;
    treatment_name: string;
    status: string;
    total_cost: number;
  }>;
  appointments?: Array<{
    id: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    treatment_name: string;
  }>;
}

const Patients = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showViewPatient, setShowViewPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string>('');

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          doctors:doctor_id (name, specialty),
          treatment_plans (id, treatment_name, status, total_cost),
          appointments (id, preferred_date, preferred_time, status, treatment_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeletePatient = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      fetchPatients();
      setShowDeleteConfirm(false);
      setPatientToDelete('');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error", 
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  const confirmDeletePatient = (id: string) => {
    setPatientToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleAddTreatmentPlan = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowAddTreatment(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowViewPatient(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditPatient(true);
  };

  const getPatientInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = filterMonth === 'all' || 
      new Date(patient.created_at).getMonth() === parseInt(filterMonth);
    
    return matchesSearch && matchesMonth;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">Manage and track all patient records</p>
        </div>
        <Button 
          variant="medical" 
          className="bg-wahdat-green hover:bg-wahdat-green-dark"
          onClick={() => setShowAddPatient(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="0">January</SelectItem>
                <SelectItem value="1">February</SelectItem>
                <SelectItem value="2">March</SelectItem>
                <SelectItem value="3">April</SelectItem>
                <SelectItem value="4">May</SelectItem>
                <SelectItem value="5">June</SelectItem>
                <SelectItem value="6">July</SelectItem>
                <SelectItem value="7">August</SelectItem>
                <SelectItem value="8">September</SelectItem>
                <SelectItem value="9">October</SelectItem>
                <SelectItem value="10">November</SelectItem>
                <SelectItem value="11">December</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Patients Table */}
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">PATIENT</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">CONTACT</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">ASSIGNED DOCTOR</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">TREATMENT PLANS</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">APPOINTMENTS</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-wahdat-green-light rounded-full flex items-center justify-center text-wahdat-green font-medium text-sm">
                          {getPatientInitials(patient.name)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {patient.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="space-y-1">
                        <p className="text-foreground">{patient.email}</p>
                        <p className="text-sm text-muted-foreground">{patient.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-foreground">
                        {patient.doctors ? 
                          `${patient.doctors.name} (${patient.doctors.specialty})` : 
                          "Not assigned"
                        }
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      {patient.treatment_plans && patient.treatment_plans.length > 0 ? (
                        <div className="space-y-1">
                          {patient.treatment_plans.slice(0, 2).map((plan) => (
                            <div key={plan.id} className="text-sm">
                              <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                                {plan.treatment_name} - ${plan.total_cost}
                              </Badge>
                            </div>
                          ))}
                          {patient.treatment_plans.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{patient.treatment_plans.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No treatment plans</span>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      {patient.appointments && patient.appointments.length > 0 ? (
                        <div className="space-y-1">
                          {patient.appointments.slice(0, 2).map((appointment) => (
                            <div key={appointment.id} className="text-sm">
                              <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                                {appointment.preferred_date} - {appointment.status}
                              </Badge>
                            </div>
                          ))}
                          {patient.appointments.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{patient.appointments.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No appointments</span>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewPatient(patient)}
                          className="text-wahdat-green hover:text-wahdat-green-dark hover:bg-wahdat-green-light"
                          title="View Patient Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddTreatmentPlan(patient.id)}
                          className="text-wahdat-green hover:text-wahdat-green-dark hover:bg-wahdat-green-light"
                          title="Add Treatment Plan"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditPatient(patient)}
                          className="text-wahdat-green hover:text-wahdat-green-dark hover:bg-wahdat-green-light"
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => confirmDeletePatient(patient.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No patients found matching your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddPatientForm 
        open={showAddPatient}
        onOpenChange={setShowAddPatient}
        onPatientAdded={fetchPatients}
      />

      <AddTreatmentPlanForm
        open={showAddTreatment}
        onOpenChange={setShowAddTreatment}
        onTreatmentPlanAdded={fetchPatients}
        selectedPatientId={selectedPatientId}
      />

      <ViewPatientDialog
        open={showViewPatient}
        onOpenChange={setShowViewPatient}
        patient={selectedPatient}
      />

      <EditPatientForm
        open={showEditPatient}
        onOpenChange={setShowEditPatient}
        patient={selectedPatient}
        onPatientUpdated={fetchPatients}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? This action cannot be undone and will remove all associated records."
        confirmText="Delete"
        onConfirm={handleDeletePatient}
        variant="destructive"
      />
    </div>
  );
};

export default Patients;