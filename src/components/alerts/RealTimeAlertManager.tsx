
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { smartAlertService, SmartAlert } from '@/services/SmartAlertService';
import { emergencyAlertService } from '@/services/EmergencyAlertService';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const RealTimeAlertManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState<SmartAlert[]>([]);

  useEffect(() => {
    if (!user) return;

    // تحميل التنبيهات الحرجة الحالية
    loadCriticalAlerts();

    // إعداد الاستماع للتنبيهات الجديدة
    const channel = smartAlertService.subscribeToAlerts(user.id, (newAlert) => {
      handleNewAlert(newAlert);
    });

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [user]);

  const loadCriticalAlerts = async () => {
    if (!user) return;
    const alerts = await smartAlertService.getCriticalAlerts(user.id);
    setCriticalAlerts(alerts);
  };

  const handleNewAlert = (alert: SmartAlert) => {
    console.log('Processing new alert:', alert);
    
    // إضافة التنبيه للقائمة إذا كان حرجاً
    if (alert.severity === 'critical') {
      setCriticalAlerts(prev => [alert, ...prev]);
    }

    // عرض إشعار Toast
    toast({
      title: getSeverityTitle(alert.severity),
      description: alert.message,
      variant: alert.severity === 'critical' ? 'destructive' : 'default',
      duration: alert.severity === 'critical' ? 10000 : 5000,
    });

    // تشغيل الصوت للحالات الحرجة
    if (alert.severity === 'critical' && isAudioEnabled) {
      playAlertSound();
    }

    // إرسال تنبيه الطوارئ مع الموقع للحالات الحرجة
    if (alert.severity === 'critical') {
      handleCriticalAlert(alert);
    }
  };

  const getSeverityTitle = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨 تنبيه حرج';
      case 'high': return '⚠️ تنبيه عالي';
      case 'medium': return '⚡ تنبيه متوسط';
      default: return 'ℹ️ تنبيه';
    }
  };

  const playAlertSound = async () => {
    try {
      // إنشاء سياق صوتي
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // تكرار الصوت 3 مرات للحالات الحرجة
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // ضبط تردد الصوت (صوت صفارة إنذار)
        const startTime = audioContext.currentTime + (i * 0.8);
        oscillator.frequency.setValueAtTime(880, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(1320, startTime + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(880, startTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.7);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.7);
      }
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  };

  const handleCriticalAlert = async (alert: SmartAlert) => {
    if (!user) return;

    try {
      // إرسال تنبيه طوارئ مع الموقع
      await emergencyAlertService.sendEmergencyAlert({
        id: user.id,
        name: user.email || 'مريض',
        heartRate: alert.data?.heart_rate
      });
    } catch (error) {
      console.error('Error sending emergency alert:', error);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? 'تم إيقاف الصوت' : 'تم تفعيل الصوت',
      description: isAudioEnabled ? 'لن يتم تشغيل أصوات التنبيه' : 'سيتم تشغيل أصوات التنبيه',
    });
  };

  const handleResolveAlert = async (alertId: string) => {
    await smartAlertService.resolveAlert(alertId);
    setCriticalAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: 'تم حل التنبيه',
      description: 'تم وضع علامة على التنبيه كمحلول',
    });
  };

  if (criticalAlerts.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAudio}
          className={`${isAudioEnabled ? 'text-green-600' : 'text-gray-400'}`}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {/* أزرار التحكم */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAudio}
          className={`${isAudioEnabled ? 'text-green-600' : 'text-gray-400'}`}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      {/* التنبيهات الحرجة */}
      {criticalAlerts.slice(0, 3).map((alert) => (
        <Card key={alert.id} className="bg-red-50 border-red-200 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 animate-bounce" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  تنبيه حرج
                </p>
                <p className="text-xs text-red-700 mt-1">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.created_at).toLocaleTimeString('ar-EG')}
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResolveAlert(alert.id)}
                className="text-xs"
              >
                حل
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RealTimeAlertManager;
