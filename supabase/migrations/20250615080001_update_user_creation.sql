
-- تحديث دالة إنشاء المستخدم الجديد لتحسين معالجة الأدوار
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text := 'user';  -- الدور الافتراضي
BEGIN
  -- تحديد الدور بناءً على البريد الإلكتروني أو البيانات الوصفية
  IF NEW.email = 'malaksalama21@gmail.com' THEN
    user_role := 'admin';
  ELSIF NEW.raw_user_meta_data ->> 'role' IS NOT NULL THEN
    user_role := NEW.raw_user_meta_data ->> 'role';
  END IF;

  -- إدراج الملف الشخصي
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    user_role
  );
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- تسجيل التحذير والمتابعة
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
