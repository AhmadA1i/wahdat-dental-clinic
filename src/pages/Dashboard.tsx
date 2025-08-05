import { Users, Calendar, UserCheck, Clock, Eye, Check, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/ui/StatsCard';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    { name: "Dr. Ahmad Al-Rashid", role: "General Dentist", specialty: "General Dentist", status: "Available", initials: "AA" },
    { name: "Dr. Fatima Hassan", role: "Orthodontist", specialty: "Orthodontist", status: "Available", initials: "FH" },
    { name: "Dr. Omar Khalil", role: "Oral Surgeon", specialty: "Oral Surgeon", status: "With Patient", initials: "OK" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your clinic today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-foreground">{stats[0].value}</p>
                <p className="text-sm text-wahdat-green flex items-center mt-1">
                  <span className="mr-1">↗</span>
                  12% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-wahdat-green-light rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-wahdat-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Today's Appointments</p>
                <p className="text-3xl font-bold text-foreground">{stats[1].value}</p>
                <p className="text-sm text-wahdat-green">Next: 2:30 PM</p>
              </div>
              <div className="h-12 w-12 bg-wahdat-green-light rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-wahdat-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Doctors</p>
                <p className="text-3xl font-bold text-foreground">2</p>
                <p className="text-sm text-wahdat-green">All available today</p>
              </div>
              <div className="h-12 w-12 bg-wahdat-green-light rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-wahdat-green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointment Requests */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Pending Appointment Requests</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-wahdat-green hover:text-wahdat-green-dark"
                onClick={() => window.location.href = '/appointments'}
              >
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="px-6 py-3 bg-muted/30 border-b border-border">
                <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <div>PATIENT</div>
                  <div>PREFERRED DATE</div>
                  <div>SERVICE</div>
                  <div>ACTIONS</div>
                </div>
              </div>
              <div className="p-6">
                {pendingAppointments.length > 0 ? (
                  pendingAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="grid grid-cols-4 gap-4 items-center py-4 border-b border-border/50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-wahdat-green-light rounded-full flex items-center justify-center text-wahdat-green font-medium text-sm">
                          KH
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{appointment.patient_name}</p>
                          <p className="text-sm text-muted-foreground">{appointment.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-foreground">{appointment.preferred_date}</p>
                      </div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {appointment.treatment_name || 'Cleaning'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleApprove(appointment.id)} className="text-green-600 hover:text-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReject(appointment.id)} className="text-red-600 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No contact messages found</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contact Messages */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Contact Messages</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-wahdat-green hover:text-wahdat-green-dark"
                onClick={() => window.location.href = '/'}
              >
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="px-6 py-3 bg-muted/30 border-b border-border">
                <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <div>NAME</div>
                  <div>CONTACT</div>
                  <div>DATE</div>
                  <div>STATUS</div>
                  <div>ACTIONS</div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-center text-muted-foreground py-8">No contact messages found</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dental Team */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Dental Team</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-wahdat-green hover:text-wahdat-green-dark"
                onClick={() => window.location.href = '/doctors'}
              >
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dentalTeam.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-wahdat-green-light rounded-full flex items-center justify-center text-wahdat-green font-medium text-sm">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.specialty}</p>
                    </div>
                  </div>
                  <Badge className={
                    member.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-wahdat-green hover:text-wahdat-green-dark"
                onClick={() => window.location.href = '/calendar'}
              >
                View Calendar →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{appointment.preferred_time}</p>
                      <p className="text-sm text-muted-foreground">{appointment.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.treatment_name}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {appointment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No appointments today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;