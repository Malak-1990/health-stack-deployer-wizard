
import CryptoJS from 'crypto-js';

class EncryptionService {
  private static readonly SECRET_KEY = process.env.NODE_ENV === 'production' 
    ? 'health-monitor-production-encryption-key-2024'
    : 'health-monitor-development-encryption-key';

  // تشفير البيانات الحساسة مع معالجة محسنة للأخطاء
  static encrypt(data: any): string {
    try {
      if (!data) return '';
      
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY).toString();
      
      // إضافة طابع زمني للتشفير
      const timestampedData = {
        data: encrypted,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      return CryptoJS.AES.encrypt(JSON.stringify(timestampedData), this.SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('فشل في تشفير البيانات');
    }
  }

  // فك تشفير البيانات مع التحقق من الصحة
  static decrypt(encryptedData: string): any {
    try {
      if (!encryptedData) return null;
      
      // فك التشفير الأولي
      const decryptedOuter = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      const outerString = decryptedOuter.toString(CryptoJS.enc.Utf8);
      
      if (!outerString) {
        throw new Error('فشل في فك التشفير الخارجي');
      }
      
      const timestampedData = JSON.parse(outerString);
      
      // التحقق من وجود البيانات المطلوبة
      if (!timestampedData.data) {
        throw new Error('بيانات التشفير غير صحيحة');
      }
      
      // فك التشفير الداخلي
      const decryptedInner = CryptoJS.AES.decrypt(timestampedData.data, this.SECRET_KEY);
      const innerString = decryptedInner.toString(CryptoJS.enc.Utf8);
      
      if (!innerString) {
        throw new Error('فشل في فك التشفير الداخلي');
      }
      
      return JSON.parse(innerString);
    } catch (error) {
      console.error('Decryption error:', error);
      // إرجاع null بدلاً من رمي خطأ للتعافي الآمن
      return null;
    }
  }

  // تشفير البيانات الصحية الحساسة مع التحقق من النوع
  static encryptHealthData(healthData: {
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    notes?: string;
    medications?: string[];
    medicalConditions?: string[];
    timestamp?: string;
  }): string {
    try {
      // إضافة معلومات إضافية للأمان
      const enhancedData = {
        ...healthData,
        encrypted_at: new Date().toISOString(),
        data_type: 'health_data',
        version: '2.0'
      };
      
      return this.encrypt(enhancedData);
    } catch (error) {
      console.error('Health data encryption error:', error);
      throw new Error('فشل في تشفير البيانات الصحية');
    }
  }

  // فك تشفير البيانات الصحية مع التحقق من النوع
  static decryptHealthData(encryptedData: string): any {
    try {
      const decryptedData = this.decrypt(encryptedData);
      
      if (!decryptedData) return null;
      
      // التحقق من نوع البيانات
      if (decryptedData.data_type !== 'health_data') {
        console.warn('نوع البيانات المشفرة غير صحيح');
      }
      
      return decryptedData;
    } catch (error) {
      console.error('Health data decryption error:', error);
      return null;
    }
  }

  // تشفير الملاحظات فقط مع معالجة محسنة
  static encryptNotes(notes: string): string {
    try {
      if (!notes || notes.trim() === '') return '';
      
      const notesData = {
        notes: notes.trim(),
        encrypted_at: new Date().toISOString(),
        data_type: 'notes'
      };
      
      return this.encrypt(notesData);
    } catch (error) {
      console.error('Notes encryption error:', error);
      throw new Error('فشل في تشفير الملاحظات');
    }
  }

  // فك تشفير الملاحظات مع التعافي الآمن
  static decryptNotes(encryptedNotes: string): string {
    try {
      if (!encryptedNotes) return '';
      
      const decryptedData = this.decrypt(encryptedNotes);
      
      if (!decryptedData) return '';
      
      // التحقق من نوع البيانات
      if (decryptedData.data_type === 'notes') {
        return decryptedData.notes || '';
      }
      
      // للتوافق مع النسخ القديمة
      if (typeof decryptedData === 'object' && decryptedData.notes) {
        return decryptedData.notes;
      }
      
      // للتوافق مع التشفير البسيط القديم
      if (typeof decryptedData === 'string') {
        return decryptedData;
      }
      
      return '';
    } catch (error) {
      console.error('Notes decryption error:', error);
      return '';
    }
  }

  // تشفير بيانات الاتصال الطارئ
  static encryptEmergencyContact(contactData: {
    name?: string;
    phone?: string;
    relationship?: string;
    email?: string;
  }): string {
    try {
      const enhancedData = {
        ...contactData,
        encrypted_at: new Date().toISOString(),
        data_type: 'emergency_contact'
      };
      
      return this.encrypt(enhancedData);
    } catch (error) {
      console.error('Emergency contact encryption error:', error);
      throw new Error('فشل في تشفير بيانات الاتصال الطارئ');
    }
  }

  // فك تشفير بيانات الاتصال الطارئ
  static decryptEmergencyContact(encryptedData: string): any {
    try {
      const decryptedData = this.decrypt(encryptedData);
      
      if (!decryptedData) return null;
      
      if (decryptedData.data_type === 'emergency_contact') {
        return decryptedData;
      }
      
      return decryptedData;
    } catch (error) {
      console.error('Emergency contact decryption error:', error);
      return null;
    }
  }

  // فحص صحة البيانات المشفرة
  static validateEncryptedData(encryptedData: string): boolean {
    try {
      if (!encryptedData) return false;
      
      const decrypted = this.decrypt(encryptedData);
      return decrypted !== null;
    } catch (error) {
      return false;
    }
  }

  // تنظيف البيانات الحساسة من الذاكرة
  static clearSensitiveData(): void {
    try {
      // محاولة تنظيف المتغيرات المحلية
      if (typeof window !== 'undefined') {
        // تنظيف أي بيانات حساسة من localStorage
        const sensitiveKeys = ['encrypted_health_data', 'temp_encryption_key'];
        sensitiveKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error clearing sensitive data:', error);
    }
  }
}

export { EncryptionService };
