import { supabase } from '@/integrations/supabase/client';
import { emergencyAlertService } from './EmergencyAlertService';

export interface SmartAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggered_value?: number;
  threshold_value?: number;
  data?: any;
  is_read: boolean;
  created_at: string;
  resolved_at?: string;
}

class SmartAlertService {
  async analyzeHeartRateData(heartRate: number, userId: string): Promise<void> {
    let alertType = '';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let message = '';
    let triggeredValue = heartRate;
    let thresholdValue = 0;

    // تحليل دقيق لمعدل ضربات القلب
    if (heartRate < 40) {
      alertType = 'severe_bradycardia';
      severity = 'critical';
      message = `خطر: معدل ضربات القلب منخفض جداً وخطير: ${heartRate} نبضة/دقيقة. يتطلب تدخل طبي فوري!`;
      thresholdValue = 40;
    } else if (heartRate < 50) {
      alertType = 'bradycardia';
      severity = 'high';
      message = `تحذير: معدل ضربات القلب منخفض: ${heartRate} نبضة/دقيقة`;
      thresholdValue = 50;
    } else if (heartRate < 60) {
      alertType = 'low_heart_rate';
      severity = 'medium';
      message = `تنبيه: معدل ضربات القلب أقل من الطبيعي: ${heartRate} نبضة/دقيقة`;
      thresholdValue = 60;
    } else if (heartRate > 180) {
      alertType = 'severe_tachycardia';
      severity = 'critical';
      message = `خطر: معدل ضربات القلب مرتفع جداً وخطير: ${heartRate} نبضة/دقيقة. يتطلب تدخل طبي فوري!`;
      thresholdValue = 180;
    } else if (heartRate > 150) {
      alertType = 'tachycardia';
      severity = 'high';
      message = `تحذير: معدل ضربات القلب مرتفع جداً: ${heartRate} نبضة/دقيقة`;
      thresholdValue = 150;
    } else if (heartRate > 120) {
      alertType = 'high_heart_rate';
      severity = 'medium';
      message = `تنبيه: معدل ضربات القلب مرتفع: ${heartRate} نبضة/دقيقة`;
      thresholdValue = 120;
    }

    if (alertType) {
      await this.createAlert({
        user_id: userId,
        alert_type: alertType,
        severity,
        message,
        triggered_value: triggeredValue,
        threshold_value: thresholdValue,
        data: { 
          heart_rate: heartRate, 
          timestamp: new Date().toISOString(),
          analysis: this.getHeartRateAnalysis(heartRate),
          recommendations: this.getHeartRateRecommendations(heartRate, severity)
        }
      });

      // إرسال تنبيه طوارئ للحالات الحرجة
      if (severity === 'critical') {
        await emergencyAlertService.sendEmergencyAlert({
          id: userId,
          name: 'المريض',
          heartRate
        });
      }
    }
  }

  async analyzeBloodPressureData(systolic: number, diastolic: number, userId: string): Promise<void> {
    let alertType = '';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let message = '';

    // تحليل دقيق لضغط الدم
    if (systolic >= 200 || diastolic >= 130) {
      alertType = 'hypertensive_emergency';
      severity = 'critical';
      message = `خطر شديد: أزمة ارتفاع ضغط الدم: ${systolic}/${diastolic} ملم زئبق. يتطلب علاج طبي فوري!`;
    } else if (systolic >= 180 || diastolic >= 120) {
      alertType = 'hypertensive_crisis';
      severity = 'critical';
      message = `خطر: أزمة ارتفاع ضغط الدم: ${systolic}/${diastolic} ملم زئبق. اطلب المساعدة الطبية فوراً!`;
    } else if (systolic >= 160 || diastolic >= 100) {
      alertType = 'severe_hypertension';
      severity = 'high';
      message = `تحذير: ارتفاع شديد في ضغط الدم: ${systolic}/${diastolic} ملم زئبق`;
    } else if (systolic >= 140 || diastolic >= 90) {
      alertType = 'high_blood_pressure';
      severity = 'medium';
      message = `تنبيه: ارتفاع في ضغط الدم: ${systolic}/${diastolic} ملم زئبق`;
    } else if (systolic < 80 || diastolic < 50) {
      alertType = 'severe_hypotension';
      severity = 'high';
      message = `تحذير: انخفاض شديد في ضغط الدم: ${systolic}/${diastolic} ملم زئبق`;
    } else if (systolic < 90 || diastolic < 60) {
      alertType = 'low_blood_pressure';
      severity = 'medium';
      message = `تنبيه: انخفاض في ضغط الدم: ${systolic}/${diastolic} ملم زئبق`;
    }

    if (alertType) {
      await this.createAlert({
        user_id: userId,
        alert_type: alertType,
        severity,
        message,
        triggered_value: systolic,
        threshold_value: alertType.includes('high') ? 140 : 90,
        data: { 
          systolic, 
          diastolic, 
          timestamp: new Date().toISOString(),
          classification: this.getBloodPressureClassification(systolic, diastolic),
          recommendations: this.getBloodPressureRecommendations(systolic, diastolic, severity)
        }
      });

      if (severity === 'critical') {
        await emergencyAlertService.sendEmergencyAlert({
          id: userId,
          name: 'المريض'
        });
      }
    }
  }

  private getHeartRateAnalysis(heartRate: number): string {
    if (heartRate < 40) return 'بطء شديد وخطير في القلب (Severe Bradycardia)';
    if (heartRate < 50) return 'بطء في القلب (Bradycardia)';
    if (heartRate < 60) return 'معدل أقل من الطبيعي';
    if (heartRate <= 100) return 'معدل طبيعي';
    if (heartRate <= 120) return 'معدل مرتفع قليلاً';
    if (heartRate <= 150) return 'تسارع في القلب (Tachycardia)';
    if (heartRate <= 180) return 'تسارع شديد في القلب';
    return 'تسارع خطير جداً في القلب';
  }

  private getHeartRateRecommendations(heartRate: number, severity: string): string[] {
    const recommendations = [];
    
    if (severity === 'critical') {
      recommendations.push('اطلب المساعدة الطبية الطارئة فوراً');
      recommendations.push('لا تقم بأي نشاط بدني');
      recommendations.push('ابق في وضعية مريحة');
    } else if (severity === 'high') {
      recommendations.push('استشر طبيبك اليوم');
      recommendations.push('تجنب الكافيين والمجهود الشديد');
      recommendations.push('راقب الأعراض بعناية');
    } else if (severity === 'medium') {
      recommendations.push('احجز موعداً مع طبيبك');
      recommendations.push('مارس الاسترخاء والتنفس العميق');
      recommendations.push('تجنب التوتر والضغط النفسي');
    }
    
    return recommendations;
  }

  private getBloodPressureClassification(systolic: number, diastolic: number): string {
    if (systolic >= 200 || diastolic >= 130) return 'طوارئ ارتفاع ضغط الدم';
    if (systolic >= 180 || diastolic >= 120) return 'أزمة ارتفاع ضغط الدم';
    if (systolic >= 160 || diastolic >= 100) return 'ارتفاع شديد في ضغط الدم';
    if (systolic >= 140 || diastolic >= 90) return 'ارتفاع في ضغط الدم';
    if (systolic >= 130 || diastolic >= 80) return 'ارتفاع حدي في ضغط الدم';
    if (systolic >= 120 && diastolic < 80) return 'ضغط دم مرتفع قليلاً';
    if (systolic < 90 || diastolic < 60) return 'انخفاض في ضغط الدم';
    return 'ضغط دم طبيعي';
  }

  private getBloodPressureRecommendations(systolic: number, diastolic: number, severity: string): string[] {
    const recommendations = [];
    
    if (severity === 'critical') {
      recommendations.push('اطلب المساعدة الطبية الطارئة فوراً');
      recommendations.push('لا تقم بأي نشاط حتى وصول المساعدة');
      recommendations.push('ارقد في وضع مريح');
    } else if (severity === 'high') {
      recommendations.push('استشر طبيبك في أقرب وقت');
      recommendations.push('قلل من تناول الملح');
      recommendations.push('مارس الاسترخاء');
    } else if (severity === 'medium') {
      recommendations.push('احجز موعداً مع طبيبك');
      recommendations.push('اتبع نظاماً غذائياً صحياً');
      recommendations.push('مارس الرياضة الخفيفة');
    }
    
    return recommendations;
  }

  async createAlert(alertData: Omit<SmartAlert, 'id' | 'is_read' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('smart_alerts')
        .insert([alertData]);

      if (error) {
        console.error('Error creating alert:', error);
      } else {
        console.log('Smart alert created successfully');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  async getUserAlerts(userId: string): Promise<SmartAlert[]> {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }

      return (data || []).map(alert => ({
        ...alert,
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical'
      }));
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  async getUnreadAlertsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('smart_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .is('resolved_at', null);

      if (error) {
        console.error('Error fetching unread alerts count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching unread alerts count:', error);
      return 0;
    }
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('smart_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) {
        console.error('Error marking alert as read:', error);
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('smart_alerts')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) {
        console.error('Error resolving alert:', error);
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  }

  async getCriticalAlerts(userId: string): Promise<SmartAlert[]> {
    try {
      const { data, error } = await supabase
        .from('smart_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('severity', 'critical')
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching critical alerts:', error);
        return [];
      }

      return (data || []).map(alert => ({
        ...alert,
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical'
      }));
    } catch (error) {
      console.error('Error fetching critical alerts:', error);
      return [];
    }
  }

  subscribeToAlerts(userId: string, callback: (alert: SmartAlert) => void) {
    const channel = supabase
      .channel('smart-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'smart_alerts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New alert received:', payload);
          const alert = payload.new as SmartAlert;
          alert.severity = alert.severity as 'low' | 'medium' | 'high' | 'critical';
          callback(alert);
        }
      )
      .subscribe();

    return channel;
  }
}

export const smartAlertService = new SmartAlertService();
