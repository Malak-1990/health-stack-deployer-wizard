
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, AlertTriangle, Heart, Phone, Mail } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  phone?: string;
  lastHeartRate: number;
  lastUpdate: string;
  status: 'normal' | 'warning' | 'critical';
  alertsCount: number;
  avatar?: string;
  medicalConditions: string[];
}

const DoctorPatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, statusFilter]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      // Generate sample patient data
      const samplePatients: Patient[] = [
        {
          id: '1',
          name: 'أحمد محمد الزياني',
          email: 'ahmed@example.com',
          age: 45,
          gender: 'male',
          phone: '+218-91-234-5678',
          lastHeartRate: 85,
          lastUpdate: '2024-01-15T10:30:00Z',
          status: 'normal',
          alertsCount: 0,
          medicalConditions: ['ارتفاع ضغط الدم']
        },
        {
          id: '2',
          name: 'فاطمة علي السنوسي',
          email: 'fatima@example.com',
          age: 52,
          gender: 'female',
          phone: '+218-92-345-6789',
          lastHeartRate: 120,
          lastUpdate: '2024-01-15T09:15:00Z',
          status: 'warning',
          alertsCount: 2,
          medicalConditions: ['السكري', 'أمراض القلب']
        },
        {
          id: '3',
          name: 'عمر سالم القذافي',
          email: 'omar@example.com',
          age: 38,
          gender: 'male',
          phone: '+218-93-456-7890',
          lastHeartRate: 140,
          lastUpdate: '2024-01-15T08:45:00Z',
          status: 'critical',
          alertsCount: 5,
          medicalConditions: ['عدم انتظام ضربات القلب']
        },
        {
          id: '4',
          name: 'زينب حسين الطرابلسي',
          email: 'zeinab@example.com',
          age: 29,
          gender: 'female',
          phone: '+218-94-567-8901',
          lastHeartRate: 72,
          lastUpdate: '2024-01-15T11:00:00Z',
          status: 'normal',
          alertsCount: 0,
          medicalConditions: []
        },
        {
          id: '5',
          name: 'محمد عبد الرحمن المصراتي',
          email: 'mohammed@example.com',
          age: 61,
          gender: 'male',
          phone: '+218-95-678-9012',
          lastHeartRate: 105,
          lastUpdate: '2024-01-15T07:30:00Z',
          status: 'warning',
          alertsCount: 1,
          medicalConditions: ['الكوليسترول', 'ارتفاع ضغط الدم']
        }
      ];
      
      setPatients(samplePatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;
    
    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }
    
    setFilteredPatients(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical': return 'حرج';
      case 'warning': return 'تحذير';
      default: return 'طبيعي';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      default: return UserCheck;
    }
  };

  const handlePatientClick = (patientId: string) => {
    // Navigate to patient details page
    navigate(`/patient/${patientId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">قائمة المرضى</h2>
          <p className="text-gray-600">إدارة ومتابعة جميع المرضى</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث عن مريض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="normal">طبيعي</SelectItem>
              <SelectItem value="warning">تحذير</SelectItem>
              <SelectItem value="critical">حرج</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المرضى</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">حالات طبيعية</p>
                <p className="text-2xl font-bold text-green-600">
                  {patients.filter(p => p.status === 'normal').length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تحذيرات</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {patients.filter(p => p.status === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">حالات حرجة</p>
                <p className="text-2xl font-bold text-red-600">
                  {patients.filter(p => p.status === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => {
          const StatusIcon = getStatusIcon(patient.status);
          return (
            <Card 
              key={patient.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePatientClick(patient.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>{patient.name.split(' ')[0][0]}{patient.name.split(' ')[1]?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="mr-3">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>{patient.age} سنة • {patient.gender === 'male' ? 'ذكر' : 'أنثى'}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(patient.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {getStatusLabel(patient.status)}
                    </Badge>
                    {patient.alertsCount > 0 && (
                      <Badge variant="destructive">{patient.alertsCount}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium mr-2">آخر قراءة:</span>
                    <span className="text-sm font-bold">{patient.lastHeartRate} bpm</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(patient.lastUpdate).toLocaleTimeString('ar-EG')}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 mr-2">{patient.email}</span>
                </div>

                {patient.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 mr-2">{patient.phone}</span>
                  </div>
                )}

                {patient.medicalConditions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {patient.medicalConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مرضى</h3>
            <p className="text-gray-600">لم يتم العثور على مرضى مطابقين لمعايير البحث</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorPatientList;
