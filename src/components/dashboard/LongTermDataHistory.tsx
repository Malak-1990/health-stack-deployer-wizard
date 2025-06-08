
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar as CalendarIcon, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months' | '6months' | 'year'>('month');
  const [dataFilter, setDataFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoricalData();
  }, [selectedPeriod, dataFilter, dateRange]);

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      // Generate sample historical data
      const data = generateHistoricalData(selectedPeriod);
      const filteredData = dataFilter === 'all' ? data : data.filter(item => item.status === dataFilter);
      setHistoricalData(filteredData);
    } catch (error) {
      console.error('Error loading historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHistoricalData = (period: string): HistoricalData[] => {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : period === '3months' ? 90 : period === '6months' ? 180 : 365;
    const data: HistoricalData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseHeartRate = 70 + Math.sin(i / 10) * 10 + Math.random() * 20;
      const heartRate = Math.max(50, Math.min(120, baseHeartRate));
      
      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (heartRate < 60 || heartRate > 100) status = 'warning';
      if (heartRate < 50 || heartRate > 120) status = 'critical';
      
      data.push({
        date: date.toISOString().split('T')[0],
        heartRate: Math.round(heartRate),
        systolic: Math.round(110 + Math.random() * 30),
        diastolic: Math.round(70 + Math.random() * 20),
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
        item.date,
        item.heartRate.toString(),
        item.systolic.toString(),
        item.diastolic.toString(),
        item.status,
        item.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">السجل التاريخي</h2>
          <p className="text-gray-600">عرض وتحليل البيانات طويلة المدى</p>
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
            تصدير
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المتوسط</p>
                <p className="text-2xl font-bold">{stats.average}</p>
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
            <div>
              <p className="text-sm text-gray-600">الحد الأدنى</p>
              <p className="text-2xl font-bold text-blue-600">{stats.min}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">الحد الأقصى</p>
              <p className="text-2xl font-bold text-red-600">{stats.max}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-gray-600">عدد القراءات</p>
              <p className="text-2xl font-bold text-gray-900">{historicalData.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الرسم البياني التاريخي</CardTitle>
          <CardDescription>تتبع معدل ضربات القلب عبر الفترة المحددة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'yyyy/MM/dd')}
                  formatter={(value: any) => [`${value} bpm`, 'معدل ضربات القلب']}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل البيانات</CardTitle>
          <CardDescription>جدول مفصل للقراءات التاريخية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">معدل ضربات القلب</th>
                  <th className="text-right p-2">ضغط الدم</th>
                  <th className="text-right p-2">الحالة</th>
                  <th className="text-right p-2">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.slice(-10).reverse().map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{format(new Date(item.date), 'yyyy/MM/dd')}</td>
                    <td className="p-2 font-medium">{item.heartRate} bpm</td>
                    <td className="p-2">{item.systolic}/{item.diastolic}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </td>
                    <td className="p-2 text-gray-600">{item.notes || '-'}</td>
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
