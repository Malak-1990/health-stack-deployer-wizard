
-- التأكد من أن المستخدم malaksalama21@gmail.com له دور admin
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- البحث عن معرف المستخدم بالبريد الإلكتروني
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'malaksalama21@gmail.com';
    
    -- إذا تم العثور على المستخدم، تحديث أو إدراج الملف الشخصي
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, full_name, role)
        VALUES (admin_user_id, 'Malak', 'admin')
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'admin',
            full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
            updated_at = now();
            
        RAISE NOTICE 'تم تعيين دور المشرف للمستخدم: %', admin_user_id;
    ELSE
        RAISE NOTICE 'لم يتم العثور على المستخدم بالبريد الإلكتروني: malaksalama21@gmail.com';
    END IF;
END $$;

-- التحقق من النتيجة
SELECT 
    p.id,
    u.email,
    p.full_name,
    p.role,
    p.created_at,
    p.updated_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'malaksalama21@gmail.com';
