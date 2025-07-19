import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, CalendarDays } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import 'react-calendar/dist/Calendar.css';

interface CalendarAppointment {
  id: string;
  patient_name: string;
  treatment_name: string;
  preferred_time: string;
  status: string;
  preferred_date: string;
}

const CalendarView = () => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<{ [key: string]: CalendarAppointment[] }>({});
  const [loading, setLoading] = useState(true);
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
        .select('*')
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
          case 'approved':
          case 'completed':
            confirmedCount++;
            break;
          case 'pending':
            pendingCount++;
            break;
          case 'cancelled':
          case 'rejected':
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
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
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
                          <h4 className="font-medium">{appointment.patient_name}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.treatment_name}</p>
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
            <h3 className="text-2xl font-bold text-primary">{stats.thisWeek}</h3>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-medical-success">{stats.confirmed}</h3>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-medical-warning">{stats.pending}</h3>
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
    </div>
  );
};

export default CalendarView;