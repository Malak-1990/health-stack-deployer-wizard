
import { supabase } from '@/integrations/supabase/client';
import { EncryptionService } from './EncryptionService';
import { smartAlertService } from './SmartAlertService';

interface HeartRateReading {
  heartRate: number;
  systolicBP?: number;
  diastolicBP?: number;
  notes?: string;
  recordedAt?: string;
}

interface HeartRateStats {
  average: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
  totalReadings: number;
  lastReading?: number;
  lastReadingTime?: string;
}

class HeartRateDataService {
  async saveHeartRateReading(reading: HeartRateReading): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // تشفير الملاحظات إذا كانت موجودة
      const encryptedNotes = reading.notes 
        ? EncryptionService.encryptNotes(reading.notes)
        : null;

      const { error } = await supabase
        .from('heart_rate_readings')
        .insert([{
          user_id: user.id,
          heart_rate: reading.heartRate,
          systolic_bp: reading.systolicBP || null,
          diastolic_bp: reading.diastolicBP || null,
          notes: reading.notes || null,
          encrypted_notes: encryptedNotes,
          recorded_at: reading.recordedAt || new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving heart rate reading:', error);
        return false;
      }

      // تحليل البيانات للتنبيهات الذكية
      await smartAlertService.analyzeHeartRateData(reading.heartRate, user.id);
      
      // تحليل ضغط الدم إذا كان متاحاً
      if (reading.systolicBP && reading.diastolicBP) {
        await smartAlertService.analyzeBloodPressureData(
          reading.systolicBP, 
          reading.diastolicBP, 
          user.id
        );
      }

      return true;
    } catch (error) {
      console.error('Error saving heart rate reading:', error);
      return false;
    }
  }

  async getHeartRateReadings(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('heart_rate_readings')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching heart rate readings:', error);
        return [];
      }

      // فك تشفير الملاحظات
      return (data || []).map(reading => ({
        ...reading,
        notes: reading.encrypted_notes 
          ? EncryptionService.decryptNotes(reading.encrypted_notes)
          : reading.notes
      }));
    } catch (error) {
      console.error('Error fetching heart rate readings:', error);
      return [];
    }
  }

  async getHeartRateStats(userId: string, days: number = 30): Promise<HeartRateStats> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate, recorded_at')
        .eq('user_id', userId)
        .gte('recorded_at', since.toISOString())
        .order('recorded_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return {
          average: 0,
          min: 0,
          max: 0,
          trend: 'stable',
          totalReadings: 0
        };
      }

      const heartRates = data.map(d => d.heart_rate);
      const average = Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length);
      const min = Math.min(...heartRates);
      const max = Math.max(...heartRates);

      // حساب الاتجاه
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (data.length >= 3) {
        const recent = heartRates.slice(-3);
        const older = heartRates.slice(0, 3);
        const recentAvg = recent.reduce((sum, hr) => sum + hr, 0) / recent.length;
        const olderAvg = older.reduce((sum, hr) => sum + hr, 0) / older.length;
        
        if (recentAvg > olderAvg + 5) trend = 'up';
        else if (recentAvg < olderAvg - 5) trend = 'down';
      }

      return {
        average,
        min,
        max,
        trend,
        totalReadings: data.length,
        lastReading: heartRates[heartRates.length - 1],
        lastReadingTime: data[data.length - 1].recorded_at
      };
    } catch (error) {
      console.error('Error calculating heart rate stats:', error);
      return {
        average: 0,
        min: 0,
        max: 0,
        trend: 'stable',
        totalReadings: 0
      };
    }
  }

  async getDailyAverages(userId: string, days: number = 30): Promise<{ date: string; average: number }[]> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from('heart_rate_readings')
        .select('heart_rate, recorded_at')
        .eq('user_id', userId)
        .gte('recorded_at', since.toISOString())
        .order('recorded_at', { ascending: true });

      if (error || !data) return [];

      // تجميع البيانات حسب اليوم
      const dailyData: { [key: string]: number[] } = {};
      
      data.forEach(reading => {
        const date = new Date(reading.recorded_at).toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(reading.heart_rate);
      });

      // حساب المتوسط اليومي
      return Object.entries(dailyData).map(([date, heartRates]) => ({
        date,
        average: Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length)
      }));
    } catch (error) {
      console.error('Error getting daily averages:', error);
      return [];
    }
  }
}

export const heartRateDataService = new HeartRateDataService();
