
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  doctor_name: string;
  appointment_type: string;
  appointment_date: string;
  location: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const AppointmentScheduler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    doctor_name: '',
    appointment_type: '',
    appointment_date: '',
    appointment_time: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Sample data - in real app would fetch from Supabase
      const sampleAppointments: Appointment[] = [
        {
          id: '1',
          doctor_name: 'د. أحمد الزياني',
          appointment_type: 'فحص دوري',
          appointment_date: '2024-01-20T10:00:00Z',
          location: 'مستشفى الجلاء - الطابق الثالث',
          notes: 'فحص دوري لمتابعة ضغط الدم',
          status: 'scheduled'
        },
        {
          id: '2',
          doctor_name: 'د. فاطمة السنوسي',
          appointment_type: 'استشارة قلب',
          appointment_date: '2024-01-25T14:30:00Z',
          location: 'عيادة القلب المتخصصة',
          notes: 'متابعة تخطيط القلب',
          status: 'scheduled'
        }
      ];
      setAppointments(sampleAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData: Appointment = {
        id: editingAppointment?.id || Date.now().toString(),
        doctor_name: formData.doctor_name,
        appointment_type: formData.appointment_type,
        appointment_date: `${formData.appointment_date}T${formData.appointment_time}:00Z`,
        location: formData.location,
        notes: formData.notes,
        status: 'scheduled'
      };

      if (editingAppointment) {
        setAppointments(prev => prev.map(apt => 
          apt.id === editingAppointment.id ? appointmentData : apt
        ));
        toast({
          title: 'تم تحديث الموعد',
          description: 'تم تحديث بيانات الموعد بنجاح',
        });
      } else {
        setAppointments(prev => [...prev, appointmentData]);
        toast({
          title: 'تم حجز الموعد',
          description: 'تم إضافة الموعد الجديد بنجاح',
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'فشل في حفظ الموعد',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_name: '',
      appointment_type: '',
      appointment_date: '',
      appointment_time: '',
      location: '',
      notes: ''
    });
    setEditingAppointment(null);
  };

  const handleEdit = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    setFormData({
      doctor_name: appointment.doctor_name,
      appointment_type: appointment.appointment_type,
      appointment_date: format(appointmentDate, 'yyyy-MM-dd'),
      appointment_time: format(appointmentDate, 'HH:mm'),
      location: appointment.location,
      notes: appointment.notes
    });
    setEditingAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    toast({
      title: 'تم حذف الموعد',
      description: 'تم حذف الموعد بنجاح',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغى';
      default: return 'مجدول';
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">المواعيد الطبية</h2>
          <p className="text-gray-600">إدارة وحجز المواعيد مع الأطباء</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? 'تعديل الموعد' : 'حجز موعد جديد'}
              </DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الموعد الطبي
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor_name">اسم الطبيب</Label>
                <Input
                  id="doctor_name"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment_type">نوع الزيارة</Label>
                <Select
                  value={formData.appointment_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الزيارة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="فحص دوري">فحص دوري</SelectItem>
                    <SelectItem value="استشارة">استشارة</SelectItem>
                    <SelectItem value="متابعة">متابعة</SelectItem>
                    <SelectItem value="فحص تخصصي">فحص تخصصي</SelectItem>
                    <SelectItem value="طوارئ">طوارئ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="appointment_date">التاريخ</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointment_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment_time">الوقت</Label>
                  <Input
                    id="appointment_time"
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="العيادة أو المستشفى"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="ملاحظات إضافية حول الموعد"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingAppointment ? 'تحديث' : 'حجز'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>المواعيد القادمة</CardTitle>
            <CardDescription>المواعيد المجدولة في الأيام القادمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="mr-3">
                      <h4 className="font-medium">{appointment.doctor_name}</h4>
                      <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="mr-1">
                          {format(new Date(appointment.appointment_date), 'yyyy/MM/dd HH:mm')}
                        </span>
                        {appointment.location && (
                          <>
                            <MapPin className="h-3 w-3" />
                            <span className="mr-1">{appointment.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>جميع المواعيد</CardTitle>
          <CardDescription>قائمة كاملة بجميع المواعيد الطبية</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{appointment.doctor_name}</h4>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="mr-1">
                              {format(new Date(appointment.appointment_date), 'yyyy/MM/dd')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="mr-1">
                              {format(new Date(appointment.appointment_date), 'HH:mm')}
                            </span>
                          </div>
                          {appointment.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span className="mr-1">{appointment.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {appointments.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مواعيد</h3>
                  <p className="text-gray-600">ابدأ بحجز موعدك الأول مع الطبيب</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduler;
