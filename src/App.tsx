import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { RoleProvider } from "@/contexts/RoleContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";

import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRouter from "@/components/RoleRouter";

import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import ContactPage from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import DoctorDashboard from "@/components/DoctorDashboard";
import PatientDashboard from "@/components/PatientDashboard";
import FamilyDashboard from "@/components/FamilyDashboard";
import AdminUserManager from "@/components/AdminUserManager";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          {/* ✅ التأكد من ترتيب الـ Providers الصحيح */}
          <RoleProvider>
            <AuthProvider>
              {/* التنبيهات والتوستر */}
              <Toaster />
              <Sonner />

              {/* نظام التوجيه */}
              <BrowserRouter>
                <Routes>
                  {/* صفحات عامة */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* لوحة التحكم الديناميكية حسب الدور */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <RoleRouter />
                      </ProtectedRoute>
                    }
                  />

                  {/* روابط مباشرة لكل لوحة تحكم حسب الدور */}
                  <Route
                    path="/doctor-dashboard"
                    element={
                      <ProtectedRoute>
                        <DoctorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient-dashboard"
                    element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/family-dashboard"
                    element={
                      <ProtectedRoute>
                        <FamilyDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminUserManager />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* صفحة الخطأ عند عدم تطابق أي مسار */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </RoleProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
