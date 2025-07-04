
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Save, Camera, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PatientProfileData {
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | '';
  height_cm: number | '';
  weight_kg: number | '';
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_conditions: string[];
  medications: string[];
}

const PatientProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [profileData, setProfileData] = useState<PatientProfileData>({
    full_name: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: [],
    medications: []
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    // Sample data - in real app would fetch from Supabase
    setProfileData({
      full_name: user?.email?.split('@')[0] || '',
      date_of_birth: '1990-01-15',
      gender: 'male',
      height_cm: 175,
      weight_kg: 70,
      emergency_contact_name: 'أحمد محمد',
      emergency_contact_phone: '+218-91-234-5678',
      medical_conditions: ['ارتفاع ضغط الدم', 'السكري'],
      medications: ['ليسينوبريل', 'ميتفورمين']
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to Supabase - mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم حفظ البيانات',
        description: 'تم تحديث الملف الشخصي بنجاح',
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'فشل في حفظ البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addMedicalCondition = () => {
    if (newCondition.trim()) {
      setProfileData(prev => ({
        ...prev,
        medical_conditions: [...prev.medical_conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeMedicalCondition = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setProfileData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const calculateAge = () => {
    if (!profileData.date_of_birth) return '';
    const today = new Date();
    const birthDate = new Date(profileData.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();
    return `${age} سنة`;
  };

  const calculateBMI = () => {
    if (!profileData.height_cm || !profileData.weight_kg) return '';
    const heightM = Number(profileData.height_cm) / 100;
    const weight = Number(profileData.weight_kg);
    const bmi = weight / (heightM * heightM);
    return bmi.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">الملف الشخصي</h2>
          <p className="text-gray-600">إدارة البيانات الشخصية والطبية</p>
        </div>
        <Button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={loading}
        >
          {editing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              حفظ
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              تحرير
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>الصورة الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {profileData.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  تغيير الصورة
                </Button>
              )}
            </div>
            
            <div className="space-y-2 text-center">
              <h3 className="font-medium">{profileData.full_name}</h3>
              <p className="text-sm text-gray-600">{calculateAge()}</p>
              {calculateBMI() && (
                <Badge variant="outline">
                  BMI: {calculateBMI()}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>البيانات الشخصية</CardTitle>
            <CardDescription>المعلومات الأساسية والبيانات الطبية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">تاريخ الميلاد</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profileData.date_of_birth}
                  onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value as 'male' | 'female' }))}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">الطول (سم)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profileData.height_cm}
                  onChange={(e) => setProfileData(prev => ({ ...prev, height_cm: Number(e.target.value) }))}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">الوزن (كج)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profileData.weight_kg}
                  onChange={(e) => setProfileData(prev => ({ ...prev, weight_kg: Number(e.target.value) }))}
                  disabled={!editing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>جهة الاتصال في حالات الطوارئ</CardTitle>
          <CardDescription>معلومات الاتصال للاستخدام في حالات الطوارئ</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_name">اسم جهة الاتصال</Label>
            <Input
              id="emergency_name"
              value={profileData.emergency_contact_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
              disabled={!editing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_phone">رقم الهاتف</Label>
            <Input
              id="emergency_phone"
              value={profileData.emergency_contact_phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>الحالات الطبية</CardTitle>
            <CardDescription>الأمراض والحالات الطبية الحالية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profileData.medical_conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {condition}
                  {editing && (
                    <button
                      onClick={() => removeMedicalCondition(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {editing && (
              <div className="flex gap-2">
                <Input
                  placeholder="إضافة حالة طبية جديدة"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMedicalCondition()}
                />
                <Button onClick={addMedicalCondition} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>الأدوية</CardTitle>
            <CardDescription>الأدوية التي يتم تناولها حالياً</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profileData.medications.map((medication, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {medication}
                  {editing && (
                    <button
                      onClick={() => removeMedication(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {editing && (
              <div className="flex gap-2">
                <Input
                  placeholder="إضافة دواء جديد"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                />
                <Button onClick={addMedication} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientProfile;
