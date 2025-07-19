import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'active' | 'inactive' | 'pending';
  treatments: string[];
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const patients: Patient[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 28,
      phone: "+1-555-0123",
      email: "sarah.j@email.com",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-02-15",
      status: "active",
      treatments: ["Cleaning", "Filling"]
    },
    {
      id: 2,
      name: "Michael Brown",
      age: 45,
      phone: "+1-555-0456",
      email: "m.brown@email.com",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-01-25",
      status: "active",
      treatments: ["Root Canal", "Crown"]
    },
    {
      id: 3,
      name: "Emma Davis",
      age: 35,
      phone: "+1-555-0789",
      email: "emma.davis@email.com",
      lastVisit: "2023-12-20",
      nextAppointment: "2024-01-30",
      status: "pending",
      treatments: ["Checkup", "Whitening"]
    },
    {
      id: 4,
      name: "James Wilson",
      age: 52,
      phone: "+1-555-0321",
      email: "j.wilson@email.com",
      lastVisit: "2023-11-30",
      nextAppointment: "-",
      status: "inactive",
      treatments: ["Implant", "Surgery"]
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.id.toString().includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'warning'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

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
                placeholder="Search by name, phone, or ID..."
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
                  <th className="text-left p-4 font-medium">Last Visit</th>
                  <th className="text-left p-4 font-medium">Next Appointment</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Treatments</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {patient.id} • Age: {patient.age}</p>
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
                    <td className="p-4 text-sm">{patient.lastVisit}</td>
                    <td className="p-4 text-sm">{patient.nextAppointment}</td>
                    <td className="p-4">{getStatusBadge(patient.status)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.treatments.map((treatment, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {treatment}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Patient Form Modal - Simplified for now */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Patient Name" />
              <Input placeholder="Age" type="number" />
              <Input placeholder="Phone Number" />
              <Input placeholder="Email" type="email" />
              <div className="flex space-x-2">
                <Button variant="medical" className="flex-1">Save Patient</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Patients;