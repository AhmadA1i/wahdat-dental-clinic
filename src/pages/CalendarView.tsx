import { useState } from 'react';
import Calendar from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, CalendarDays } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface CalendarAppointment {
  id: number;
  patientName: string;
  service: string;
  time: string;
  doctor: string;
  status: 'confirmed' | 'pending' | 'completed';
}

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  
  // Sample appointments data
  const appointments: { [key: string]: CalendarAppointment[] } = {
    '2024-01-20': [
      { id: 1, patientName: 'Sarah Johnson', service: 'Cleaning', time: '10:00 AM', doctor: 'Dr. Johnson', status: 'confirmed' },
      { id: 2, patientName: 'Michael Brown', service: 'Root Canal', time: '2:30 PM', doctor: 'Dr. Smith', status: 'pending' },
      { id: 3, patientName: 'Emma Davis', service: 'Checkup', time: '4:00 PM', doctor: 'Dr. Johnson', status: 'confirmed' }
    ],
    '2024-01-21': [
      { id: 4, patientName: 'James Wilson', service: 'Filling', time: '9:00 AM', doctor: 'Dr. Brown', status: 'confirmed' },
      { id: 5, patientName: 'Lisa Taylor', service: 'Whitening', time: '11:30 AM', doctor: 'Dr. Johnson', status: 'pending' }
    ],
    '2024-01-22': [
      { id: 6, patientName: 'Robert Davis', service: 'Surgery', time: '1:00 PM', doctor: 'Dr. Smith', status: 'confirmed' }
    ]
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateKey = formatDate(date);
  const dayAppointments = appointments[selectedDateKey] || [];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = formatDate(date);
      const dayAppts = appointments[dateKey];
      if (dayAppts && dayAppts.length > 0) {
        return (
          <div className="flex justify-center">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">View and manage appointments in calendar format</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5" />
                <span>Appointment Calendar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="calendar-container">
                <Calendar
                  onChange={(value) => setDate(value as Date)}
                  value={date}
                  tileContent={tileContent}
                  className="mx-auto border-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Day Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{date.toDateString()}</span>
                <Badge variant="secondary">{dayAppointments.length} appointments</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {dayAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{appointment.patientName}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {appointment.doctor}
                      </div>
                    </div>
                  ))}
                  <Button variant="medical" className="w-full">
                    Add Appointment
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No appointments scheduled</p>
                  <Button variant="medical">Schedule Appointment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">24</h3>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-medical-success">18</h3>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-medical-warning">4</h3>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-destructive">2</h3>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;