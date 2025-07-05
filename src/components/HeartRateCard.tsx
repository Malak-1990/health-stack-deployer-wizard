
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Heart, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface HeartRateReading {
  id: string;
  heart_rate: number;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  notes: string | null;
  recorded_at: string;
}

interface HeartRateCardProps {
  onUpdate?: () => void;
}

const HeartRateCard = ({ onUpdate }: HeartRateCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [readings, setReadings] = useState<HeartRateReading[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReading, setEditingReading] = useState<HeartRateReading | null>(null);
  const [formData, setFormData] = useState({
    heart_rate: '',
    systolic_bp: '',
    diastolic_bp: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadReadings();
    }
  }, [user]);

  const loadReadings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('heart_rate_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(10);

    if (error) {
      toast({
        title: "Error loading readings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setReadings(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const data = {
      user_id: user.id,
      heart_rate: parseInt(formData.heart_rate),
      systolic_bp: formData.systolic_bp ? parseInt(formData.systolic_bp) : null,
      diastolic_bp: formData.diastolic_bp ? parseInt(formData.diastolic_bp) : null,
      notes: formData.notes || null,
    };

    let error;
    if (editingReading) {
      const { error: updateError } = await supabase
        .from('heart_rate_readings')
        .update(data)
        .eq('id', editingReading.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('heart_rate_readings')
        .insert([data]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving reading",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: editingReading ? "Reading updated successfully" : "Reading saved successfully",
      });
      setFormData({ heart_rate: '', systolic_bp: '', diastolic_bp: '', notes: '' });
      setEditingReading(null);
      setIsDialogOpen(false);
      loadReadings();
      onUpdate?.();
    }
  };

  const handleEdit = (reading: HeartRateReading) => {
    setEditingReading(reading);
    setFormData({
      heart_rate: reading.heart_rate.toString(),
      systolic_bp: reading.systolic_bp?.toString() || '',
      diastolic_bp: reading.diastolic_bp?.toString() || '',
      notes: reading.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('heart_rate_readings')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting reading",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Reading deleted successfully",
      });
      loadReadings();
      onUpdate?.();
    }
  };

  const resetForm = () => {
    setFormData({ heart_rate: '', systolic_bp: '', diastolic_bp: '', notes: '' });
    setEditingReading(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span>Heart Rate & Blood Pressure</span>
            </CardTitle>
            <CardDescription>Track your vital signs</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Reading
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingReading ? 'Edit Reading' : 'Add New Reading'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="heart_rate">Heart Rate (BPM) *</Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      min="30"
                      max="250"
                      value={formData.heart_rate}
                      onChange={(e) => setFormData({ ...formData, heart_rate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="systolic_bp">Systolic BP</Label>
                      <Input
                        id="systolic_bp"
                        type="number"
                        min="70"
                        max="250"
                        value={formData.systolic_bp}
                        onChange={(e) => setFormData({ ...formData, systolic_bp: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="diastolic_bp">Diastolic BP</Label>
                      <Input
                        id="diastolic_bp"
                        type="number"
                        min="40"
                        max="150"
                        value={formData.diastolic_bp}
                        onChange={(e) => setFormData({ ...formData, diastolic_bp: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingReading ? 'Update Reading' : 'Save Reading'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {readings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>
                    {format(new Date(reading.recorded_at), 'MMM dd, HH:mm')}
                  </TableCell>
                  <TableCell>{reading.heart_rate} BPM</TableCell>
                  <TableCell>
                    {reading.systolic_bp && reading.diastolic_bp
                      ? `${reading.systolic_bp}/${reading.diastolic_bp}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(reading)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(reading.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No readings yet. Add your first reading!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HeartRateCard;
