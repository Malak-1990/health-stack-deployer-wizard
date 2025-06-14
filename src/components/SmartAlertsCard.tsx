
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { smartAlertService, SmartAlert } from '@/services/SmartAlertService';
import { AlertTriangle, CheckCircle, Clock, XCircle, Bell, Heart, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SmartAlertsCard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadAlerts();
      loadUnreadCount();
      
      // إعداد الاستماع للتنبيهات الجديدة
      const channel = smartAlertService.subscribeToAlerts(user.id, (newAlert) => {
        setAlerts(prev => [newAlert, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        if (newAlert.severity === 'critical') {
          setCriticalCount(prev => prev + 1);
          playUrgentAlertSound();
        } else if (newAlert.severity === 'high') {
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
    
    // Count critical alerts
    const critical = userAlerts.filter(alert => 
      alert.severity === 'critical' && !alert.resolved_at
    ).length;
    setCriticalCount(critical);
    
    setLoading(false);
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    const count = await smartAlertService.getUnreadAlertsCount(user.id);
    setUnreadCount(count);
  };

  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  };

  const playUrgentAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Play 3 urgent beeps
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 300);
      }
    } catch (error) {
      console.error('Error playing urgent alert sound:', error);
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
    
    // Update critical count
    const alert = alerts.find(a => a.id === alertId);
    if (alert?.severity === 'critical') {
      setCriticalCount(prev => Math.max(0, prev - 1));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getSeverityIcon = (severity: string, alertType: string) => {
    if (alertType.includes('heart')) {
      return <Heart className="h-4 w-4" />;
    }
    if (alertType.includes('blood')) {
      return <Activity className="h-4 w-4" />;
    }
    
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

  const getAlertTypeIcon = (alertType: string) => {
    if (alertType.includes('high') || alertType.includes('tachycardia')) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    if (alertType.includes('low') || alertType.includes('bradycardia')) {
      return <TrendingDown className="h-4 w-4 text-blue-500" />;
    }
    return <Activity className="h-4 w-4" />;
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
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
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
            {criticalCount > 0 && (
              <div className="mr-2 animate-bounce">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="animate-pulse font-bold">
                {criticalCount} حرج
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge variant="secondary">
                {unreadCount} غير مقروء
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criticalCount > 0 && (
          <Alert className="mb-4 border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800 font-medium">
              لديك {criticalCount} تنبيه حرج يتطلب انتباهاً فورياً!
            </AlertDescription>
          </Alert>
        )}

        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد تنبيهات</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.slice(0, 15).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  !alert.is_read ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                } ${alert.resolved_at ? 'opacity-60' : ''} ${
                  alert.severity === 'critical' ? 'ring-4 ring-red-300 animate-pulse shadow-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getSeverityColor(alert.severity)} border-2`}>
                        {getSeverityIcon(alert.severity, alert.alert_type)}
                        <span className="mr-1 font-bold">
                          {getSeverityText(alert.severity)}
                        </span>
                      </Badge>
                      {getAlertTypeIcon(alert.alert_type)}
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(alert.created_at).toLocaleString('ar-EG')}
                      </span>
                      {alert.triggered_value && alert.threshold_value && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {alert.triggered_value} / {alert.threshold_value}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 mb-2 font-medium">{alert.message}</p>
                    
                    {alert.data?.recommendations && (
                      <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                        <strong>التوصيات:</strong>
                        <ul className="mt-1 space-y-1">
                          {alert.data.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-xs px-2"
                      >
                        قراءة
                      </Button>
                    )}
                    {!alert.resolved_at && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="text-xs px-2 border-green-300 text-green-600 hover:bg-green-50"
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
