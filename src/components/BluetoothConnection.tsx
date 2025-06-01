
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Heart, Battery, Wifi, WifiOff } from 'lucide-react';
import { bluetoothService, BluetoothReading } from '@/services/BluetoothService';
import { useToast } from '@/hooks/use-toast';

interface BluetoothConnectionProps {
  onHeartRateUpdate: (heartRate: number) => void;
}

const BluetoothConnection = ({ onHeartRateUpdate }: BluetoothConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentReading, setCurrentReading] = useState<BluetoothReading | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    bluetoothService.onData((reading: BluetoothReading) => {
      setCurrentReading(reading);
      onHeartRateUpdate(reading.heartRate);
    });

    return () => {
      bluetoothService.disconnect();
    };
  }, [onHeartRateUpdate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const devices = await bluetoothService.scanForDevices();
      if (devices.length > 0) {
        const connected = await bluetoothService.connectToDevice(devices[0].id);
        if (connected) {
          setIsConnected(true);
          toast({
            title: 'تم الاتصال بنجاح',
            description: 'تم الاتصال بجهاز مراقبة القلب',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'خطأ في الاتصال',
        description: 'فشل في الاتصال بجهاز البلوتوث',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await bluetoothService.disconnect();
    setIsConnected(false);
    setCurrentReading(null);
    toast({
      title: 'تم قطع الاتصال',
      description: 'تم قطع الاتصال بجهاز مراقبة القلب',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bluetooth className="h-5 w-5 text-blue-600" />
          <span>اتصال البلوتوث</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'نشط' : 'غير نشط'}
          </Badge>
        </div>

        {currentReading && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">معدل النبض</p>
                <p className="text-lg font-bold">{currentReading.heartRate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Battery className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">البطارية</p>
                <p className="text-lg font-bold">{currentReading.batteryLevel}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'جاري الاتصال...' : 'اتصال'}
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect} 
              variant="outline"
              className="w-full"
            >
              قطع الاتصال
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BluetoothConnection;
