
import { supabase } from '@/integrations/supabase/client';
import { encryptionService } from './EncryptionService';
import { smartAlertService } from './SmartAlertService';

export interface HeartRateReading {
  id: string;
  user_id: string;
  heart_rate: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  notes?: string;
  encrypted_notes?: string;
  recorded_at: string;
  created_at: string;
}

class HeartRateDataService {
  async saveHeartRateReading(data: {
    heartRate: number;
    notes?: string;
    systolicBp?: number;
    diastolicBp?: number;
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let encryptedNotes = '';
      if (data.notes) {
        encryptedNotes = await encryptionService.encryptData(data.notes);
      }

      const { error } = await supabase
        .from('heart_rate_readings')
        .insert([{
          user_id: user.id,
          heart_rate: data.heartRate,
          systolic_bp: data.systolicBp,
          diastolic_bp: data.diastolicBp,
          notes: data.notes,
          encrypted_notes: encryptedNotes
        }]);

      if (error) {
        console.error('Error saving heart rate reading:', error);
        return;
      }

      // تحليل البيانات وإنشاء تنبيهات ذكية
      await smartAlertService.analyzeHeartRateData(data.heartRate, user.id);

    } catch (error) {
      console.error('Error saving heart rate reading:', error);
    }
  }

  async getHeartRateHistory(userId: string, limit: number = 50): Promise<HeartRateReading[]> {
    try {
      const { data, error } = await supabase
        .from('heart_rate_readings')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching heart rate history:', error);
        return [];
      }

      // فك تشفير الملاحظات
      const decryptedData = await Promise.all(
        (data || []).map(async (reading) => ({
          ...reading,
          notes: reading.encrypted_notes 
            ? await encryptionService.decryptData(reading.encrypted_notes)
            : reading.notes
        }))
      );

      return decryptedData;
    } catch (error) {
      console.error('Error fetching heart rate history:', error);
      return [];
    }
  }

  async getHeartRateStats(userId: string, days: number = 7): Promise<{
    average: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate, recorded_at')
        .eq('user_id', userId)
        .gte('recorded_at', fromDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return { average: 0, min: 0, max: 0, trend: 'stable' };
      }

      const heartRates = data.map(r => r.heart_rate);
      const average = heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length;
      const min = Math.min(...heartRates);
      const max = Math.max(...heartRates);

      // حساب الاتجاه
      const firstHalf = heartRates.slice(0, Math.floor(heartRates.length / 2));
      const secondHalf = heartRates.slice(Math.floor(heartRates.length / 2));
      const firstAvg = firstHalf.reduce((sum, hr) => sum + hr, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, hr) => sum + hr, 0) / secondHalf.length;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondAvg > firstAvg + 5) trend = 'up';
      else if (secondAvg < firstAvg - 5) trend = 'down';

      return { average: Math.round(average), min, max, trend };
    } catch (error) {
      console.error('Error calculating heart rate stats:', error);
      return { average: 0, min: 0, max: 0, trend: 'stable' };
    }
  }
}

export const heartRateDataService = new HeartRateDataService();
