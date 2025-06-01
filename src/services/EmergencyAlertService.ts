
import { locationService, LocationData } from './LocationService';

export interface EmergencyAlert {
  patientId: string;
  patientName: string;
  timestamp: Date;
  location: LocationData;
  heartRate?: number;
  message: string;
}

class EmergencyAlertService {
  private audioContext: AudioContext | null = null;

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
        message: 'تنبيه طوارئ: المريض بحاجة لمساعدة فورية'
      };

      // Send to family and doctor (mock implementation)
      await this.notifyContacts(alert);
      
      // Play emergency sound
      await this.playEmergencySound();

      console.log('Emergency alert sent:', alert);
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      throw error;
    }
  }

  private async notifyContacts(alert: EmergencyAlert): Promise<void> {
    // In a real implementation, this would send notifications via API
    // For now, we'll simulate the notification
    const locationUrl = locationService.getLocationUrl(alert.location);
    
    const message = `
🚨 تنبيه طوارئ 🚨
المريض: ${alert.patientName}
الوقت: ${alert.timestamp.toLocaleString('ar-EG')}
معدل النبض: ${alert.heartRate || 'غير متاح'} نبضة/دقيقة
الموقع: ${locationUrl}
الرسالة: ${alert.message}
    `;

    // Simulate API call to send notifications
    console.log('Sending emergency notification:', message);
    
    // In real implementation, you would call your backend API here
    // await fetch('/api/emergency-alert', { method: 'POST', body: JSON.stringify(alert) });
  }

  private async playEmergencySound(): Promise<void> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for emergency sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Configure emergency siren sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.5);
      oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 1);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 2);
      
      // Repeat the sound 3 times
      setTimeout(() => this.playEmergencySound(), 2200);
    } catch (error) {
      console.error('Error playing emergency sound:', error);
    }
  }

  stopEmergencySound(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const emergencyAlertService = new EmergencyAlertService();
