
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Heart, Calendar, User, Mail, Phone, AlertTriangle, Scale } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientProfileModalProps {
  patientId: string;
  patientName: string;
  children: React.ReactNode;
}

interface HeartRateReading {
  id: string;
  heart_rate: number;
  recorded_at: string;
  device_id?: string;
}

interface PatientProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  age?: number;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  medical_conditions?: string[];
  medications?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

const PatientProfileModal = ({ patientId, patientName, children }: PatientProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [heartRateData, setHeartRateData] = useState<HeartRateReading[]>([]);
  const { toast } = useToast();

  const loadPatientData = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      // تحميل ملف المريض
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();

      if (profileError) throw profileError;

      // تحميل قراءات القلب (آخر 24 ساعة)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: heartData, error: heartError } = await supabase
        .from('heart_rate_readings')
        .select('*')
        .eq('user_id', patientId)
        .gte('recorded_at', twentyFourHoursAgo.toISOString())
        .order('recorded_at', { ascending: true });

      if (heartError) throw heartError;

      const transformedProfile = {
        ...profileData,
        full_name: profileData.full_name || 'غير محدد',
        date_of_birth: profileData.date_of_birth ?? undefined,
        email: profileData.email ?? undefined,
        emergency_contact_name: profileData.emergency_contact_name ?? undefined,
        emergency_contact_phone: profileData.emergency_contact_phone ?? undefined,
        gender: profileData.gender ?? undefined,
        height_cm: profileData.height_cm ?? undefined,
        weight_kg: profileData.weight_kg ?? undefined,
        medical_conditions: profileData.medical_conditions ?? undefined,
        medications: profileData.medications ?? undefined
      };
      setProfile(transformedProfile);
      setHeartRateData(heartData || []);

    } catch (error) {
      console.error('خطأ في تحميل بيانات المريض:', error);
      toast({
        title: 'خطأ في التحميل',
        description: 'فشل في تحميل بيانات المريض. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [isOpen, patientId]);

  const getLatestHeartRate = () => {
    if (heartRateData.length === 0) return null;
    return heartRateData[heartRateData.length - 1];
  };

  const getHeartRateStatus = (heartRate: number) => {
    if (heartRate > 120 || heartRate < 50) return { status: 'critical', color: 'bg-red-500', text: 'حرج' };
    if (heartRate > 100 || heartRate < 60) return { status: 'warning', color: 'bg-yellow-500', text: 'تحذير' };
    return { status: 'normal', color: 'bg-green-500', text: 'طبيعي' };
  };

  const chartData = heartRateData.map(reading => ({
    time: new Date(reading.recorded_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    heartRate: reading.heart_rate
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            ملف المريض: {patientName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="readings">القراءات</TabsTrigger>
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* معلومات أساسية */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      آخر قراءة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getLatestHeartRate() ? (
                      <>
                        <div className="text-2xl font-bold">
                          {getLatestHeartRate()!.heart_rate} نبضة/دقيقة
                        </div>
                        <Badge className={`${getHeartRateStatus(getLatestHeartRate()!.heart_rate).color} text-white mt-2`}>
                          {getHeartRateStatus(getLatestHeartRate()!.heart_rate).text}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(getLatestHeartRate()!.recorded_at).toLocaleString('ar-EG')}
                        </p>
                      </>
                    ) : (
                      <div className="text-gray-500">لا توجد قراءات</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      إجمالي القراءات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{heartRateData.length}</div>
                    <p className="text-xs text-gray-500">آخر 24 ساعة</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      التنبيهات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {heartRateData.filter(r => {
                        const status = getHeartRateStatus(r.heart_rate);
                        return status.status === 'critical' || status.status === 'warning';
                      }).length}
                    </div>
                    <p className="text-xs text-gray-500">قراءات غير طبيعية</p>
                  </CardContent>
                </Card>
              </div>

              {/* الرسم البياني */}
              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>معدل ضربات القلب - آخر 24 ساعة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="heartRate" 
                          stroke="#dc2626" 
                          strokeWidth={2}
                          dot={{ fill: '#dc2626' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="readings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>سجل القراءات التفصيلي</CardTitle>
                </CardHeader>
                <CardContent>
                  {heartRateData.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {heartRateData.slice().reverse().map((reading) => {
                        const status = getHeartRateStatus(reading.heart_rate);
                        return (
                          <div key={reading.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                              <div>
                                <div className="font-medium">{reading.heart_rate} نبضة/دقيقة</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(reading.recorded_at).toLocaleString('ar-EG')}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className={status.status === 'critical' ? 'border-red-500 text-red-700' : 
                              status.status === 'warning' ? 'border-yellow-500 text-yellow-700' : 'border-green-500 text-green-700'}>
                              {status.text}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      لا توجد قراءات متاحة
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">الاسم:</span>
                      <span>{profile?.full_name || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">البريد الإلكتروني:</span>
                      <span>{profile?.email || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">الهاتف:</span>
                      <span>{profile?.phone || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">العمر:</span>
                      <span>{profile?.age || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">تاريخ الميلاد:</span>
                      <span>{profile?.date_of_birth || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">الجنس:</span>
                      <span>{profile?.gender || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">الطول:</span>
                      <span>{profile?.height_cm || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">الوزن:</span>
                      <span>{profile?.weight_kg || 'غير محدد'}</span>
                    </div>
                  </div>

                  {profile?.medical_conditions && (
                    <div>
                      <h4 className="font-medium mb-2">الأمراض المرضية:</h4>
                      <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">{profile.medical_conditions?.join(', ')}</p>
                    </div>
                  )}

                  {profile?.medications && (
                    <div>
                      <h4 className="font-medium mb-2">الأدوية الحالية:</h4>
                      <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">{profile.medications}</p>
                    </div>
                  )}

                  {profile?.emergency_contact_name && profile?.emergency_contact_phone && (
                    <div>
                      <h4 className="font-medium mb-2">جهة الاتصال في الطوارئ:</h4>
                      <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                        {profile.emergency_contact_name} - {profile.emergency_contact_phone}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientProfileModal;
