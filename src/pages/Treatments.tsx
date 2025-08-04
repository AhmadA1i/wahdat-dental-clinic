import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AddTreatmentPlanForm } from '@/components/forms/AddTreatmentPlanForm';

interface TreatmentPlan {
  id: string;
  treatment_name: string;
  description?: string;
  duration: string;
  total_cost: number;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  patient_id: string;
  doctor_id: string;
  patients?: { name: string };
  doctors?: { name: string; specialty: string };
}

const Treatments = () => {
  const { toast } = useToast();
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTreatment, setShowAddTreatment] = useState(false);

  const fetchTreatmentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          *,
          patients:patient_id (name),
          doctors:doctor_id (name, specialty)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTreatmentPlans(data || []);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      toast({
        title: "Error",
        description: "Failed to load treatment plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  const handleDeleteTreatmentPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Treatment plan deleted successfully",
      });
      fetchTreatmentPlans();
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete treatment plan",
        variant: "destructive",
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading treatment plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Treatment Plans</h1>
          <p className="text-muted-foreground">Manage comprehensive treatment plans and track progress</p>
        </div>
        <Button 
          variant="medical"
          onClick={() => setShowAddTreatment(true)}
        >
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
                    <span>{plan.treatment_name}</span>
                    {getStatusBadge(plan.status)}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Patient: {plan.patients?.name || 'Unknown'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Doctor: {plan.doctors?.name || 'Not assigned'} 
                    {plan.doctors?.specialty && ` (${plan.doctors.specialty})`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteTreatmentPlan(plan.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Duration</h4>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {plan.duration}
                    </div>
                    {plan.start_date && plan.end_date && (
                      <div className="mt-1">
                        {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cost</h4>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${plan.total_cost.toLocaleString()}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {plan.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <h4 className="font-medium mb-2">Created</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(plan.created_at).toLocaleDateString()}
                </p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">{treatmentPlans.length}</h3>
            <p className="text-sm text-muted-foreground">Total Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-foreground">
              ${treatmentPlans.reduce((acc, plan) => acc + plan.total_cost, 0).toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {treatmentPlans.filter(plan => plan.status === 'active').length}
            </h3>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
      </div>

      <AddTreatmentPlanForm
        open={showAddTreatment}
        onOpenChange={setShowAddTreatment}
        onTreatmentPlanAdded={fetchTreatmentPlans}
      />
    </div>
  );
};

export default Treatments;