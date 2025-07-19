import { ClipboardList, Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Treatments = () => {
  const treatmentPlans = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      planName: "Complete Dental Restoration",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      progress: 65,
      status: "in-progress",
      totalCost: 2500,
      paidAmount: 1500,
      treatments: [
        { name: "Initial Consultation", status: "completed", cost: 150 },
        { name: "Teeth Cleaning", status: "completed", cost: 120 },
        { name: "Filling (3 teeth)", status: "completed", cost: 450 },
        { name: "Crown Installation", status: "in-progress", cost: 800 },
        { name: "Final Checkup", status: "scheduled", cost: 100 }
      ]
    },
    {
      id: 2,
      patientName: "Michael Brown",
      planName: "Root Canal Treatment",
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      progress: 80,
      status: "in-progress",
      totalCost: 1200,
      paidAmount: 800,
      treatments: [
        { name: "X-Ray & Diagnosis", status: "completed", cost: 100 },
        { name: "Root Canal Procedure", status: "completed", cost: 600 },
        { name: "Temporary Crown", status: "completed", cost: 200 },
        { name: "Permanent Crown", status: "scheduled", cost: 300 }
      ]
    },
    {
      id: 3,
      patientName: "Emma Davis",
      planName: "Orthodontic Treatment",
      startDate: "2024-01-05",
      endDate: "2025-01-05",
      progress: 25,
      status: "in-progress",
      totalCost: 4500,
      paidAmount: 1500,
      treatments: [
        { name: "Initial Assessment", status: "completed", cost: 200 },
        { name: "Braces Installation", status: "completed", cost: 1500 },
        { name: "Monthly Adjustments", status: "in-progress", cost: 2400 },
        { name: "Retainer Fitting", status: "scheduled", cost: 400 }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'scheduled': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const getTreatmentStatusBadge = (status: string) => {
    const variants = {
      'completed': 'default',
      'in-progress': 'warning',
      'scheduled': 'secondary'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status.replace('-', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Treatment Plans</h1>
          <p className="text-muted-foreground">Manage comprehensive treatment plans and track progress</p>
        </div>
        <Button variant="medical">
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Treatment Plans */}
      <div className="space-y-6">
        {treatmentPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <span>{plan.planName}</span>
                    {getStatusBadge(plan.status)}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">Patient: {plan.patientName}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress and Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Treatment Progress</h4>
                  <Progress value={plan.progress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{plan.progress}% Complete</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Duration</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {plan.startDate} - {plan.endDate}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Financial</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Total: ${plan.totalCost}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Paid: ${plan.paidAmount} ({Math.round((plan.paidAmount / plan.totalCost) * 100)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Steps */}
              <div>
                <h4 className="font-medium mb-4">Treatment Steps</h4>
                <div className="space-y-3">
                  {plan.treatments.map((treatment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          treatment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          treatment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{treatment.name}</p>
                          <p className="text-sm text-muted-foreground">${treatment.cost}</p>
                        </div>
                      </div>
                      {getTreatmentStatusBadge(treatment.status)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button variant="medical" size="sm">View Details</Button>
                <Button variant="outline" size="sm">Schedule Next</Button>
                <Button variant="outline" size="sm">Payment History</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">{treatmentPlans.length}</h3>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-medical-success">
              {Math.round(treatmentPlans.reduce((acc, plan) => acc + plan.progress, 0) / treatmentPlans.length)}%
            </h3>
            <p className="text-sm text-muted-foreground">Avg. Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-foreground">
              ${treatmentPlans.reduce((acc, plan) => acc + plan.totalCost, 0).toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-medical-warning">
              ${treatmentPlans.reduce((acc, plan) => acc + (plan.totalCost - plan.paidAmount), 0).toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Treatments;