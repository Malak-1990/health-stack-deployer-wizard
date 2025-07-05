
/// <reference path="../vite-env.d.ts" />

import type { BluetoothDevice, BluetoothRemoteGATTCharacteristic } from '../vite-env.d.ts';
import { supabase } from '@/integrations/supabase/client';

export interface HeartRateDevice {
  id: string;
  name: string;
  connected: boolean;
}

export interface BluetoothReading {
  heartRate: number;
  timestamp: Date;
  batteryLevel?: number;
}

class BluetoothService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private onDataCallback: ((reading: BluetoothReading) => void) | null = null;
  private isConnecting: boolean = false;

  async isBluetoothSupported(): Promise<boolean> {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  async scanForDevices(): Promise<HeartRateDevice[]> {
    try {
      if (!await this.isBluetoothSupported()) {
        throw new Error('Bluetooth غير مدعوم في هذا المتصفح');
      }

      if (this.isConnecting) {
        throw new Error('جاري الاتصال بالفعل...');
      }

      this.isConnecting = true;

      const device = await navigator.bluetooth!.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { name: 'Heart Rate' },
          { namePrefix: 'HR-' }
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      this.isConnecting = false;

      return [{
        id: device.id,
        name: device.name || 'جهاز مراقبة القلب',
        connected: false
      }];
    } catch (error) {
      this.isConnecting = false;
      console.error('خطأ في البحث عن الأجهزة:', error);
      throw new Error('فشل في البحث عن أجهزة البلوتوث');
    }
  }

  async connectToDevice(): Promise<boolean> {
    try {
      if (this.isConnecting) {
        throw new Error('جاري الاتصال بالفعل...');
      }

      if (!this.device) {
        const devices = await this.scanForDevices();
        if (devices.length === 0) {
          throw new Error('لم يتم العثور على أجهزة');
        }
        // في بيئة حقيقية، نختار الجهاز المناسب حسب deviceId
        await navigator.bluetooth!.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['battery_service']
        }).then(device => {
          this.device = device;
        });
      }

      this.isConnecting = true;

      // إضافة مستمع لانقطاع الاتصال
      this.device!.addEventListener('gattserverdisconnected', this.handleDisconnection.bind(this));

      const server = await this.device!.gatt?.connect();
      if (!server) throw new Error('فشل في الاتصال بخادم GATT');

      const service = await server.getPrimaryService('heart_rate');
      this.characteristic = await service.getCharacteristic('heart_rate_measurement');

      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', this.handleHeartRateData.bind(this));

      // حفظ الجهاز في قاعدة البيانات
      await this.saveConnectedDevice();

      this.isConnecting = false;
      console.log('تم الاتصال بجهاز مراقبة القلب بنجاح');
      return true;
    } catch (error) {
      this.isConnecting = false;
      console.error('خطأ في الاتصال بالجهاز:', error);
      throw new Error('فشل في الاتصال بجهاز البلوتوث');
    }
  }

  private handleDisconnection() {
    console.log('تم قطع الاتصال مع الجهاز');
    this.device = null;
    this.characteristic = null;
    this.onDataCallback = null;
  }

  private async saveConnectedDevice(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !this.device) return;

      const { error } = await supabase
        .from('connected_devices')
        .upsert([{
          user_id: user.id,
          device_name: this.device.name || 'جهاز مراقبة القلب',
          device_type: 'bluetooth',
          device_id: this.device.id,
          is_active: true,
          metadata: {
            connection_time: new Date().toISOString(),
            device_model: 'Bluetooth Heart Rate Monitor'
          }
        }], {
          onConflict: 'device_id,user_id'
        });

      if (error) {
        console.error('خطأ في حفظ بيانات الجهاز:', error);
      }
    } catch (error) {
      console.error('خطأ في حفظ بيانات الجهاز:', error);
    }
  }

  private handleHeartRateData(event: Event) {
    try {
      const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (!value) return;

      // قراءة معدل ضربات القلب من البيانات
      let heartRate: number;
      
      // التحقق من تنسيق البيانات
      if (value.getUint8(0) & 0x01) {
        // 16-bit heart rate value
        heartRate = value.getUint16(1, true);
      } else {
        // 8-bit heart rate value
        heartRate = value.getUint8(1);
      }

      const reading: BluetoothReading = {
        heartRate,
        timestamp: new Date(),
        batteryLevel: Math.floor(Math.random() * 40) + 60 // محاكاة مستوى البطارية 60-100%
      };

      if (this.onDataCallback) {
        this.onDataCallback(reading);
      }

      console.log('قراءة معدل ضربات القلب:', reading);
    } catch (error) {
      console.error('خطأ في معالجة بيانات معدل ضربات القلب:', error);
    }
  }

  onData(callback: (reading: BluetoothReading) => void) {
    this.onDataCallback = callback;
  }

  async disconnect(): Promise<void> {
    try {
      // تحديث حالة الجهاز في قاعدة البيانات
      const { data: { user } } = await supabase.auth.getUser();
      if (user && this.device) {
        await supabase
          .from('connected_devices')
          .update({ is_active: false })
          .eq('device_id', this.device.id)
          .eq('user_id', user.id);
      }

      if (this.characteristic) {
        await this.characteristic.stopNotifications();
        this.characteristic.removeEventListener('characteristicvaluechanged', this.handleHeartRateData.bind(this));
      }

      if (this.device?.gatt?.connected) {
        this.device.removeEventListener('gattserverdisconnected', this.handleDisconnection.bind(this));
        await this.device.gatt.disconnect();
      }
      
      this.device = null;
      this.characteristic = null;
      this.onDataCallback = null;
      this.isConnecting = false;
      
      console.log('تم قطع الاتصال بجهاز البلوتوث');
    } catch (error) {
      console.error('خطأ أثناء قطع الاتصال:', error);
    }
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected || false;
  }

  getIsConnecting(): boolean {
    return this.isConnecting;
  }

  getConnectedDeviceInfo(): { name: string; id: string } | null {
    if (!this.device) return null;
    return {
      name: this.device.name || 'جهاز مراقبة القلب',
      id: this.device.id
    };
  }

  // إضافة محاكاة لأغراض التطوير والاختبار
  async simulateHeartRateReading(): Promise<void> {
    if (!this.onDataCallback) return;

    const heartRate = Math.floor(Math.random() * 40) + 60; // 60-100 نبضة في الدقيقة
    const reading: BluetoothReading = {
      heartRate,
      timestamp: new Date(),
      batteryLevel: Math.floor(Math.random() * 40) + 60
    };

    this.onDataCallback(reading);
    console.log('محاكاة قراءة معدل ضربات القلب:', reading);
  }
}

export const bluetoothService = new BluetoothService();
