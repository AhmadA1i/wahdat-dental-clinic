import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const Patients = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data that matches the design from the image
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      phone: '+971-55-111-2233',
      age: 32,
      created_at: '2025-07-21T00:00:00Z',
      treatment_name: 'General Checkup',
      price: 150,
      appointment_date: '1990-05-15',
      appointment_time: '10:00'
    },
    {
      id: '2', 
      name: 'Mohammed Ali',
      email: 'mohammed.ali@email.com',
      phone: '+971-55-222-3344',
      age: 28,
      created_at: '2025-07-21T00:00:00Z',
      treatment_name: 'Cleaning',
      price: 200,
      appointment_date: '1985-12-20',
      appointment_time: '14:00'
    },
    {
      id: '3',
      name: 'Aisha Abdullah', 
      email: 'aisha.abdullah@email.com',
      phone: '+971-55-333-4455',
      age: 35,
      created_at: '2025-07-21T00:00:00Z',
      treatment_name: 'Root Canal',
      price: 500,
      appointment_date: '1995-08-10',
      appointment_time: '16:30'
    }
  ];

  const fetchPatients = async () => {
    try {
      // Use mock data for now since we're focused on UI matching
      setPatients(mockPatients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeletePatient = async (id: string) => {
    try {
      setPatients(prev => prev.filter(patient => patient.id !== id));
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  const getPatientInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

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
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">Manage and track all patient records</p>
        </div>
        <Button variant="medical" className="bg-wahdat-green hover:bg-wahdat-green-dark">
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
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
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
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">DATE OF BIRTH</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">BALANCE</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">CREATED</th>
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
                          <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
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
                      <span className="text-foreground">{patient.appointment_date}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-foreground">$0.00</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-foreground">
                        {new Date(patient.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-wahdat-green hover:text-wahdat-green-dark hover:bg-wahdat-green-light">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
    </div>
  );
};

export default Patients;