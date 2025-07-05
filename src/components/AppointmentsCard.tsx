
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  doctor_name: string;
  appointment_type: string;
  appointment_date: string;
  location: string | null;
  notes: string | null;
  status: AppointmentStatus;
}

const AppointmentsCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    doctor_name: '',
    appointment_type: '',
    appointment_date: '',
    appointment_time: '',
    location: '',
    notes: '',
    status: 'scheduled' as AppointmentStatus
  });

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });

    if (error) {
      toast({
        title: "Error loading appointments",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Type assertion to ensure the status field is properly typed
      const typedAppointments = (data || []).map(appointment => ({
        ...appointment,
        status: appointment.status as AppointmentStatus
      }));
      setAppointments(typedAppointments);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const appointmentDateTime = new Date(`${formData.appointment_date}T${formData.appointment_time}`);
    
    const data = {
      user_id: user.id,
      doctor_name: formData.doctor_name,
      appointment_type: formData.appointment_type,
      appointment_date: appointmentDateTime.toISOString(),
      location: formData.location || null,
      notes: formData.notes || null,
      status: formData.status,
    };

    let error;
    if (editingAppointment) {
      const { error: updateError } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', editingAppointment.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('appointments')
        .insert([data]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving appointment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: editingAppointment ? "Appointment updated successfully" : "Appointment scheduled successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      loadAppointments();
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    const date = new Date(appointment.appointment_date);
    setFormData({
      doctor_name: appointment.doctor_name,
      appointment_type: appointment.appointment_type,
      appointment_date: date.toISOString().split('T')[0],
      appointment_time: date.toTimeString().slice(0, 5),
      location: appointment.location || '',
      notes: appointment.notes || '',
      status: appointment.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting appointment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
      loadAppointments();
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_name: '',
      appointment_type: '',
      appointment_date: '',
      appointment_time: '',
      location: '',
      notes: '',
      status: 'scheduled'
    });
    setEditingAppointment(null);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Medical Appointments</span>
            </CardTitle>
            <CardDescription>Manage your healthcare appointments</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="doctor_name">Doctor Name *</Label>
                  <Input
                    id="doctor_name"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="appointment_type">Appointment Type *</Label>
                  <Select value={formData.appointment_type} onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Check-up">Regular Check-up</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Blood Test">Blood Test</SelectItem>
                      <SelectItem value="X-Ray">X-Ray</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointment_date">Date *</Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointment_time">Time *</Label>
                    <Input
                      id="appointment_time"
                      type="time"
                      value={formData.appointment_time}
                      onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Clinic name or address"
                  />
                </div>
                {editingAppointment && (
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: AppointmentStatus) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{appointment.doctor_name}</h4>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(appointment.appointment_date), 'MMM dd, yyyy HH:mm')}
                  </div>
                  {appointment.location && (
                    <p className="text-xs text-gray-500">{appointment.location}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(appointment)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {appointments.length > 5 && (
              <p className="text-center text-sm text-gray-500">
                And {appointments.length - 5} more appointments...
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No appointments scheduled. Book your first appointment!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard;
