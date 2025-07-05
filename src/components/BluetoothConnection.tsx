
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Heart, Battery, Wifi, WifiOff, Play } from 'lucide-react';
import { bluetoothService, BluetoothReading } from '@/services/BluetoothService';
import { useToast } from '@/hooks/use-toast';

interface BluetoothConnectionProps {
  onHeartRateUpdate: (heartRate: number) => void;
}

const BluetoothConnection = ({ onHeartRateUpdate }: BluetoothConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentReading, setCurrentReading] = useState<BluetoothReading | null>(null);
  const [bluetoothSupported, setBluetoothSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // التحقق من دعم البلوتوث
    const checkBluetoothSupport = async () => {
      const supported = await bluetoothService.isBluetoothSupported();
      setBluetoothSupported(supported);
      
      if (!supported) {
        toast({
          title: 'البلوتوث غير مدعوم',
          description: 'المتصفح الحالي لا يدعم Web Bluetooth API',
          variant: 'destructive',
        });
      }
    };

    checkBluetoothSupport();

    // إعداد مستمع البيانات
    bluetoothService.onData((reading: BluetoothReading) => {
      setCurrentReading(reading);
      onHeartRateUpdate(reading.heartRate);
    });

    return () => {
      bluetoothService.disconnect();
    };
  }, [onHeartRateUpdate, toast]);

  const handleConnect = async () => {
    if (!bluetoothSupported) {
      toast({
        title: 'البلوتوث غير مدعوم',
        description: 'استخدم متصفح Chrome أو Edge لدعم أفضل للبلوتوث',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    try {
      const devices = await bluetoothService.scanForDevices();
      if (devices.length > 0) {
        const connected = await bluetoothService.connectToDevice();
        if (connected) {
          setIsConnected(true);
          toast({
            title: 'تم الاتصال بنجاح',
            description: `تم الاتصال بجهاز ${devices[0].name}`,
          });
        }
      }
    } catch (error: any) {
      console.error('خطأ في الاتصال:', error);
      toast({
        title: 'خطأ في الاتصال',
        description: error.message || 'فشل في الاتصال بجهاز البلوتوث',
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

  const handleSimulate = async () => {
    await bluetoothService.simulateHeartRateReading();
    toast({
      title: 'محاكاة القراءة',
      description: 'تم إنشاء قراءة تجريبية لمعدل ضربات القلب',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <Bluetooth className="h-5 w-5 text-blue-600" />
          <span>اتصال البلوتوث</span>
          {!bluetoothSupported && (
            <Badge variant="destructive" className="text-xs">
              غير مدعوم
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">
              {isConnected ? 'متصل' : isConnecting ? 'جاري الاتصال...' : 'غير متصل'}
            </span>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'نشط' : 'غير نشط'}
          </Badge>
        </div>

        {currentReading && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Heart className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">معدل النبض</p>
                <p className="text-lg font-bold text-red-600">{currentReading.heartRate} نبضة/دقيقة</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Battery className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">البطارية</p>
                <p className="text-lg font-bold text-green-600">{currentReading.batteryLevel}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {!isConnected ? (
            <div className="space-y-2">
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting || !bluetoothSupported}
                className="w-full"
              >
                {isConnecting ? 'جاري الاتصال...' : 'اتصال بجهاز البلوتوث'}
              </Button>
              
              {bluetoothSupported && (
                <Button 
                  onClick={handleSimulate} 
                  variant="outline"
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  محاكاة قراءة (للاختبار)
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={handleDisconnect} 
                variant="outline"
                className="w-full"
              >
                قطع الاتصال
              </Button>
              
              <Button 
                onClick={handleSimulate} 
                variant="outline"
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                قراءة تجريبية
              </Button>
            </div>
          )}
        </div>

        {!bluetoothSupported && (
          <div className="text-xs text-gray-500 text-center p-2 bg-yellow-50 rounded">
            للحصول على دعم كامل للبلوتوث، استخدم متصفح Chrome أو Microsoft Edge
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BluetoothConnection;
