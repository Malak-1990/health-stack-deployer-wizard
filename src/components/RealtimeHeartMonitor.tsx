
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface HeartRateReading {
  id: string;
  user_id: string;
  heart_rate: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  recorded_at: string;
  notes?: string;
}

interface SmartAlert {
  id: string;
  user_id: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  is_read: boolean;
}

const RealtimeHeartMonitor: React.FC = () => {
  const { user } = useAuth();
  const [heartReadings, setHeartReadings] = useState<HeartRateReading[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError('يرجى تسجيل الدخول لعرض البيانات.');
      setLoading(false);
      return;
    }

    const userId = user.id;

    // جلب البيانات الأولية عند تحميل المكون
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // جلب آخر 10 قراءات للقلب
        const { data: initialReadings, error: readingsError } = await supabase
          .from('heart_rate_readings')
          .select('*')
          .eq('user_id', userId)
          .order('recorded_at', { ascending: false })
          .limit(10);

        if (readingsError) throw readingsError;
        const transformedReadings = (initialReadings || []).map(reading => ({
          ...reading,
          systolic_bp: reading.systolic_bp ?? undefined,
          diastolic_bp: reading.diastolic_bp ?? undefined,
          notes: reading.notes ?? undefined,
          encrypted_notes: reading.encrypted_notes ?? undefined
        }));
        setHeartReadings(transformedReadings);

        // جلب آخر 10 تنبيهات ذكية (غير مقروءة)
        const { data: initialAlerts, error: alertsError } = await supabase
          .from('smart_alerts')
          .select('*')
          .eq('user_id', userId)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(10);

        if (alertsError) throw alertsError;
        
        // Type cast the severity field to match our interface
        const typedAlerts = (initialAlerts || []).map(alert => ({
          ...alert,
          severity: alert.severity as 'low' | 'medium' | 'high' | 'critical'
        }));
        setSmartAlerts(typedAlerts);

      } catch (err: any) {
        console.error('Error fetching initial data:', err.message);
        setError(`فشل جلب البيانات الأولية: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // إعداد مستمعي Realtime لتحديث البيانات فوراً
    // قناة لقراءات القلب
    const heartReadingsChannel = supabase
      .channel(`heart_readings_for_${userId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'heart_rate_readings', 
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          console.log('Realtime Heart Reading Insert:', payload);
          setHeartReadings((prevReadings) => [
            payload.new as HeartRateReading, 
            ...prevReadings.slice(0, 9)
          ]);
        }
      )
      .subscribe();

    // قناة للتنبيهات الذكية
    const smartAlertsChannel = supabase
      .channel(`smart_alerts_for_${userId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'smart_alerts', 
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          console.log('Realtime Smart Alert Insert:', payload);
          const newAlert = {
            ...payload.new,
            severity: payload.new.severity as 'low' | 'medium' | 'high' | 'critical'
          } as SmartAlert;
          
          setSmartAlerts((prevAlerts) => [newAlert, ...prevAlerts]);

          // تشغيل صوت تنبيه للحالات الحرجة
          if (newAlert.severity === 'critical') {
            console.warn('تنبيه حرج جديد!');
            // يمكن إضافة صوت تنبيه هنا
            try {
              const audio = new Audio();
              audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiSG0/DXgSwGIIHM8tuOOghGquC1om0eCD2X1/LNeSsFJHfH8N2QQAoUXrTp66hVFA==';
              audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (e) {
              console.log('Audio creation failed:', e);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'smart_alerts', 
          filter: `user_id=eq.${userId}` 
        },
        (payload) => {
          console.log('Realtime Smart Alert Update:', payload);
          const updatedAlert = {
            ...payload.new,
            severity: payload.new.severity as 'low' | 'medium' | 'high' | 'critical'
          } as SmartAlert;
          
          setSmartAlerts((prevAlerts) =>
            prevAlerts.map((alert) =>
              alert.id === payload.old.id ? updatedAlert : alert
            )
          );
        }
      )
      .subscribe();

    // تنظيف الاشتراك عند إزالة المكون
    return () => {
      supabase.removeChannel(heartReadingsChannel);
      supabase.removeChannel(smartAlertsChannel);
      console.log('Realtime channels unsubscribed.');
    };
  }, [user]);

  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('smart_alerts')
        .update({ is_read: true })
        .eq('id', alertId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          الرجاء تسجيل الدخول لعرض لوحة المراقبة.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🫀 لوحة المراقبة الفورية
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* قسم قراءات القلب */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              💓 آخر قراءات القلب
              <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {heartReadings.length}
              </span>
            </h2>
            
            {heartReadings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>لا توجد قراءات قلب متاحة حتى الآن.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {heartReadings.map((reading, index) => (
                  <div 
                    key={reading.id} 
                    className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                      index === 0 ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <span className="text-lg font-bold text-red-600">
                            💗 {reading.heart_rate} نبضة/دقيقة
                          </span>
                          {reading.systolic_bp && reading.diastolic_bp && (
                            <span className="text-lg font-medium text-blue-600">
                              🩸 {reading.systolic_bp}/{reading.diastolic_bp}
                            </span>
                          )}
                        </div>
                        {reading.notes && (
                          <p className="text-sm text-gray-600 italic">
                            📝 {reading.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 text-left">
                        <div>{new Date(reading.recorded_at).toLocaleDateString('ar-EG')}</div>
                        <div>{new Date(reading.recorded_at).toLocaleTimeString('ar-EG')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* قسم التنبيهات الذكية */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              🚨 التنبيهات الذكية
              <span className="ml-2 bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                {smartAlerts.filter(alert => !alert.is_read).length} جديد
              </span>
            </h2>
            
            {smartAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">✅</div>
                <p>لا توجد تنبيهات ذكية جديدة.</p>
                <p className="text-sm mt-2">كل شيء يبدو طبيعياً!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {smartAlerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-r-4 transition-all duration-300 ${
                      alert.severity === 'critical' 
                        ? 'bg-red-50 border-red-500 ring-2 ring-red-200' 
                        : alert.severity === 'high' 
                        ? 'bg-orange-50 border-orange-500' 
                        : alert.severity === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    } ${!alert.is_read ? 'ring-2 ring-opacity-50' : 'opacity-75'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`text-lg font-medium ${
                          alert.severity === 'critical' ? 'text-red-700' :
                          alert.severity === 'high' ? 'text-orange-700' :
                          alert.severity === 'medium' ? 'text-yellow-700' :
                          'text-blue-700'
                        }`}>
                          {alert.severity === 'critical' ? '🚨' :
                           alert.severity === 'high' ? '⚠️' :
                           alert.severity === 'medium' ? '🔔' : 'ℹ️'}
                          {alert.alert_type}
                        </span>
                        {!alert.is_read && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            جديد
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 text-left">
                        <div>{new Date(alert.created_at).toLocaleDateString('ar-EG')}</div>
                        <div>{new Date(alert.created_at).toLocaleTimeString('ar-EG')}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {alert.message}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                        alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        الشدة: {alert.severity}
                      </span>
                      
                      {!alert.is_read && (
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200 flex items-center space-x-1 space-x-reverse"
                          onClick={() => markAlertAsRead(alert.id)}
                        >
                          <span>✓</span>
                          <span>وضع علامة كمقروء</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeHeartMonitor;
