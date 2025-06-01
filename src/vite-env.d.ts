
/// <reference types="vite/client" />

// Web Bluetooth API Type Declarations
export interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

export interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
}

export interface BluetoothRemoteGATTService {
  device: BluetoothDevice;
  uuid: string;
  getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
}

export interface BluetoothRemoteGATTCharacteristic {
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
  
  // Make types globally available
  interface Window {
    BluetoothDevice: BluetoothDevice;
    BluetoothRemoteGATTCharacteristic: BluetoothRemoteGATTCharacteristic;
  }
}

// Declare global types
declare global {
  type BluetoothDevice = import('./vite-env.d.ts').BluetoothDevice;
  type BluetoothRemoteGATTCharacteristic = import('./vite-env.d.ts').BluetoothRemoteGATTCharacteristic;
}

export {};
