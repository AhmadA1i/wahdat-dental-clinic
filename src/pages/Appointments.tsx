import { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Appointment {
  id: string;
  patient_name: string;
  treatment_name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

const Appointments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
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

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment approved successfully",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve appointment",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment rejected",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'default',
      pending: 'warning',
      rejected: 'destructive',
      completed: 'default',
      cancelled: 'destructive',
      upcoming: 'default'
    };
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
      upcoming: 'bg-blue-100 text-blue-800'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

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
            <TabsTrigger value="pending">Pending ({getTabCount('pending')})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({getTabCount('approved')})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({getTabCount('completed')})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({getTabCount('cancelled')})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({getTabCount('rejected')})</TabsTrigger>
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
                          <h3 className="text-lg font-semibold">{appointment.patient_name}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground">Service</p>
                            <p>{appointment.treatment_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Phone</p>
                            <p>{appointment.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Date & Time</p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {appointment.preferred_date}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.preferred_time}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Created</p>
                            <p>{new Date(appointment.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div>
                            <p className="font-medium text-foreground text-sm">Notes</p>
                            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {appointment.status === 'pending' && (
                          <>
                            <Button variant="success" size="sm" onClick={() => handleApprove(appointment.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(appointment.id)}>
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