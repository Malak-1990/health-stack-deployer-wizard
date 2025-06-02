
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface CurrentHeartRateCardProps {
  currentHeartRate: number | null;
  heartRateStatus: 'normal' | 'warning' | 'critical';
}

const CurrentHeartRateCard = ({ currentHeartRate, heartRateStatus }: CurrentHeartRateCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'حالة حرجة';
      case 'warning': return 'تحتاج متابعة';
      default: return 'طبيعي';
    }
  };

  return (
    <Card className={currentHeartRate ? getStatusColor(heartRateStatus) : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">معدل النبض الحالي</CardTitle>
        <Heart className="h-4 w-4 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentHeartRate ? `${currentHeartRate} نبضة/دقيقة` : 'غير متصل'}
        </div>
        {currentHeartRate && (
          <p className="text-sm text-gray-600">
            الحالة: {getStatusText(heartRateStatus)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentHeartRateCard;
