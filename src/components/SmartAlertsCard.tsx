
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { smartAlertService, SmartAlert } from '@/services/SmartAlertService';
import { Alert, CheckCircle, Clock, XCircle } from 'lucide-react';

const SmartAlertsCard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;
    
    setLoading(true);
    const userAlerts = await smartAlertService.getUserAlerts(user.id);
    setAlerts(userAlerts);
    setLoading(false);
  };

  const handleMarkAsRead = async (alertId: string) => {
    await smartAlertService.markAlertAsRead(alertId);
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, is_read: true } : alert
    ));
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
      case 'high': return <Alert className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Alert className="h-5 w-5 mr-2" />
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
            <Alert className="h-5 w-5 mr-2" />
            التنبيهات الذكية
          </div>
          {unreadAlerts.length > 0 && (
            <Badge variant="destructive">{unreadAlerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">لا توجد تنبيهات</p>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  !alert.is_read ? 'bg-blue-50' : 'bg-gray-50'
                } ${alert.resolved_at ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getSeverityIcon(alert.severity)}
                        <span className="mr-1">
                          {alert.severity === 'critical' ? 'حرج' :
                           alert.severity === 'high' ? 'عالي' :
                           alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString('ar-EG')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                  <div className="flex space-x-1">
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        قراءة
                      </Button>
                    )}
                    {!alert.resolved_at && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
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
