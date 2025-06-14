import { locationService, LocationData } from './LocationService';
import { supabase } from '@/integrations/supabase/client';

export interface EmergencyAlert {
  patientId: string;
  patientName: string;
  timestamp: Date;
  location: LocationData;
  heartRate?: number;
  message: string;
  severity: 'critical' | 'high' | 'medium';
}

class EmergencyAlertService {
  private audioContext: AudioContext | null = null;
  private isPlayingAlert = false;

  async sendEmergencyAlert(patientData: {
    id: string;
    name: string;
    heartRate?: number;
  }): Promise<void> {
    try {
      // Get current location
      const location = await locationService.getCurrentLocation();
      
      const alert: EmergencyAlert = {
        patientId: patientData.id,
        patientName: patientData.name,
        timestamp: new Date(),
        location,
        heartRate: patientData.heartRate,
        message: '🚨 تنبيه طوارئ: المريض بحاجة لمساعدة فورية',
        severity: 'critical'
      };

      // Store alert in database
      await this.storeEmergencyAlert(alert);

      // Send to family and doctor
      await this.notifyContacts(alert);
      
      // Play emergency sound sequence
      await this.playAdvancedEmergencySound();

      // Send real-time notification via Supabase
      await this.sendRealTimeAlert(alert);

      console.log('Emergency alert sent successfully:', alert);
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      throw error;
    }
  }

  private async storeEmergencyAlert(alert: EmergencyAlert): Promise<void> {
    try {
      const { error } = await supabase
        .from('smart_alerts')
        .insert({
          user_id: alert.patientId,
          alert_type: 'emergency',
          severity: alert.severity,
          message: alert.message,
          data: {
            location: {
              latitude: alert.location.latitude,
              longitude: alert.location.longitude,
              accuracy: alert.location.accuracy,
              timestamp: alert.location.timestamp
            },
            heart_rate: alert.heartRate,
            timestamp: alert.timestamp.toISOString(),
            emergency_type: 'user_triggered'
          }
        });

      if (error) {
        console.error('Error storing emergency alert:', error);
      }
    } catch (error) {
      console.error('Error storing emergency alert:', error);
    }
  }

  private async sendRealTimeAlert(alert: EmergencyAlert): Promise<void> {
    try {
      // Send real-time notification via Supabase Realtime
      const channel = supabase.channel('emergency-alerts');
      
      await channel.send({
        type: 'broadcast',
        event: 'emergency',
        payload: {
          patient_id: alert.patientId,
          patient_name: alert.patientName,
          message: alert.message,
          location: alert.location,
          heart_rate: alert.heartRate,
          timestamp: alert.timestamp.toISOString(),
          severity: alert.severity
        }
      });

      console.log('Real-time emergency alert sent');
    } catch (error) {
      console.error('Error sending real-time alert:', error);
    }
  }

  private async notifyContacts(alert: EmergencyAlert): Promise<void> {
    const locationUrl = locationService.getLocationUrl(alert.location);
    
    const message = `
🚨 تنبيه طوارئ عاجل 🚨
المريض: ${alert.patientName}
الوقت: ${alert.timestamp.toLocaleString('ar-EG')}
معدل النبض: ${alert.heartRate || 'غير متاح'} نبضة/دقيقة
الموقع: ${locationUrl}
الرسالة: ${alert.message}

يرجى التحقق من حالة المريض فوراً!
    `;

    console.log('Sending emergency notification:', message);
    
    // في التطبيق الحقيقي، هنا سيتم الإرسال عبر:
    // - SMS (Twilio)
    // - Email (SendGrid)
    // - Push Notifications
    // - Emergency Services API
  }

  private async playAdvancedEmergencySound(): Promise<void> {
    if (this.isPlayingAlert) return;
    
    try {
      this.isPlayingAlert = true;
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Play emergency siren pattern
      for (let i = 0; i < 6; i++) {
        await this.playTone(800, 0.3, 0.4);
        await this.wait(100);
        await this.playTone(1200, 0.3, 0.4);
        await this.wait(100);
      }
      
      // Play urgent beeps
      for (let i = 0; i < 10; i++) {
        await this.playTone(1500, 0.8, 0.1);
        await this.wait(150);
      }
      
    } catch (error) {
      console.error('Error playing emergency sound:', error);
    } finally {
      this.isPlayingAlert = false;
    }
  }

  private async playTone(frequency: number, volume: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext) return resolve();
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
      setTimeout(resolve, duration * 1000);
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopEmergencySound(): void {
    this.isPlayingAlert = false;
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  // للأطباء والعائلة - استقبال التنبيهات
  subscribeToEmergencyAlerts(callback: (alert: EmergencyAlert) => void) {
    const channel = supabase.channel('emergency-alerts');
    
    channel.on('broadcast', { event: 'emergency' }, (payload) => {
      const alert: EmergencyAlert = {
        patientId: payload.payload.patient_id,
        patientName: payload.payload.patient_name,
        timestamp: new Date(payload.payload.timestamp),
        location: payload.payload.location,
        heartRate: payload.payload.heart_rate,
        message: payload.payload.message,
        severity: payload.payload.severity
      };
      
      callback(alert);
      this.playAdvancedEmergencySound();
    });
    
    channel.subscribe();
    return channel;
  }
}

export const emergencyAlertService = new EmergencyAlertService();
