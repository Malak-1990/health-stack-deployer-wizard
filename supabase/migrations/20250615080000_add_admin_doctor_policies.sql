
-- إنشاء security definer function للحصول على دور المستخدم الحالي
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- إضافة policies للمشرفين والأطباء لرؤية جميع الملفات الشخصية
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Doctors can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'doctor');

-- إضافة policies للأطباء والمشرفين لرؤية قراءات القلب
CREATE POLICY "Doctors can view all heart rate readings" ON public.heart_rate_readings
  FOR SELECT USING (
    public.get_current_user_role() IN ('doctor', 'admin')
  );

-- إضافة policies للأطباء والمشرفين لرؤية السجلات الصحية
CREATE POLICY "Doctors can view all health logs" ON public.daily_health_logs
  FOR SELECT USING (
    public.get_current_user_role() IN ('doctor', 'admin')
  );

-- إضافة policies للأطباء والمشرفين لرؤية المواعيد
CREATE POLICY "Doctors can view all appointments" ON public.appointments
  FOR SELECT USING (
    public.get_current_user_role() IN ('doctor', 'admin')
  );

-- إضافة policies للمشرفين لرؤية جميع التنبيهات
CREATE POLICY "Admins can view all alerts" ON public.smart_alerts
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- إضافة policies للأطباء والمشرفين لرؤية البيانات المشفرة
CREATE POLICY "Doctors can view encrypted data" ON public.encrypted_health_data
  FOR SELECT USING (
    public.get_current_user_role() IN ('doctor', 'admin')
  );
