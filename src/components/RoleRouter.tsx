// src/components/RoleRouter.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ✅ استيراد صفحات الواجهات
import DoctorDashboardPage from "../pages/DoctorDashboardPage";
import PatientDashboardPage from "../pages/PatientDashboardPage";
import FamilyDashboardPage from "../pages/FamilyDashboardPage";
import AdminDashboard from "../pages/AdminDashboard";

type RoleType = "doctor" | "patient" | "family" | "admin";

const RoleRouter = () => {
  const [role, setRole] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUserRole = async () => {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (profileError || !profile?.role) {
        setError("تعذر جلب بيانات المستخدم. تأكد من إعداد الدور في جدول الحسابات.");
        setLoading(false);
        return;
      }

      setRole(profile.role as RoleType);
      setLoading(false);
    };

    fetchUserRole();
    return () => { isMounted = false };
  }, [navigate]);

  if (loading) {
    return (
      <main dir="rtl" lang="ar" className="flex items-center justify-center min-h-screen">
        <span className="text-gray-700 text-lg font-semibold" aria-busy="true">جاري تحميل الواجهة...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main dir="rtl" lang="ar" className="flex flex-col items-center justify-center min-h-screen text-red-700">
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={() => navigate("/auth", { replace: true })}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          العودة لتسجيل الدخول
        </button>
      </main>
    );
  }

  switch (role) {
    case "doctor":
      return <DoctorDashboardPage />;
    case "patient":
      return <PatientDashboardPage />;
    case "family":
      return <FamilyDashboardPage />;
    case "admin":
      return <AdminDashboard />;
    default:
      navigate("/auth", { replace: true });
      return null;
  }
};

export default RoleRouter;
