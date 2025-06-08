
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { heartRateDataService } from '@/services/HeartRateDataService';

interface AnalyticsData {
  daily: any[];
  weekly: any[];
  monthly: any[];
  trends: {
    heartRate: 'up' | 'down' | 'stable';
    activity: 'up' | 'down' | 'stable';
    overall: 'improving' | 'stable' | 'declining';
  };
}

const HealthAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    daily: [],
    weekly: [],
    monthly: [],
    trends: {
      heartRate: 'stable',
      activity: 'stable',
      overall: 'stable'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Generate sample data for demonstration
      const now = new Date();
      const data = generateSampleData(timeRange, now);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = (range: string, baseDate: Date) => {
    const dataPoints = range === 'daily' ? 24 : range === 'weekly' ? 7 : 12;
    const daily: any[] = [];
    const weekly: any[] = [];
    const monthly: any[] = [];

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      
      if (range === 'daily') {
        date.setHours(date.getHours() - i);
        daily.push({
          time: date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          heartRate: 70 + Math.random() * 30,
          activity: Math.random() * 100,
          stress: Math.random() * 10
        });
      } else if (range === 'weekly') {
        date.setDate(date.getDate() - i);
        weekly.push({
          day: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
          heartRate: 70 + Math.random() * 30,
          activity: Math.random() * 100,
          sleep: 6 + Math.random() * 3
        });
      } else {
        date.setMonth(date.getMonth() - i);
        monthly.push({
          month: date.toLocaleDateString('ar-EG', { month: 'short' }),
          avgHeartRate: 70 + Math.random() * 30,
          totalActivity: Math.random() * 3000,
          healthScore: 70 + Math.random() * 30
        });
      }
    }

    return {
      daily,
      weekly,
      monthly,
      trends: {
        heartRate: Math.random() > 0.5 ? 'up' : 'stable',
        activity: Math.random() > 0.5 ? 'up' : 'stable',
        overall: Math.random() > 0.6 ? 'improving' : 'stable'
      }
    };
  };

  const chartData = analyticsData[timeRange] || [];
  
  const pieData = [
    { name: 'طبيعي', value: 70, color: '#10b981' },
    { name: 'تحذير', value: 25, color: '#f59e0b' },
    { name: 'حرج', value: 5, color: '#ef4444' }
  ];

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">التحليلات الصحية</h2>
          <p className="text-gray-600">تحليل شامل لبياناتك الصحية</p>
        </div>
        <Select value={timeRange} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">يومي</SelectItem>
            <SelectItem value="weekly">أسبوعي</SelectItem>
            <SelectItem value="monthly">شهري</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل ضربات القلب</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78 bpm</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.5% من الأسبوع الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النشاط اليومي</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,245</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% من الأسبوع الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النقاط الصحية</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5 نقاط هذا الشهر
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
          <TabsTrigger value="distribution">التوزيع</TabsTrigger>
          <TabsTrigger value="comparison">المقارنة</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>معدل ضربات القلب - {timeRange === 'daily' ? 'يومي' : timeRange === 'weekly' ? 'أسبوعي' : 'شهري'}</CardTitle>
              <CardDescription>تتبع معدل ضربات القلب عبر الزمن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timeRange === 'daily' ? 'time' : timeRange === 'weekly' ? 'day' : 'month'} />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey={timeRange === 'monthly' ? 'avgHeartRate' : 'heartRate'} 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>توزيع حالات القلب</CardTitle>
              <CardDescription>نسبة الحالات المختلفة لمعدل ضربات القلب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقارنة الأنشطة</CardTitle>
              <CardDescription>مقارنة بين النشاط والنوم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeRange === 'weekly' ? chartData : []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activity" fill="#3b82f6" name="النشاط" />
                    <Bar dataKey="sleep" fill="#10b981" name="النوم (ساعات)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthAnalytics;
