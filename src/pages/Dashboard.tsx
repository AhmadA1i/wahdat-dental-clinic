import { Users, Calendar, UserCheck, Clock, Eye, Check, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/ui/StatsCard';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState([
    {
      title: "Total Patients",
      value: "0",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Users,
      description: "Active patient records"
    },
    {
      title: "Today's Appointments",
      value: "0",
      change: "0 pending confirmations",
      changeType: "neutral" as const,
      icon: Calendar,
      description: "Scheduled for today"
    },
    {
      title: "Active Doctors",
      value: "8",
      change: "All available",
      changeType: "positive" as const,
      icon: UserCheck,
      description: "On duty today"
    }
  ]);
  const [todayAppointments, setTodayAppointments] = useState([]);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingAppointments(appointmentsData || []);

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setMessages(messagesData || []);

      // Fetch patients count
      const { count: patientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's appointments count
      const { count: todayCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('preferred_date', today);

      // Fetch approved appointments for today
      const { data: approvedTodayData } = await supabase
        .from('appointments')
        .select('*')
        .eq('preferred_date', today)
        .eq('status', 'approved')
        .order('preferred_time');

      setTodayAppointments(approvedTodayData || []);

      // Update stats
      setStats([
        {
          title: "Total Patients",
          value: (patientsCount || 0).toString(),
          change: "+12% from last month",
          changeType: "positive" as const,
          icon: Users,
          description: "Active patient records"
        },
        {
          title: "Today's Appointments",
          value: (todayCount || 0).toString(),
          change: `${(appointmentsData || []).length} pending confirmations`,
          changeType: "neutral" as const,
          icon: Calendar,
          description: "Scheduled for today"
        },
        {
          title: "Active Doctors",
          value: "8",
          change: "All available",
          changeType: "positive" as const,
          icon: UserCheck,
          description: "On duty today"
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      setPendingAppointments(prev => prev.filter((apt: any) => apt.id !== id));
      toast({
        title: "Success",
        description: "Appointment approved successfully",
      });
      fetchDashboardData();
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

      setPendingAppointments(prev => prev.filter((apt: any) => apt.id !== id));
      toast({
        title: "Success",
        description: "Appointment rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject appointment",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;

      setMessages(prev =>
        prev.map((msg: any) =>
          msg.id === id
            ? { ...msg, status: 'read' }
            : msg
        )
      );
      toast({
        title: "Success",
        description: "Message marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.filter((msg: any) => msg.id !== id));
      toast({
        title: "Success",
        description: "Message deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const dentalTeam = [
    { name: "Dr. Emily Johnson", role: "Chief Dentist", specialty: "Orthodontics", status: "Available" },
    { name: "Dr. Michael Smith", role: "Oral Surgeon", specialty: "Surgery", status: "In Surgery" },
    { name: "Dr. Sarah Brown", role: "Periodontist", specialty: "Gum Disease", status: "Available" },
    { name: "Lisa Davis", role: "Dental Hygienist", specialty: "Cleaning", status: "With Patient" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your clinic today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointment Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Pending Appointment Requests</span>
              <Badge variant="secondary" className="ml-auto">
                {pendingAppointments.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{appointment.patient_name}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.treatment_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.preferred_date} at {appointment.preferred_time}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {appointment.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="success" size="sm" onClick={() => handleApprove(appointment.id)}>
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(appointment.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No pending appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contact Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Recent Contact Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message: any) => (
                  <div key={message.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{message.name}</h4>
                          <Badge variant={message.status === 'unread' ? 'destructive' : 'secondary'}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                        <p className="text-sm text-muted-foreground">{message.phone}</p>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={message.status === 'read'}
                      >
                        Mark Read
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(message.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No messages</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dental Team */}
        <Card>
          <CardHeader>
            <CardTitle>Dental Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dentalTeam.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role} • {member.specialty}</p>
                  </div>
                  <Badge variant={member.status === 'Available' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.preferred_time}</p>
                      <p className="text-sm text-muted-foreground">{appointment.patient_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{appointment.treatment_name}</p>
                      <p className="text-sm text-muted-foreground">Status: {appointment.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No appointments scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;