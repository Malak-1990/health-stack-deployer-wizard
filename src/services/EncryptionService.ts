
import CryptoJS from 'crypto-js';

class EncryptionService {
  private static readonly SECRET_KEY = 'health-monitor-encryption-key';

  // تشفير البيانات الحساسة
  static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // فك تشفير البيانات
  static decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // تشفير البيانات الصحية الحساسة
  static encryptHealthData(healthData: {
    heartRate?: number;
    systolicBP?: number;
    diastolicBP?: number;
    notes?: string;
    medications?: string[];
    medicalConditions?: string[];
  }): string {
    return this.encrypt(healthData);
  }

  // فك تشفير البيانات الصحية
  static decryptHealthData(encryptedData: string): any {
    return this.decrypt(encryptedData);
  }

  // تشفير الملاحظات فقط
  static encryptNotes(notes: string): string {
    return this.encrypt({ notes });
  }

  // فك تشفير الملاحظات
  static decryptNotes(encryptedNotes: string): string {
    try {
      const decrypted = this.decrypt(encryptedNotes);
      return decrypted.notes || '';
    } catch (error) {
      return '';
    }
  }
}

export { EncryptionService };
