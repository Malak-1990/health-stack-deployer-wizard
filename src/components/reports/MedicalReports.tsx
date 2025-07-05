
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar as CalendarIcon, Download, FileText, Printer, Share, TrendingUp, Heart, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface MedicalReport {
  id: string;
  title: string;
  type: 'monthly' | 'weekly' | 'custom';
  dateRange: {
    from: string;
    to: string;
  };
  summary: {
    avgHeartRate: number;
    minHeartRate: number;
    maxHeartRate: number;
    totalReadings: number;
    alertsCount: number;
    healthScore: number;
  };
  chartData: any[];
  createdAt: string;
}

const MedicalReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'custom'>('monthly');

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Generate sample reports
      const sampleReports: MedicalReport[] = [
        {
          id: '1',
          title: 'تقرير شهري - يناير 2024',
          type: 'monthly',
          dateRange: {
            from: '2024-01-01',
            to: '2024-01-31'
          },
          summary: {
            avgHeartRate: 75,
            minHeartRate: 62,
            maxHeartRate: 95,
            totalReadings: 186,
            alertsCount: 3,
            healthScore: 85
          },
          chartData: generateChartData(31),
          createdAt: '2024-01-31T23:59:59Z'
        },
        {
          id: '2',
          title: 'تقرير أسبوعي - الأسبوع الثالث يناير',
          type: 'weekly',
          dateRange: {
            from: '2024-01-15',
            to: '2024-01-21'
          },
          summary: {
            avgHeartRate: 78,
            minHeartRate: 65,
            maxHeartRate: 88,
            totalReadings: 42,
            alertsCount: 1,
            healthScore: 88
          },
          chartData: generateChartData(7),
          createdAt: '2024-01-21T23:59:59Z'
        }
      ];
      
      setReports(sampleReports);
      if (sampleReports.length > 0) {
        setSelectedReport(sampleReports[0]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (days: number) => {
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      data.push({
        date: format(date, 'MM/dd'),
        heartRate: 70 + Math.random() * 20,
        activity: Math.random() * 100,
        stress: Math.random() * 10
      });
    }
    return data;
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const newReport: MedicalReport = {
        id: Date.now().toString(),
        title: `تقرير ${reportType === 'weekly' ? 'أسبوعي' : reportType === 'monthly' ? 'شهري' : 'مخصص'} - ${format(new Date(), 'yyyy/MM/dd')}`,
        type: reportType,
        dateRange: {
          from: format(dateRange.from, 'yyyy-MM-dd'),
          to: format(dateRange.to, 'yyyy-MM-dd')
        },
        summary: {
          avgHeartRate: 72 + Math.random() * 10,
          minHeartRate: 60 + Math.random() * 10,
          maxHeartRate: 85 + Math.random() * 15,
          totalReadings: Math.floor(Math.random() * 200) + 50,
          alertsCount: Math.floor(Math.random() * 5),
          healthScore: 75 + Math.random() * 20
        },
        chartData: generateChartData(reportType === 'weekly' ? 7 : reportType === 'monthly' ? 30 : Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))),
        createdAt: new Date().toISOString()
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    if (!selectedReport) return;
    
    const data = {
      title: selectedReport.title,
      dateRange: selectedReport.dateRange,
      summary: selectedReport.summary,
      chartData: selectedReport.chartData
    };

    // Simulate export
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${selectedReport.id}.${format === 'pdf' ? 'json' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  if (loading && reports.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">التقارير الطبية</h2>
          <p className="text-gray-600">تقارير شاملة عن حالتك الصحية</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">أسبوعي</SelectItem>
              <SelectItem value="monthly">شهري</SelectItem>
              <SelectItem value="custom">مخصص</SelectItem>
            </SelectContent>
          </Select>

          {reportType === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  اختر الفترة
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}

          <Button onClick={generateReport} disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            إنشاء تقرير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>التقارير المحفوظة</CardTitle>
              <CardDescription>قائمة التقارير السابقة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport?.id === report.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <h4 className="font-medium text-sm">{report.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(report.createdAt), 'yyyy/MM/dd')}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {report.type === 'monthly' ? 'شهري' : report.type === 'weekly' ? 'أسبوعي' : 'مخصص'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Report Details */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <div className="space-y-6">
              {/* Report Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedReport.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(selectedReport.dateRange.from), 'yyyy/MM/dd')} - {format(new Date(selectedReport.dateRange.to), 'yyyy/MM/dd')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        طباعة
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">متوسط ضربات القلب</p>
                        <p className="text-2xl font-bold">{selectedReport.summary.avgHeartRate}</p>
                        <p className="text-xs text-gray-500">bpm</p>
                      </div>
                      <Heart className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">عدد القراءات</p>
                        <p className="text-2xl font-bold">{selectedReport.summary.totalReadings}</p>
                        <p className="text-xs text-gray-500">قراءة</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">النقاط الصحية</p>
                        <p className={`text-2xl font-bold ${getHealthScoreColor(selectedReport.summary.healthScore)}`}>
                          {Math.round(selectedReport.summary.healthScore)}
                        </p>
                        <p className={`text-xs ${getHealthScoreColor(selectedReport.summary.healthScore)}`}>
                          {getHealthScoreLabel(selectedReport.summary.healthScore)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل معدل ضربات القلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحد الأدنى:</span>
                      <span className="font-medium">{selectedReport.summary.minHeartRate} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المتوسط:</span>
                      <span className="font-medium">{selectedReport.summary.avgHeartRate} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحد الأقصى:</span>
                      <span className="font-medium">{selectedReport.summary.maxHeartRate} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التنبيهات:</span>
                      <Badge variant={selectedReport.summary.alertsCount > 0 ? "destructive" : "default"}>
                        {selectedReport.summary.alertsCount}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ملخص الفترة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">مدة التقرير:</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(selectedReport.dateRange.to).getTime() - new Date(selectedReport.dateRange.from).getTime()) / (1000 * 60 * 60 * 24))} يوم
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">معدل القراءات اليومية:</span>
                      <span className="font-medium">
                        {Math.round(selectedReport.summary.totalReadings / Math.ceil((new Date(selectedReport.dateRange.to).getTime() - new Date(selectedReport.dateRange.from).getTime()) / (1000 * 60 * 60 * 24)))} قراءة
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة العامة:</span>
                      <Badge className={getHealthScoreColor(selectedReport.summary.healthScore)}>
                        {getHealthScoreLabel(selectedReport.summary.healthScore)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>الرسم البياني لمعدل ضربات القلب</CardTitle>
                  <CardDescription>تتبع معدل ضربات القلب خلال فترة التقرير</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedReport.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="heartRate" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ fill: '#ef4444' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>مستوى النشاط اليومي</CardTitle>
                  <CardDescription>مؤشر النشاط والتوتر خلال الفترة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedReport.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="activity" fill="#3b82f6" name="النشاط" />
                        <Bar dataKey="stress" fill="#ef4444" name="التوتر" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد تقرير محدد</h3>
                <p className="text-gray-600">اختر تقريراً من القائمة أو أنشئ تقريراً جديداً</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalReports;
