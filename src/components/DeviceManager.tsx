
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Bluetooth, Wifi, Activity, Plus } from 'lucide-react';

interface ConnectedDevice {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  device_id: string;
  last_connected: string;
  is_active: boolean;
  metadata?: any;
}

const DeviceManager = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDevices();
    }
  }, [user]);

  const loadDevices = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('connected_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('last_connected', { ascending: false });

      if (error) {
        console.error('Error loading devices:', error);
      } else {
        setDevices(data || []);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    }
    setLoading(false);
  };

  const addDevice = async (deviceData: {
    name: string;
    type: string;
    deviceId: string;
    metadata?: any;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('connected_devices')
        .insert([{
          user_id: user.id,
          device_name: deviceData.name,
          device_type: deviceData.type,
          device_id: deviceData.deviceId,
          metadata: deviceData.metadata
        }]);

      if (error) {
        console.error('Error adding device:', error);
      } else {
        loadDevices();
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const toggleDevice = async (deviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('connected_devices')
        .update({ 
          is_active: !isActive,
          last_connected: !isActive ? new Date().toISOString() : undefined
        })
        .eq('id', deviceId);

      if (error) {
        console.error('Error toggling device:', error);
      } else {
        loadDevices();
      }
    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'bluetooth': return <Bluetooth className="h-5 w-5" />;
      case 'wifi': return <Wifi className="h-5 w-5" />;
      case 'wearable': return <Activity className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getDeviceTypeLabel = (deviceType: string) => {
    switch (deviceType) {
      case 'bluetooth': return 'بلوتوث';
      case 'wifi': return 'واي فاي';
      case 'wearable': return 'جهاز قابل للارتداء';
      default: return 'جهاز';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>إدارة الأجهزة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">جاري تحميل الأجهزة...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          الأجهزة المتصلة
          <Button size="sm" onClick={() => {
            // إضافة جهاز جديد (يمكن ربطه بالبلوتوث)
            addDevice({
              name: 'جهاز مراقبة القلب',
              type: 'bluetooth',
              deviceId: 'hr_monitor_' + Date.now(),
              metadata: { model: 'Generic Heart Rate Monitor' }
            });
          }}>
            <Plus className="h-4 w-4 mr-1" />
            إضافة جهاز
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد أجهزة متصلة</p>
            <Button onClick={() => {
              addDevice({
                name: 'جهاز مراقبة القلب الأول',
                type: 'bluetooth',
                deviceId: 'hr_monitor_demo',
                metadata: { demo: true }
              });
            }}>
              إضافة جهاز تجريبي
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    device.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getDeviceIcon(device.device_type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{device.device_name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{getDeviceTypeLabel(device.device_type)}</span>
                      <Badge variant={device.is_active ? 'default' : 'secondary'}>
                        {device.is_active ? 'متصل' : 'غير متصل'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {new Date(device.last_connected).toLocaleString('ar-EG')}
                  </span>
                  <Button
                    size="sm"
                    variant={device.is_active ? 'destructive' : 'default'}
                    onClick={() => toggleDevice(device.id, device.is_active)}
                  >
                    {device.is_active ? 'قطع الاتصال' : 'اتصال'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceManager;
