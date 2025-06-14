
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone, Heart, Clock } from 'lucide-react';
import { emergencyAlertService } from '@/services/EmergencyAlertService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EmergencyButtonProps {
  currentHeartRate?: number;
}

const EmergencyButton = ({ currentHeartRate }: EmergencyButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleEmergencyAlert = async () => {
    if (!user) return;

    // Start 5-second countdown for safety
    setCountdown(5);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(async () => {
      setIsLoading(true);
      try {
        await emergencyAlertService.sendEmergencyAlert({
          id: user.id,
          name: user.email || 'مريض',
          heartRate: currentHeartRate
        });

        toast({
          title: '🚨 تم إرسال التنبيه بنجاح',
          description: 'تم إرسال تنبيه الطوارئ للعائلة والطبيب المعالج مع الموقع الحالي',
        });
      } catch (error) {
        toast({
          title: 'خطأ في الإرسال',
          description: 'فشل في إرسال تنبيه الطوارئ. حاول مرة أخرى.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setCountdown(null);
      }
    }, 5000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          size="lg"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-xl animate-pulse shadow-lg border-4 border-red-500"
        >
          <AlertTriangle className="h-8 w-8 mr-3" />
          🚨 تنبيه طوارئ 🚨
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-right max-w-md" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center space-x-2 text-red-600">
            <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
            <span className="text-xl">تأكيد إرسال تنبيه الطوارئ</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">
            هل أنت متأكد من إرسال تنبيه الطوارئ؟
            <br />
            <strong className="text-red-600">سيتم إرسال إشعار فوري للعائلة والطبيب المعالج مع موقعك الحالي.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="h-6 w-6 text-yellow-600" />
            <span className="text-lg font-semibold">سيتم إرسال التنبيه إلى:</span>
          </div>
          <ul className="text-base text-gray-700 space-y-2 mb-4">
            <li className="flex items-center">• فرد العائلة المسجل</li>
            <li className="flex items-center">• الطبيب المعالج</li>
            <li className="flex items-center">• خدمات الطوارئ (اختياري)</li>
          </ul>
          
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">معلومات إضافية:</span>
          </div>
          <div className="bg-white p-4 rounded border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                الموقع الجغرافي الحالي
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                معدل النبض: {currentHeartRate || 'غير متاح'}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                الوقت والتاريخ
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                مستوى الطوارئ: عالي
              </div>
            </div>
          </div>
        </div>

        {countdown !== null && (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600 animate-pulse">
              {countdown}
            </div>
            <p className="text-sm text-red-600">ثواني متبقية قبل الإرسال...</p>
          </div>
        )}

        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel disabled={isLoading || countdown !== null}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEmergencyAlert}
            disabled={isLoading || countdown !== null}
            className="bg-red-600 hover:bg-red-700 text-lg px-8"
          >
            {isLoading ? 'جاري الإرسال...' : countdown !== null ? `إرسال في ${countdown}` : '🚨 إرسال التنبيه الآن'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmergencyButton;
