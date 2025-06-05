
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { smartAlertService, SmartAlert } from '@/services/SmartAlertService';
import { AlertTriangle, CheckCircle, Clock, XCircle, Bell } from 'lucide-react';

const SmartAlertsCard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadAlerts();
      loadUnreadCount();
      
      // إعداد الاستماع للتنبيهات الجديدة
      const channel = smartAlertService.subscribeToAlerts(user.id, (newAlert) => {
        setAlerts(prev => [newAlert, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // تشغيل صوت تنبيه للحالات الحرجة
        if (newAlert.severity === 'critical') {
          playAlertSound();
        }
      });

      return () => {
        if (channel) {
          channel.unsubscribe();
        }
      };
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;
    
    setLoading(true);
    const userAlerts = await smartAlertService.getUserAlerts(user.id);
    setAlerts(userAlerts);
    setLoading(false);
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    const count = await smartAlertService.getUnreadAlertsCount(user.id);
    setUnreadCount(count);
  };

  const playAlertSound = () => {
    try {
      const audio = new Audio();
      audio.volume = 0.8;
      
      // إنشاء صوت تنبيه باستخدام Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    await smartAlertService.markAlertAsRead(alertId);
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, is_read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleResolveAlert = async (alertId: string) => {
    await smartAlertService.resolveAlert(alertId);
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved_at: new Date().toISOString() } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'حرج';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      default: return 'منخفض';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            التنبيهات الذكية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">جاري تحميل التنبيهات...</p>
        </CardContent>
      </Card>
    );
  }

  const unreadAlerts = alerts.filter(alert => !alert.is_read && !alert.resolved_at);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved_at);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            التنبيهات الذكية
            {criticalAlerts.length > 0 && (
              <div className="mr-2 animate-pulse">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد تنبيهات</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  !alert.is_read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                } ${alert.resolved_at ? 'opacity-60' : ''} ${
                  alert.severity === 'critical' ? 'ring-2 ring-red-300 animate-pulse' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getSeverityIcon(alert.severity)}
                        <span className="mr-1">
                          {getSeverityText(alert.severity)}
                        </span>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString('ar-EG')}
                      </span>
                      {alert.triggered_value && alert.threshold_value && (
                        <span className="text-xs text-gray-600">
                          ({alert.triggered_value} / {alert.threshold_value})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    {alert.data && (
                      <div className="text-xs text-gray-500">
                        التفاصيل: {JSON.stringify(alert.data, null, 2)}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-xs"
                      >
                        قراءة
                      </Button>
                    )}
                    {!alert.resolved_at && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="text-xs"
                      >
                        حل
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartAlertsCard;
