import { useState, useEffect } from 'react';
import { UserCheck, Mail, Phone, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  created_at: string;
}

const Doctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the UI since we don't have doctors table yet
  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Ahmad Al-Rashid',
      specialty: 'General Dentist',
      email: 'ahmad.rashid@wahdat.com',
      phone: '+971-50-123-4567',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Dr. Fatima Hassan',
      specialty: 'Orthodontist',
      email: 'fatima.hassan@wahdat.com',
      phone: '+971-50-234-5678',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Dr. Omar Khalil',
      specialty: 'Oral Surgeon',
      email: 'omar.khalil@wahdat.com',
      phone: '+971-50-345-6789',
      status: 'busy',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Use mock data for now
    setDoctors(mockDoctors);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { class: 'bg-green-100 text-green-800', text: 'Available' },
      busy: { class: 'bg-yellow-100 text-yellow-800', text: 'With Patient' },
      offline: { class: 'bg-gray-100 text-gray-800', text: 'Offline' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.class}>
        {config.text}
      </Badge>
    );
  };

  const getDoctorInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
          <p className="text-muted-foreground">Manage and track medical staff</p>
        </div>
        <Button variant="medical" className="bg-wahdat-green hover:bg-wahdat-green-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {/* Medical Staff Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-wahdat-green" />
            <span>Medical Staff</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">DOCTOR</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">SPECIALTY</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">CONTACT</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">STATUS</th>
                  <th className="text-left py-4 px-2 font-medium text-muted-foreground text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-wahdat-green-light rounded-full flex items-center justify-center text-wahdat-green font-medium text-sm">
                          {getDoctorInitials(doctor.name)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {doctor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-foreground">{doctor.specialty}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-foreground">{doctor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-foreground">{doctor.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      {getStatusBadge(doctor.status)}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-wahdat-green hover:text-wahdat-green-dark hover:bg-wahdat-green-light">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default Doctors;