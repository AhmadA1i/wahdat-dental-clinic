import { FileText, Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Records = () => {
  const records = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      patientId: "P001",
      recordType: "Treatment Plan",
      date: "2024-01-15",
      doctor: "Dr. Emily Johnson",
      status: "completed",
      fileSize: "2.4 MB"
    },
    {
      id: 2,
      patientName: "Michael Brown",
      patientId: "P002",
      recordType: "X-Ray Report",
      date: "2024-01-12",
      doctor: "Dr. Michael Smith",
      status: "pending",
      fileSize: "5.1 MB"
    },
    {
      id: 3,
      patientName: "Emma Davis",
      patientId: "P003",
      recordType: "Consultation Notes",
      date: "2024-01-10",
      doctor: "Dr. Sarah Brown",
      status: "completed",
      fileSize: "1.2 MB"
    },
    {
      id: 4,
      patientName: "James Wilson",
      patientId: "P004",
      recordType: "Surgery Report",
      date: "2024-01-08",
      doctor: "Dr. Michael Smith",
      status: "review",
      fileSize: "3.8 MB"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'warning',
      review: 'info'
    };
    return <Badge className={
      status === 'completed' ? 'bg-green-100 text-green-800' :
      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
      'bg-blue-100 text-blue-800'
    }>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Records</h1>
        <p className="text-muted-foreground">Access and manage patient medical records and documents</p>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records by patient name, ID, or record type..."
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Filter</Button>
              <Button variant="medical">
                <FileText className="h-4 w-4 mr-2" />
                New Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Records ({records.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Patient</th>
                  <th className="text-left p-4 font-medium">Record Type</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Doctor</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">File Size</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{record.patientName}</p>
                        <p className="text-sm text-muted-foreground">ID: {record.patientId}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        {record.recordType}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{record.date}</td>
                    <td className="p-4 text-sm">{record.doctor}</td>
                    <td className="p-4">{getStatusBadge(record.status)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{record.fileSize}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {records.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{record.recordType}</p>
                      <p className="text-xs text-muted-foreground">{record.patientName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Records</span>
                <span className="font-bold">{records.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <span className="font-bold text-medical-success">
                  {records.filter(r => r.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Review</span>
                <span className="font-bold text-medical-warning">
                  {records.filter(r => r.status === 'pending' || r.status === 'review').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Storage</span>
                <span className="font-bold">12.5 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Records;