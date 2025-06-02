
class EncryptionService {
  private async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async getStoredKey(): Promise<CryptoKey> {
    const keyData = localStorage.getItem('encryption_key');
    if (keyData) {
      const keyBuffer = new Uint8Array(JSON.parse(keyData));
      return crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
      );
    }
    
    const newKey = await this.generateKey();
    const exportedKey = await crypto.subtle.exportKey('raw', newKey);
    localStorage.setItem('encryption_key', JSON.stringify(Array.from(new Uint8Array(exportedKey))));
    return newKey;
  }

  async encryptData(data: string): Promise<string> {
    try {
      const key = await this.getStoredKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encodedData
      );
      
      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv, 0);
      combined.set(encryptedArray, iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      return data; // Fallback to unencrypted data
    }
  }

  async decryptData(encryptedData: string): Promise<string> {
    try {
      const key = await this.getStoredKey();
      const combined = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData; // Fallback to encrypted data
    }
  }
}

export const encryptionService = new EncryptionService();
