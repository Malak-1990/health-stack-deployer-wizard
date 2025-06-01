
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmergencyAlert {
  id: string;
  patientName: string;
  timestamp: Date;
  location: string;
  heartRate?: number;
  message: string;
}

const EmergencyAlertReceiver = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Simulate receiving emergency alerts
    const interval = setInterval(() => {
      // In a real app, this would be a WebSocket connection or push notification
      // For demo purposes, we'll simulate random emergency alerts
      if (Math.random() < 0.1) { // 10% chance every 10 seconds
        const mockAlert: EmergencyAlert = {
          id: Date.now().toString(),
          patientName: 'أحمد محمد',
          timestamp: new Date(),
          location: 'https://maps.google.com/maps?q=32.8872,13.1913',
          heartRate: 140,
          message: 'تنبيه طوارئ: المريض بحاجة لمساعدة فورية'
        };
        
        setAlerts(prev => [mockAlert, ...prev].slice(0, 5)); // Keep only last 5 alerts
        playEmergencySound();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const playEmergencySound = async () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      // Create a more urgent emergency sound
      for (let i = 0; i < 5; i++) {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(1000, context.currentTime + i * 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(1500, context.currentTime + i * 0.5 + 0.2);
        oscillator.frequency.exponentialRampToValueAtTime(1000, context.currentTime + i * 0.5 + 0.4);
        
        gainNode.gain.setValueAtTime(0.4, context.currentTime + i * 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + i * 0.5 + 0.4);
        
        oscillator.start(context.currentTime + i * 0.5);
        oscillator.stop(context.currentTime + i * 0.5 + 0.4);
      }
    } catch (error) {
      console.error('Error playing emergency sound:', error);
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  };

  const callEmergency = () => {
    // In a real app, this would initiate a call
    window.alert('جاري الاتصال بخدمات الطوارئ...');
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} className="border-red-500 bg-red-50 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-800 font-bold">
            🚨 تنبيه طوارئ - {alert.patientName}
          </AlertTitle>
          <AlertDescription className="text-red-700">
            <div className="space-y-2">
              <p>{alert.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>الوقت:</strong> {alert.timestamp.toLocaleString('ar-EG')}
                </div>
                <div>
                  <strong>معدل النبض:</strong> {alert.heartRate || 'غير متاح'} نبضة/دقيقة
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <a 
                  href={alert.location} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  عرض الموقع على الخريطة
                </a>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button 
                  onClick={callEmergency}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  اتصال طوارئ
                </Button>
                <Button 
                  onClick={() => dismissAlert(alert.id)}
                  variant="outline"
                  size="sm"
                >
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
