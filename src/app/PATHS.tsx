import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { ProtectedRoute } from "@/shared/ProtectedRoute";
import { lazy, Suspense } from "react";
import { WorkspaceProvider } from "@/shared/context/WorkspaceContext";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const VerifyEmailPage = lazy(
  () => import("@/features/register/ui/VerifyEmailPage")
);
const GoogleCallbackPage = lazy(
  () => import("@/features/login/ui/GoogleCallbackPage")
);
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

export default function PATHS() {
  return (
    <BrowserRouter basename="/SGroup_ReactJs">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* DEFAULT → DASHBOARD (WITH AUTH) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkspaceProvider>
                  <Dashboard />
                </WorkspaceProvider>
              </ProtectedRoute>
            }
          />

          {/* Dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WorkspaceProvider>
                  <Dashboard />
                </WorkspaceProvider>
              </ProtectedRoute>
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
