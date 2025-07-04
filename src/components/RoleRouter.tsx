import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Adjust if path differs

import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import FamilyDashboard from "./FamilyDashboard";
import AdminUserManager from "./AdminUserManager";

type RoleType = "doctor" | "patient" | "family" | "admin";

const RoleRouter: React.FC = () => {
  const [role, setRole] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (profileError) {
        setError("خطأ في جلب بيانات الحساب. حاول لاحقاً.");
        setRole(null);
        setLoading(false);
        return;
      }

      if (!data || !data.role) {
        setError("لم يتم تعيين دور لهذا المستخدم.");
        setRole(null);
        setLoading(false);
        return;
      }

      setRole(data.role as RoleType);
      setLoading(false);
    })();

    return () => { isMounted = false };
  }, [navigate]);

  if (loading) {
    return (
      <main dir="rtl" lang="ar" className="flex items-center justify-center min-h-screen">
        <span aria-busy="true" aria-live="polite">جاري التحميل...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main dir="rtl" lang="ar" className="flex flex-col items-center justify-center min-h-screen text-red-700">
        <span role="alert">{error}</span>
        <button
          onClick={() => navigate("/auth", { replace: true })}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          العودة لتسجيل الدخول
        </button>
      </main>
    );
  }

  switch (role) {
    case "doctor":
      return <DoctorDashboard />;
    case "patient":
      return <PatientDashboard />;
    case "family":
      return <FamilyDashboard />;
    case "admin":
      return <AdminUserManager />;
    default:
      navigate("/auth", { replace: true });
      return null;
  }
};

export default RoleRouter;
