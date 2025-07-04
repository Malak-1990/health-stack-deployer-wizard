import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DoctorDashboard from "@/components/DoctorDashboard";
import PatientDashboard from "@/components/PatientDashboard";
import FamilyDashboard from "@/components/FamilyDashboard";
import AdminUserManager from "@/components/AdminUserManager";

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

      // Check if user is admin by email
      if (user.email === 'malaksalama21@gmail.com') {
        setRole('admin');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!isMounted) return;

      if (profileError || !profile?.role) {
        // Default to patient role if no profile found
        setRole('patient');
        setLoading(false);
        return;
      }

      // Map database roles to component roles
      let userRole: RoleType = 'patient';
      switch (profile.role) {
        case 'admin':
          userRole = 'admin';
          break;
        case 'doctor':
          userRole = 'doctor';
          break;
        case 'family':
          userRole = 'family';
          break;
        case 'user':
        default:
          userRole = 'patient';
          break;
      }

      setRole(userRole);
      setLoading(false);
    };

    fetchUserRole();
    return () => { isMounted = false };
  }, [navigate]);

  if (loading) {
    return (
      <main dir="rtl" lang="ar" className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-gray-700 text-lg font-semibold">جاري تحميل الواجهة...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main dir="rtl" lang="ar" className="flex flex-col items-center justify-center min-h-screen text-red-700 bg-gray-50">
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