
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Shield, Palette, Smartphone, Database, Heart, Volume2, Eye, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  heartRateAlerts: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  weeklyReports: boolean;
  emergencyAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  alertVolume: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface PrivacySettings {
  shareDataWithDoctor: boolean;
  shareDataWithFamily: boolean;
  anonymousAnalytics: boolean;
  locationTracking: boolean;
  dataRetentionPeriod: '1year' | '2years' | '5years' | 'forever';
  exportDataEnabled: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ar' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'green' | 'purple' | 'red';
  compactMode: boolean;
  animationsEnabled: boolean;
}

interface HealthSettings {
  heartRateThresholds: {
    low: number;
    high: number;
    critical: number;
  };
  measurementUnits: 'metric' | 'imperial';
  autoSync: boolean;
  syncInterval: number;
  batteryOptimization: boolean;
}

const AdvancedSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    heartRateAlerts: true,
    medicationReminders: true,
    appointmentReminders: true,
    weeklyReports: false,
    emergencyAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
    alertVolume: 80,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00'
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    shareDataWithDoctor: true,
    shareDataWithFamily: false,
    anonymousAnalytics: true,
    locationTracking: false,
    dataRetentionPeriod: '2years',
    exportDataEnabled: true
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'auto',
    language: 'ar',
    fontSize: 'medium',
    colorScheme: 'blue',
    compactMode: false,
    animationsEnabled: true
  });

  const [health, setHealth] = useState<HealthSettings>({
    heartRateThresholds: {
      low: 60,
      high: 100,
      critical: 120
    },
    measurementUnits: 'metric',
    autoSync: true,
    syncInterval: 5,
    batteryOptimization: true
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    // In real app, load from Supabase
    console.log('Loading settings for user:', user?.id);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In real app, save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم حفظ الإعدادات',
        description: 'تم تطبيق جميع التغييرات بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: 'فشل في حفظ الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setNotifications({
      heartRateAlerts: true,
      medicationReminders: true,
      appointmentReminders: true,
      weeklyReports: false,
      emergencyAlerts: true,
      soundEnabled: true,
      vibrationEnabled: true,
      alertVolume: 80,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    });
    
    setPrivacy({
      shareDataWithDoctor: true,
      shareDataWithFamily: false,
      anonymousAnalytics: true,
      locationTracking: false,
      dataRetentionPeriod: '2years',
      exportDataEnabled: true
    });
    
    setAppearance({
      theme: 'auto',
      language: 'ar',
      fontSize: 'medium',
      colorScheme: 'blue',
      compactMode: false,
      animationsEnabled: true
    });
    
    setHealth({
      heartRateThresholds: {
        low: 60,
        high: 100,
        critical: 120
      },
      measurementUnits: 'metric',
      autoSync: true,
      syncInterval: 5,
      batteryOptimization: true
    });

    toast({
      title: 'تم إعادة تعيين الإعدادات',
      description: 'تم استعادة الإعدادات الافتراضية',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">الإعدادات المتقدمة</h2>
          <p className="text-gray-600">تخصيص التطبيق حسب احتياجاتك</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            إعادة تعيين
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="privacy">الخصوصية</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="health">الصحة</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                تحكم في أنواع الإشعارات التي تريد تلقيها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Alert Types */}
              <div className="space-y-4">
                <h4 className="font-medium">أنواع التنبيهات</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>تنبيهات معدل ضربات القلب</Label>
                    <p className="text-sm text-gray-600">تنبيهات عند تجاوز المعدل الطبيعي</p>
                  </div>
                  <Switch
                    checked={notifications.heartRateAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, heartRateAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تذكير بالأدوية</Label>
                    <p className="text-sm text-gray-600">تذكير بمواعيد تناول الأدوية</p>
                  </div>
                  <Switch
                    checked={notifications.medicationReminders}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, medicationReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تذكير بالمواعيد</Label>
                    <p className="text-sm text-gray-600">تذكير بالمواعيد الطبية</p>
                  </div>
                  <Switch
                    checked={notifications.appointmentReminders}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, appointmentReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>التقارير الأسبوعية</Label>
                    <p className="text-sm text-gray-600">تقارير دورية عن حالتك الصحية</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تنبيهات الطوارئ</Label>
                    <p className="text-sm text-gray-600">تنبيهات للحالات الطارئة</p>
                    <Badge variant="destructive" className="mt-1">حرج</Badge>
                  </div>
                  <Switch
                    checked={notifications.emergencyAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, emergencyAlerts: checked }))
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* Sound & Vibration */}
              <div className="space-y-4">
                <h4 className="font-medium">الصوت والاهتزاز</h4>
                
                <div className="flex items-center justify-between">
                  <Label>تفعيل الأصوات</Label>
                  <Switch
                    checked={notifications.soundEnabled}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, soundEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>تفعيل الاهتزاز</Label>
                  <Switch
                    checked={notifications.vibrationEnabled}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, vibrationEnabled: checked }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>مستوى الصوت: {notifications.alertVolume}%</Label>
                  <Slider
                    value={[notifications.alertVolume]}
                    onValueChange={([value]) =>
                      setNotifications(prev => ({ ...prev, alertVolume: value }))
                    }
                    max={100}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>ساعات الهدوء</Label>
                    <p className="text-sm text-gray-600">تقليل الإشعارات خلال فترات محددة</p>
                  </div>
                  <Switch
                    checked={notifications.quietHoursEnabled}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, quietHoursEnabled: checked }))
                    }
                  />
                </div>

                {notifications.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>بداية الهدوء</Label>
                      <Input
                        type="time"
                        value={notifications.quietHoursStart}
                        onChange={(e) =>
                          setNotifications(prev => ({ ...prev, quietHoursStart: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>نهاية الهدوء</Label>
                      <Input
                        type="time"
                        value={notifications.quietHoursEnd}
                        onChange={(e) =>
                          setNotifications(prev => ({ ...prev, quietHoursEnd: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إعدادات الخصوصية
              </CardTitle>
              <CardDescription>
                تحكم في كيفية استخدام ومشاركة بياناتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">مشاركة البيانات</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>مشاركة البيانات مع الطبيب</Label>
                    <p className="text-sm text-gray-600">السماح للطبيب بالوصول لبياناتك الصحية</p>
                  </div>
                  <Switch
                    checked={privacy.shareDataWithDoctor}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, shareDataWithDoctor: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>مشاركة البيانات مع العائلة</Label>
                    <p className="text-sm text-gray-600">السماح لأفراد العائلة برؤية حالتك الصحية</p>
                  </div>
                  <Switch
                    checked={privacy.shareDataWithFamily}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, shareDataWithFamily: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>التحليلات المجهولة</Label>
                    <p className="text-sm text-gray-600">مساعدة في تحسين التطبيق عبر بيانات مجهولة</p>
                  </div>
                  <Switch
                    checked={privacy.anonymousAnalytics}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, anonymousAnalytics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تتبع الموقع</Label>
                    <p className="text-sm text-gray-600">استخدام الموقع لتنبيهات الطوارئ</p>
                  </div>
                  <Switch
                    checked={privacy.locationTracking}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, locationTracking: checked }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">إدارة البيانات</h4>
                
                <div className="space-y-2">
                  <Label>فترة الاحتفاظ بالبيانات</Label>
                  <Select
                    value={privacy.dataRetentionPeriod}
                    onValueChange={(value: any) =>
                      setPrivacy(prev => ({ ...prev, dataRetentionPeriod: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">سنة واحدة</SelectItem>
                      <SelectItem value="2years">سنتان</SelectItem>
                      <SelectItem value="5years">5 سنوات</SelectItem>
                      <SelectItem value="forever">إلى الأبد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تصدير البيانات</Label>
                    <p className="text-sm text-gray-600">إمكانية تصدير بياناتك الشخصية</p>
                  </div>
                  <Switch
                    checked={privacy.exportDataEnabled}
                    onCheckedChange={(checked) =>
                      setPrivacy(prev => ({ ...prev, exportDataEnabled: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                إعدادات المظهر
              </CardTitle>
              <CardDescription>
                تخصيص واجهة التطبيق حسب تفضيلاتك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>السمة</Label>
                  <Select
                    value={appearance.theme}
                    onValueChange={(value: any) =>
                      setAppearance(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">فاتح</SelectItem>
                      <SelectItem value="dark">داكن</SelectItem>
                      <SelectItem value="auto">تلقائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>اللغة</Label>
                  <Select
                    value={appearance.language}
                    onValueChange={(value: any) =>
                      setAppearance(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>حجم الخط</Label>
                  <Select
                    value={appearance.fontSize}
                    onValueChange={(value: any) =>
                      setAppearance(prev => ({ ...prev, fontSize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>نظام الألوان</Label>
                  <Select
                    value={appearance.colorScheme}
                    onValueChange={(value: any) =>
                      setAppearance(prev => ({ ...prev, colorScheme: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">أزرق</SelectItem>
                      <SelectItem value="green">أخضر</SelectItem>
                      <SelectItem value="purple">بنفسجي</SelectItem>
                      <SelectItem value="red">أحمر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>الوضع المضغوط</Label>
                    <p className="text-sm text-gray-600">عرض أكثر كثافة للمعلومات</p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) =>
                      setAppearance(prev => ({ ...prev, compactMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>الرسوم المتحركة</Label>
                    <p className="text-sm text-gray-600">تفعيل التأثيرات المرئية</p>
                  </div>
                  <Switch
                    checked={appearance.animationsEnabled}
                    onCheckedChange={(checked) =>
                      setAppearance(prev => ({ ...prev, animationsEnabled: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                إعدادات الصحة
              </CardTitle>
              <CardDescription>
                تخصيص المراقبة الصحية والتنبيهات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Heart Rate Thresholds */}
              <div className="space-y-4">
                <h4 className="font-medium">حدود معدل ضربات القلب</h4>
                
                <div className="space-y-3">
                  <Label>الحد الأدنى الطبيعي: {health.heartRateThresholds.low} bpm</Label>
                  <Slider
                    value={[health.heartRateThresholds.low]}
                    onValueChange={([value]) =>
                      setHealth(prev => ({
                        ...prev,
                        heartRateThresholds: { ...prev.heartRateThresholds, low: value }
                      }))
                    }
                    min={40}
                    max={80}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>الحد الأعلى الطبيعي: {health.heartRateThresholds.high} bpm</Label>
                  <Slider
                    value={[health.heartRateThresholds.high]}
                    onValueChange={([value]) =>
                      setHealth(prev => ({
                        ...prev,
                        heartRateThresholds: { ...prev.heartRateThresholds, high: value }
                      }))
                    }
                    min={80}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>الحد الحرج: {health.heartRateThresholds.critical} bpm</Label>
                  <Slider
                    value={[health.heartRateThresholds.critical]}
                    onValueChange={([value]) =>
                      setHealth(prev => ({
                        ...prev,
                        heartRateThresholds: { ...prev.heartRateThresholds, critical: value }
                      }))
                    }
                    min={120}
                    max={180}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              {/* Measurement Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">وحدات القياس</h4>
                
                <div className="space-y-2">
                  <Label>نظام القياس</Label>
                  <Select
                    value={health.measurementUnits}
                    onValueChange={(value: any) =>
                      setHealth(prev => ({ ...prev, measurementUnits: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">متري (كغ، سم)</SelectItem>
                      <SelectItem value="imperial">إمبراطوري (باوند، إنش)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Sync Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">إعدادات المزامنة</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>المزامنة التلقائية</Label>
                    <p className="text-sm text-gray-600">مزامنة البيانات تلقائياً مع الأجهزة</p>
                  </div>
                  <Switch
                    checked={health.autoSync}
                    onCheckedChange={(checked) =>
                      setHealth(prev => ({ ...prev, autoSync: checked }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>فترة المزامنة: كل {health.syncInterval} دقائق</Label>
                  <Slider
                    value={[health.syncInterval]}
                    onValueChange={([value]) =>
                      setHealth(prev => ({ ...prev, syncInterval: value }))
                    }
                    min={1}
                    max={60}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تحسين البطارية</Label>
                    <p className="text-sm text-gray-600">تقليل استهلاك البطارية</p>
                  </div>
                  <Switch
                    checked={health.batteryOptimization}
                    onCheckedChange={(checked) =>
                      setHealth(prev => ({ ...prev, batteryOptimization: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSettings;
