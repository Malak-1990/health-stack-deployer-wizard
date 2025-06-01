
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone } from 'lucide-react';
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

  const handleEmergencyAlert = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await emergencyAlertService.sendEmergencyAlert({
        id: user.id,
        name: user.email || 'مريض',
        heartRate: currentHeartRate
      });

      toast({
        title: 'تم إرسال التنبيه',
        description: 'تم إرسال تنبيه الطوارئ للعائلة والطبيب المعالج',
      });
    } catch (error) {
      toast({
        title: 'خطأ في الإرسال',
        description: 'فشل في إرسال تنبيه الطوارئ. حاول مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          size="lg"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          تنبيه طوارئ
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <span>تأكيد إرسال تنبيه الطوارئ</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            هل أنت متأكد من إرسال تنبيه الطوارئ؟
            <br />
            سيتم إرسال إشعار فوري للعائلة والطبيب المعالج مع موقعك الحالي.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <Phone className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">سيتم إرسال التنبيه إلى:</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• فرد العائلة المسجل</li>
            <li>• الطبيب المعالج</li>
          </ul>
          
          <div className="flex items-center space-x-2 mt-3">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">معلومات إضافية:</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• الموقع الجغرافي الحالي</li>
            <li>• معدل النبض: {currentHeartRate || 'غير متاح'}</li>
            <li>• الوقت والتاريخ</li>
          </ul>
        </div>

        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEmergencyAlert}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال التنبيه'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmergencyButton;
