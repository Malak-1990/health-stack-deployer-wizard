
-- تفعيل Row Level Security على جميع الجداول

-- تفعيل RLS على جدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سياسة: المستخدمون يمكنهم رؤية وتعديل ملفاتهم الشخصية فقط
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- سياسة خاصة للمشرفين لرؤية جميع الملفات
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- تفعيل RLS على جدول heart_rate_readings
ALTER TABLE public.heart_rate_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own heart rate readings" ON public.heart_rate_readings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own heart rate readings" ON public.heart_rate_readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient heart rate readings" ON public.heart_rate_readings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

-- تفعيل RLS على جدول appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own appointments" ON public.appointments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view all appointments" ON public.appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

-- تفعيل RLS على جدول daily_health_logs
ALTER TABLE public.daily_health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own health logs" ON public.daily_health_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient health logs" ON public.daily_health_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

-- تفعيل RLS على جدول smart_alerts
ALTER TABLE public.smart_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alerts" ON public.smart_alerts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all alerts" ON public.smart_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- تفعيل RLS على جدول connected_devices
ALTER TABLE public.connected_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own devices" ON public.connected_devices
    FOR ALL USING (auth.uid() = user_id);

-- تفعيل RLS على جدول encrypted_health_data
ALTER TABLE public.encrypted_health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own encrypted data" ON public.encrypted_health_data
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient encrypted data" ON public.encrypted_health_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );
