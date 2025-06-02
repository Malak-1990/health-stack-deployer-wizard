
import { supabase } from '@/integrations/supabase/client';
import { emergencyAlertService } from './EmergencyAlertService';

export interface SmartAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
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

    // تحليل معدل ضربات القلب
    if (heartRate < 50) {
      alertType = 'bradycardia';
      severity = heartRate < 40 ? 'critical' : 'high';
      message = `معدل ضربات القلب منخفض جداً: ${heartRate} نبضة/دقيقة`;
    } else if (heartRate > 120) {
      alertType = 'tachycardia';
      severity = heartRate > 150 ? 'critical' : 'high';
      message = `معدل ضربات القلب مرتفع جداً: ${heartRate} نبضة/دقيقة`;
    } else if (heartRate < 60) {
      alertType = 'low_heart_rate';
      severity = 'medium';
      message = `معدل ضربات القلب منخفض: ${heartRate} نبضة/دقيقة`;
    } else if (heartRate > 100) {
      alertType = 'high_heart_rate';
      severity = 'medium';
      message = `معدل ضربات القلب مرتفع: ${heartRate} نبضة/دقيقة`;
    }

    if (alertType) {
      await this.createAlert({
        user_id: userId,
        alert_type: alertType,
        severity,
        message,
        data: { heart_rate: heartRate, timestamp: new Date().toISOString() }
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

  async createAlert(alertData: Omit<SmartAlert, 'id' | 'is_read' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('smart_alerts')
        .insert([alertData]);

      if (error) {
        console.error('Error creating alert:', error);
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

      return data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
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
}

export const smartAlertService = new SmartAlertService();
