import { useState } from 'react';
import { Calendar, Clock, Filter, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Appointment {
  id: number;
  patientName: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  price: number;
}

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('all');

  const appointments: Appointment[] = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      service: "Teeth Cleaning",
      doctor: "Dr. Emily Johnson",
      date: "2024-01-20",
      time: "10:00 AM",
      duration: "45 min",
      status: "upcoming",
      price: 120
    },
    {
      id: 2,
      patientName: "Michael Brown",
      service: "Root Canal",
      doctor: "Dr. Michael Smith",
      date: "2024-01-20",
      time: "2:30 PM",
      duration: "90 min",
      status: "pending",
      price: 800
    },
    {
      id: 3,
      patientName: "Emma Davis",
      service: "Dental Checkup",
      doctor: "Dr. Emily Johnson",
      date: "2024-01-18",
      time: "9:15 AM",
      duration: "30 min",
      status: "completed",
      price: 75
    },
    {
      id: 4,
      patientName: "James Wilson",
      service: "Tooth Extraction",
      doctor: "Dr. Michael Smith",
      date: "2024-01-19",
      time: "11:00 AM",
      duration: "60 min",
      status: "cancelled",
      price: 200
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: 'default',
      completed: 'default',
      cancelled: 'destructive',
      pending: 'warning'
    };
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  const filterAppointments = (status: string) => {
    if (status === 'all') return appointments;
    return appointments.filter(apt => apt.status === status);
  };

  const getTabCount = (status: string) => {
    return filterAppointments(status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage and track all patient appointments</p>
        </div>
        <Button variant="medical">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New
        </Button>
      </div>

      {/* Filters and Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All ({getTabCount('all')})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({getTabCount('upcoming')})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({getTabCount('completed')})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({getTabCount('cancelled')})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({getTabCount('pending')})</TabsTrigger>
          </TabsList>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Appointments' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Appointments`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filterAppointments(activeTab).map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-6 hover:shadow-medium transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground">Service</p>
                            <p>{appointment.service}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Doctor</p>
                            <p>{appointment.doctor}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Date & Time</p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {appointment.date}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Duration & Price</p>
                            <p>{appointment.duration}</p>
                            <p className="font-semibold text-foreground">${appointment.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {appointment.status === 'pending' && (
                          <>
                            <Button variant="success" size="sm">
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filterAppointments(activeTab).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No {activeTab === 'all' ? '' : activeTab + ' '}appointments found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;