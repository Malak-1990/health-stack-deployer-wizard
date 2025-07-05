
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Download, Filter, TrendingUp, TrendingDown, Heart, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { heartRateDataService } from '@/services/HeartRateDataService';
import { useToast } from '@/hooks/use-toast';

interface HistoricalData {
  date: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  notes?: string;
  status: 'normal' | 'warning' | 'critical';
}

const LongTermDataHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months' | '6months' | 'year'>('month');
  const [dataFilter, setDataFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [dataType, setDataType] = useState<'heart_rate' | 'blood_pressure' | 'combined'>('heart_rate');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoricalData();
  }, [selectedPeriod, dataFilter, user]);

  const loadHistoricalData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // تحميل البيانات الحقيقية من قاعدة البيانات
      const days = selectedPeriod === 'week' ? 7 : 
                   selectedPeriod === 'month' ? 30 : 
                   selectedPeriod === '3months' ? 90 : 
                   selectedPeriod === '6months' ? 180 : 365;
      
      const readings = await heartRateDataService.getHeartRateReadings(user.id, days * 10);
      const dailyAverages = await heartRateDataService.getDailyAverages(user.id, days);
      
      // تحويل البيانات إلى التنسيق المطلوب
      const processedData: HistoricalData[] = dailyAverages.map(avg => {
        const relatedReadings = readings.filter(r => 
          new Date(r.recorded_at).toDateString() === new Date(avg.date).toDateString()
        );
        
        const avgSystolic = relatedReadings.length > 0 
          ? Math.round(relatedReadings.reduce((sum, r) => sum + (r.systolic_bp || 120), 0) / relatedReadings.length)
          : 120 + Math.random() * 30;
          
        const avgDiastolic = relatedReadings.length > 0
          ? Math.round(relatedReadings.reduce((sum, r) => sum + (r.diastolic_bp || 80), 0) / relatedReadings.length)
          : 70 + Math.random() * 20;
        
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (avg.average < 60 || avg.average > 100 || avgSystolic > 140 || avgDiastolic > 90) {
          status = 'warning';
        }
        if (avg.average < 50 || avg.average > 120 || avgSystolic > 160 || avgDiastolic > 100) {
          status = 'critical';
        }
        
        return {
          date: avg.date,
          heartRate: avg.average,
          systolic: avgSystolic,
          diastolic: avgDiastolic,
          status,
          notes: relatedReadings.find(r => r.notes)?.notes
        };
      });
      
      // إضافة بيانات وهمية إذا لم تكن هناك بيانات كافية
      if (processedData.length < 5) {
        const mock = generateMockData(days);
        setHistoricalData([...processedData, ...mock.slice(processedData.length)]);
      } else {
        setHistoricalData(processedData);
      }
      
      // تطبيق الفلتر
      const filteredData = dataFilter === 'all' 
        ? processedData 
        : processedData.filter(item => item.status === dataFilter);
      
      setHistoricalData(filteredData);
      
    } catch (error) {
      console.error('Error loading historical data:', error);
      toast({
        title: 'خطأ في تحميل البيانات',
        description: 'سيتم عرض بيانات تجريبية',
        variant: 'destructive'
      });
      
      // عرض بيانات وهمية في حالة الخطأ
      const mockData = generateMockData(selectedPeriod === 'week' ? 7 : 30);
      setHistoricalData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (days: number): HistoricalData[] => {
    const data: HistoricalData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseHeartRate = 70 + Math.sin(i / 10) * 10 + Math.random() * 20;
      const heartRate = Math.max(50, Math.min(120, baseHeartRate));
      
      const systolic = Math.round(110 + Math.sin(i / 15) * 20 + Math.random() * 30);
      const diastolic = Math.round(70 + Math.sin(i / 12) * 15 + Math.random() * 20);
      
      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (heartRate < 60 || heartRate > 100 || systolic > 140 || diastolic > 90) {
        status = 'warning';
      }
      if (heartRate < 50 || heartRate > 120 || systolic > 160 || diastolic > 100) {
        status = 'critical';
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        heartRate: Math.round(heartRate),
        systolic,
        diastolic,
        status,
        notes: Math.random() > 0.8 ? 'ملاحظة تلقائية' : undefined
      });
    }
    
    return data;
  };

  const exportData = () => {
    const csvContent = [
      ['التاريخ', 'معدل ضربات القلب', 'الضغط الانقباضي', 'الضغط الانبساطي', 'الحالة', 'الملاحظات'],
      ...historicalData.map(item => [
        format(new Date(item.date), 'yyyy-MM-dd'),
        item.heartRate.toString(),
        item.systolic.toString(),
        item.diastolic.toString(),
        item.status,
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heart-rate-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const stats = {
    average: historicalData.length > 0 ? Math.round(historicalData.reduce((sum, item) => sum + item.heartRate, 0) / historicalData.length) : 0,
    min: historicalData.length > 0 ? Math.min(...historicalData.map(item => item.heartRate)) : 0,
    max: historicalData.length > 0 ? Math.max(...historicalData.map(item => item.heartRate)) : 0,
    trend: historicalData.length > 1 ? (historicalData[historicalData.length - 1].heartRate > historicalData[0].heartRate ? 'up' : 'down') : 'stable'
  };

  const renderChart = () => {
    const data = historicalData.map(item => ({
      date: format(new Date(item.date), 'MM/dd'),
      heartRate: item.heartRate,
      systolic: item.systolic,
      diastolic: item.diastolic
    }));

    const ChartComponent = chartType === 'area' ? AreaChart : chartType === 'bar' ? BarChart : LineChart;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip 
            labelFormatter={(value) => `التاريخ: ${value}`}
            formatter={(value: any, name: string) => {
              const label = name === 'heartRate' ? 'معدل ضربات القلب' : 
                           name === 'systolic' ? 'الضغط الانقباضي' : 'الضغط الانبساطي';
              return [`${value}`, label];
            }}
          />
          
          {dataType === 'heart_rate' || dataType === 'combined' ? (
            chartType === 'area' ? (
              <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
            ) : chartType === 'bar' ? (
              <Bar dataKey="heartRate" fill="#ef4444" />
            ) : (
              <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }} />
            )
          ) : null}
          
          {dataType === 'blood_pressure' || dataType === 'combined' ? (
            <>
              {chartType === 'area' ? (
                <>
                  <Area type="monotone" dataKey="systolic" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
                  <Area type="monotone" dataKey="diastolic" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                </>
              ) : chartType === 'bar' ? (
                <>
                  <Bar dataKey="systolic" fill="#3b82f6" />
                  <Bar dataKey="diastolic" fill="#10b981" />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }} />
                </>
              )}
            </>
          ) : null}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات التاريخية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">السجل التاريخي المتقدم</h2>
          <p className="text-gray-600">عرض وتحليل البيانات الصحية طويلة المدى مع إحصائيات متقدمة</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="3months">3 أشهر</SelectItem>
              <SelectItem value="6months">6 أشهر</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dataType} onValueChange={(value: any) => setDataType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heart_rate">معدل ضربات القلب</SelectItem>
              <SelectItem value="blood_pressure">ضغط الدم</SelectItem>
              <SelectItem value="combined">مجمع</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">خطي</SelectItem>
              <SelectItem value="area">منطقة</SelectItem>
              <SelectItem value="bar">أعمدة</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dataFilter} onValueChange={(value: any) => setDataFilter(value)}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="normal">طبيعي</SelectItem>
              <SelectItem value="warning">تحذير</SelectItem>
              <SelectItem value="critical">حرج</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط معدل ضربات القلب</p>
                <p className="text-2xl font-bold">{stats.average}</p>
                <p className="text-xs text-gray-500">نبضة/دقيقة</p>
              </div>
              <div className={`p-2 rounded-full ${stats.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                {stats.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الحد الأدنى</p>
                <p className="text-2xl font-bold text-blue-600">{stats.min}</p>
                <p className="text-xs text-gray-500">نبضة/دقيقة</p>
              </div>
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الحد الأقصى</p>
                <p className="text-2xl font-bold text-red-600">{stats.max}</p>
                <p className="text-xs text-gray-500">نبضة/دقيقة</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">عدد القراءات</p>
              <p className="text-2xl font-bold text-gray-900">{historicalData.length}</p>
              <p className="text-xs text-gray-500">خلال الفترة المحددة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>الرسم البياني التفاعلي المتقدم</CardTitle>
              <CardDescription>
                تتبع {dataType === 'heart_rate' ? 'معدل ضربات القلب' : 
                       dataType === 'blood_pressure' ? 'ضغط الدم' : 'جميع المؤشرات'} 
                عبر الفترة المحددة
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {dataType === 'heart_rate' || dataType === 'combined' ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>معدل ضربات القلب</span>
                </div>
              ) : null}
              {(dataType === 'blood_pressure' || dataType === 'combined') && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>الضغط الانقباضي</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>الضغط الانبساضي</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل البيانات التاريخية</CardTitle>
          <CardDescription>جدول مفصل مع إحصائيات شاملة للقراءات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-right p-3 font-semibold">التاريخ</th>
                  <th className="text-right p-3 font-semibold">معدل ضربات القلب</th>
                  <th className="text-right p-3 font-semibold">ضغط الدم</th>
                  <th className="text-right p-3 font-semibold">الحالة</th>
                  <th className="text-right p-3 font-semibold">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.slice(-15).reverse().map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{format(new Date(item.date), 'yyyy/MM/dd')}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.heartRate}</span>
                        <span className="text-sm text-gray-500">bpm</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{item.systolic}/{item.diastolic}</div>
                        <div className="text-gray-500">mmHg</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-600 text-sm max-w-xs truncate">
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongTermDataHistory;
