import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
}

interface NewPatient {
  name: string;
  age: string;
  phone: string;
  email: string;
  treatment_name: string;
  price: string;
  appointment_date: string;
  appointment_time: string;
}

const Patients = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPatient, setNewPatient] = useState<NewPatient>({
    name: '',
    age: '',
    phone: '',
    email: '',
    treatment_name: '',
    price: '',
    appointment_date: '',
    appointment_time: ''
  });

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
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

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('patients')
        .insert([{
          name: newPatient.name,
          age: parseInt(newPatient.age),
          phone: newPatient.phone,
          email: newPatient.email,
          treatment_name: newPatient.treatment_name,
          price: parseFloat(newPatient.price) || null,
          appointment_date: newPatient.appointment_date || null,
          appointment_time: newPatient.appointment_time || null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient added successfully",
      });
      
      setNewPatient({
        name: '',
        age: '',
        phone: '',
        email: '',
        treatment_name: '',
        price: '',
        appointment_date: '',
        appointment_time: ''
      });
      setShowAddForm(false);
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      });
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and information</p>
        </div>
        <Button variant="medical" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Records ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Patient</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Treatment</th>
                  <th className="text-left p-4 font-medium">Appointment</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Added</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2" />
                          {patient.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{patient.treatment_name || '-'}</td>
                    <td className="p-4 text-sm">
                      {patient.appointment_date ? (
                        <div>
                          <p>{patient.appointment_date}</p>
                          <p className="text-muted-foreground">{patient.appointment_time}</p>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {patient.price ? `$${patient.price}` : '-'}
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No patients found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Patient Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Patient Name *</Label>
                    <Input
                      id="name"
                      placeholder="Patient Name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      placeholder="Age"
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Phone Number"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      placeholder="Email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="treatment">Treatment Name</Label>
                    <Input
                      id="treatment"
                      placeholder="Treatment Name"
                      value={newPatient.treatment_name}
                      onChange={(e) => setNewPatient({...newPatient, treatment_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      value={newPatient.price}
                      onChange={(e) => setNewPatient({...newPatient, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointment_date">Appointment Date</Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      value={newPatient.appointment_date}
                      onChange={(e) => setNewPatient({...newPatient, appointment_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointment_time">Appointment Time</Label>
                    <Input
                      id="appointment_time"
                      type="time"
                      value={newPatient.appointment_time}
                      onChange={(e) => setNewPatient({...newPatient, appointment_time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" variant="medical" className="flex-1">
                    Save Patient
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Patients;