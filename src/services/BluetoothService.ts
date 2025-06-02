
/// <reference path="../vite-env.d.ts" />

import type { BluetoothDevice, BluetoothRemoteGATTCharacteristic } from '../vite-env.d.ts';

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

  async scanForDevices(): Promise<HeartRateDevice[]> {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth not supported in this browser');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
      });

      return [{
        id: device.id,
        name: device.name || 'Unknown Device',
        connected: false
      }];
    } catch (error) {
      console.error('Error scanning for devices:', error);
      throw error;
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      if (!this.device) {
        const device = await navigator.bluetooth!.requestDevice({
          filters: [{ services: ['heart_rate'] }]
        });
        this.device = device;
      }

      const server = await this.device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      const service = await server.getPrimaryService('heart_rate');
      this.characteristic = await service.getCharacteristic('heart_rate_measurement');

      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', this.handleHeartRateData.bind(this));

      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      return false;
    }
  }

  private handleHeartRateData(event: Event) {
    const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    const heartRate = value.getUint16(1, true);
    const reading: BluetoothReading = {
      heartRate,
      timestamp: new Date(),
      batteryLevel: Math.floor(Math.random() * 100) // Mock battery level
    };

    if (this.onDataCallback) {
      this.onDataCallback(reading);
    }
  }

  onData(callback: (reading: BluetoothReading) => void) {
    this.onDataCallback = callback;
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      await this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
    this.onDataCallback = null;
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected || false;
  }
}

export const bluetoothService = new BluetoothService();
