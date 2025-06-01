
/// <reference types="vite/client" />

// Web Bluetooth API Type Declarations
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  device: BluetoothDevice;
  uuid: string;
  getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  service: BluetoothRemoteGATTService;
  uuid: string;
  value?: DataView;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
}

interface Bluetooth {
  requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  getAvailability(): Promise<boolean>;
}

type BluetoothServiceUUID = number | string;
type BluetoothCharacteristicUUID = number | string;

// Extend Navigator interface
declare global {
  interface Navigator {
    bluetooth?: Bluetooth;
  }
}

export {};
