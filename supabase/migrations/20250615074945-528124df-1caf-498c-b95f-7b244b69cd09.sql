
-- إزالة الـ trigger أولاً
DROP TRIGGER IF EXISTS after_user_insert ON auth.users;

-- ثم إزالة الدالة باستخدام CASCADE
DROP FUNCTION IF EXISTS public.create_default_appointment() CASCADE;

-- حذف الـ policies الموجودة أولاً
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;

DROP POLICY IF EXISTS "Users can view own heart rate readings" ON public.heart_rate_readings;
DROP POLICY IF EXISTS "Users can insert own heart rate readings" ON public.heart_rate_readings;
DROP POLICY IF EXISTS "Doctors can view patient heart rate readings" ON public.heart_rate_readings;
DROP POLICY IF EXISTS "Users can manage own heart rate readings" ON public.heart_rate_readings;

DROP POLICY IF EXISTS "Users can view own daily health logs" ON public.daily_health_logs;
DROP POLICY IF EXISTS "Users can manage own daily health logs" ON public.daily_health_logs;
DROP POLICY IF EXISTS "Doctors can view patient health logs" ON public.daily_health_logs;

DROP POLICY IF EXISTS "Users can manage own smart alerts" ON public.smart_alerts;
DROP POLICY IF EXISTS "Users can manage own alerts" ON public.smart_alerts;
DROP POLICY IF EXISTS "Admins can view all alerts" ON public.smart_alerts;

DROP POLICY IF EXISTS "Users can manage own connected devices" ON public.connected_devices;
DROP POLICY IF EXISTS "Users can manage own devices" ON public.connected_devices;

DROP POLICY IF EXISTS "Users can manage own encrypted health data" ON public.encrypted_health_data;
DROP POLICY IF EXISTS "Users can manage own encrypted data" ON public.encrypted_health_data;
DROP POLICY IF EXISTS "Doctors can view patient encrypted data" ON public.encrypted_health_data;

-- إنشاء RLS policies للجداول المطلوبة
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heart_rate_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encrypted_health_data ENABLE ROW LEVEL SECURITY;

-- إنشاء policies للـ profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- إنشاء policies للـ appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON public.appointments
  FOR DELETE USING (auth.uid() = user_id);

-- إنشاء policies لباقي الجداول
CREATE POLICY "Users can manage own heart rate readings" ON public.heart_rate_readings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily health logs" ON public.daily_health_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own smart alerts" ON public.smart_alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own connected devices" ON public.connected_devices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own encrypted health data" ON public.encrypted_health_data
  FOR ALL USING (auth.uid() = user_id);

-- تحديث الـ trigger function للـ profiles ليكون أكثر أماناً
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- في حالة حدوث خطأ، نسجل الخطأ ونكمل بدون توقف التسجيل
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- التأكد من وجود الـ trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
