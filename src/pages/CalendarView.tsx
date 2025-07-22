import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, CalendarDays, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddAppointmentForm } from '@/components/forms/AddAppointmentForm';
import 'react-calendar/dist/Calendar.css';

interface CalendarAppointment {
  id: string;
  patient_name: string;
  treatment_name: string;
  preferred_time: string;
  status: string;
  preferred_date: string;
  doctors?: { name: string; specialty: string };
}

const CalendarView = () => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<{ [key: string]: CalendarAppointment[] }>({});
  const [loading, setLoading] = useState(true);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [stats, setStats] = useState({
    thisWeek: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0
  });

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors:doctor_id (name, specialty)
        `)
        .order('preferred_time');

      if (error) throw error;

      // Group appointments by date
      const groupedAppointments: { [key: string]: CalendarAppointment[] } = {};
      let thisWeekCount = 0;
      let confirmedCount = 0;
      let pendingCount = 0;
      let cancelledCount = 0;

      const today = new Date();
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisWeekEnd = new Date(thisWeekStart);
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

      data?.forEach((appointment) => {
        const dateKey = appointment.preferred_date;
        if (!groupedAppointments[dateKey]) {
          groupedAppointments[dateKey] = [];
        }
        groupedAppointments[dateKey].push(appointment);

        // Calculate stats
        const appointmentDate = new Date(appointment.preferred_date);
        if (appointmentDate >= thisWeekStart && appointmentDate <= thisWeekEnd) {
          thisWeekCount++;
        }

        switch (appointment.status) {
          case 'confirmed':
          case 'completed':
            confirmedCount++;
            break;
          case 'pending':
            pendingCount++;
            break;
          case 'cancelled':
            cancelledCount++;
            break;
        }
      });

      setAppointments(groupedAppointments);
      setStats({
        thisWeek: thisWeekCount,
        confirmed: confirmedCount,
        pending: pendingCount,
        cancelled: cancelledCount
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateKey = formatDate(date);
  const dayAppointments = appointments[selectedDateKey] || [];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = formatDate(date);
      const dayAppts = appointments[dateKey];
      if (dayAppts && dayAppts.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="flex space-x-1">
              {dayAppts.slice(0, 3).map((_, index) => (
                <div key={index} className="h-1.5 w-1.5 bg-wahdat-green rounded-full"></div>
              ))}
              {dayAppts.length > 3 && (
                <div className="h-1.5 w-1.5 bg-wahdat-green-dark rounded-full"></div>
              )}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">View and manage appointments in calendar format</p>
        </div>
        <Button 
          variant="medical"
          onClick={() => setShowAddAppointment(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
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
                  className="mx-auto border-none w-full"
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
                          <h4 className="font-medium">{appointment.patient_name}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.treatment_name}</p>
                          {appointment.doctors && (
                            <p className="text-xs text-muted-foreground">
                              Dr. {appointment.doctors.name}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.preferred_time}
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="medical" 
                    className="w-full"
                    onClick={() => setShowAddAppointment(true)}
                  >
                    Add Appointment
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No appointments scheduled</p>
                  <Button 
                    variant="medical"
                    onClick={() => setShowAddAppointment(true)}
                  >
                    Schedule Appointment
                  </Button>
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
            <h3 className="text-2xl font-bold text-primary">{stats.thisWeek}</h3>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-wahdat-green">{stats.confirmed}</h3>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-destructive">{stats.cancelled}</h3>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      <AddAppointmentForm 
        open={showAddAppointment}
        onOpenChange={setShowAddAppointment}
        onAppointmentAdded={fetchAppointments}
      />
    </div>
  );
};

export default CalendarView;