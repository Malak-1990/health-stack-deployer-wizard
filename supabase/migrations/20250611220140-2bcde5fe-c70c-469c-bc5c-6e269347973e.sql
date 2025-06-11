
-- إضافة عمود role إلى جدول profiles
ALTER TABLE public.profiles 
ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'doctor', 'family'));

-- إنشاء فهرس للبحث السريع حسب الدور
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- تحديث المستخدمين الموجودين ليكون لهم دور افتراضي
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;
