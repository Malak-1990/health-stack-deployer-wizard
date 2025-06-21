import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RoleProvider } from "@/contexts/RoleContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import RoleRouter from "./components/RoleRouter";
import Dashboard from "./components/Dashboard";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import FamilyDashboardPage from "./pages/FamilyDashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactPage from './pages/Contact';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <RoleProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Unified dashboard entry: redirects to the correct dashboard based on user role */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <RoleRouter />
                      </ProtectedRoute>
                    }
                  />

                  {/* Direct dashboard routes for each role (still protected, for deep linking/bookmarks) */}
                  <Route
                    path="/patient-dashboard"
                    element={
                      <ProtectedRoute>
                        <PatientDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor-dashboard"
                    element={
                      <ProtectedRoute>
                        <DoctorDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/family-dashboard"
                    element={
                      <ProtectedRoute>
                        <FamilyDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
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

                  {/* Fallback */}
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
