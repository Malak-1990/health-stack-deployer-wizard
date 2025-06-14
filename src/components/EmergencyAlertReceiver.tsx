
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone, Heart, Clock, User, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { emergencyAlertService, EmergencyAlert } from '@/services/EmergencyAlertService';
import { useToast } from '@/hooks/use-toast';

const EmergencyAlertReceiver = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to emergency alerts
    const channel = emergencyAlertService.subscribeToEmergencyAlerts((alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 10)); // Keep last 10 alerts
      
      // Show urgent toast notification
      toast({
        title: '🚨 تنبيه طوارئ عاجل',
        description: `${alert.patientName} بحاجة لمساعدة فورية`,
        variant: 'destructive',
      });
    });

    setIsListening(true);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      emergencyAlertService.stopEmergencySound();
      setIsListening(false);
    };
  }, [toast]);

  const dismissAlert = (alertIndex: number) => {
    setAlerts(prev => prev.filter((_, index) => index !== alertIndex));
    if (alerts.length === 1) {
      emergencyAlertService.stopEmergencySound();
    }
  };

  const callEmergency = (alert: EmergencyAlert) => {
    // في التطبيق الحقيقي، هذا سيبدأ مكالمة حقيقية
    window.alert(`جاري الاتصال بخدمات الطوارئ للمريض: ${alert.patientName}`);
  };

  const openLocation = (alert: EmergencyAlert) => {
    const locationUrl = `https://maps.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`;
    window.open(locationUrl, '_blank');
  };

  if (!isListening && alerts.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            مراقب التنبيهات الطارئة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center">في انتظار التنبيهات...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Indicator */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">متصل - مراقبة التنبيهات الطارئة</span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alerts */}
      {alerts.map((alert, index) => (
        <Alert key={index} className="border-red-500 bg-red-50 shadow-lg">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <AlertTitle className="text-red-800 font-bold text-lg">
            🚨 تنبيه طوارئ عاجل - {alert.patientName}
          </AlertTitle>
          <AlertDescription className="text-red-700">
            <div className="space-y-4 mt-3">
              <p className="text-base font-medium">{alert.message}</p>
              
              {/* Patient Info */}
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    <strong>المريض:</strong> {alert.patientName}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-600" />
                    <strong>الوقت:</strong> {alert.timestamp.toLocaleString('ar-EG')}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-600" />
                    <strong>معدل النبض:</strong> {alert.heartRate || 'غير متاح'} نبضة/دقيقة
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                    <strong>مستوى الخطورة:</strong> {
                      alert.severity === 'critical' ? 'حرج' :
                      alert.severity === 'high' ? 'عالي' : 'متوسط'
                    }
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <Button 
                  variant="link" 
                  onClick={() => openLocation(alert)}
                  className="text-blue-600 underline p-0 h-auto"
                >
                  عرض الموقع على الخريطة
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  onClick={() => callEmergency(alert)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  اتصال طوارئ
                </Button>
                <Button 
                  onClick={() => openLocation(alert)}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  الذهاب للموقع
                </Button>
                <Button 
                  onClick={() => dismissAlert(index)}
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  تم الاستلام
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default EmergencyAlertReceiver;
