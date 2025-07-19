import { Users, Calendar, UserCheck, Clock, Eye, Check, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/ui/StatsCard';

const Dashboard = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Users,
      description: "Active patient records"
    },
    {
      title: "Today's Appointments",
      value: "28",
      change: "3 pending confirmations",
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
  ];

  const pendingAppointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      service: "Teeth Cleaning",
      date: "2024-01-20",
      time: "10:00 AM",
      phone: "+1-555-0123"
    },
    {
      id: 2,
      patientName: "Michael Brown",
      service: "Root Canal",
      date: "2024-01-20",
      time: "2:30 PM",
      phone: "+1-555-0456"
    },
    {
      id: 3,
      patientName: "Emma Davis",
      service: "Dental Checkup",
      date: "2024-01-21",
      time: "9:15 AM",
      phone: "+1-555-0789"
    }
  ];

  const contactMessages = [
    {
      id: 1,
      name: "Jennifer Wilson",
      email: "jennifer@email.com",
      phone: "+1-555-0321",
      date: "2024-01-19",
      status: "unread",
      message: "Inquiry about dental implants procedure"
    },
    {
      id: 2,
      name: "Robert Taylor",
      email: "robert@email.com",
      phone: "+1-555-0654",
      date: "2024-01-19",
      status: "read",
      message: "Requesting appointment for emergency care"
    }
  ];

  const dentalTeam = [
    { name: "Dr. Emily Johnson", role: "Chief Dentist", specialty: "Orthodontics", status: "Available" },
    { name: "Dr. Michael Smith", role: "Oral Surgeon", specialty: "Surgery", status: "In Surgery" },
    { name: "Dr. Sarah Brown", role: "Periodontist", specialty: "Gum Disease", status: "Available" },
    { name: "Lisa Davis", role: "Dental Hygienist", specialty: "Cleaning", status: "With Patient" }
  ];

  const todayAppointments = [
    { time: "9:00 AM", patient: "John Doe", service: "Checkup", doctor: "Dr. Johnson" },
    { time: "10:30 AM", patient: "Jane Smith", service: "Filling", doctor: "Dr. Smith" },
    { time: "2:00 PM", patient: "Mike Wilson", service: "Cleaning", doctor: "Lisa Davis" },
    { time: "3:30 PM", patient: "Anna Johnson", service: "Crown", doctor: "Dr. Brown" }
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
              {pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.patientName}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {appointment.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="success" size="sm">
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
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
              {contactMessages.map((message) => (
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
                      <p className="text-xs text-muted-foreground">{message.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Mark Read</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
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
              {todayAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.patient}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.service}</p>
                    <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;