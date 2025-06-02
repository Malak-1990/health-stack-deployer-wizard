
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, TrendingUp } from 'lucide-react';

interface HealthStatsCardsProps {
  heartRateStats: {
    average: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
  };
  currentHeartRate: number | null;
}

const HealthStatsCards = ({ heartRateStats, currentHeartRate }: HealthStatsCardsProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">متوسط النبض</CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{heartRateStats.average || 82}</div>
          <p className="text-xs text-gray-600">نبضة/دقيقة (آخر 7 أيام)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">آخر قراءة</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentHeartRate ? 'الآن' : '--'}
          </div>
          <p className="text-xs text-gray-600">
            {currentHeartRate ? new Date().toLocaleTimeString('ar-EG') : 'لا توجد قراءات'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الاتجاه</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            {getTrendIcon(heartRateStats.trend)}
            <span className="mr-2">
              {heartRateStats.trend === 'up' ? 'صاعد' :
               heartRateStats.trend === 'down' ? 'نازل' : 'مستقر'}
            </span>
          </div>
          <p className="text-xs text-gray-600">آخر 7 أيام</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthStatsCards;
