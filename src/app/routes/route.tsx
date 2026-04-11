import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoadingSpinner from "../../shared/ui/LoadingSpinner";
import { ProtectedRoute } from "./ProtectedRoute";
import { WorkspaceProvider } from "../../features/workspace/WorkspaceContext";
import Layout from "../../widgets/layout/Layout";
import { SelectedWorkspaceProvider } from "../../features/workspace/SelectedWorkspaceContext";

const GoogleCallbackPage = lazy(
  () => import("../../widgets/login/GoogleCallbackPage"),
);
const LoginPage = lazy(() => import("../../pages/LoginPage"));
const ProfilePage = lazy(() => import("../../pages/ProfilePage"));
const RegisterPage = lazy(() => import("../../pages/RegisterPage"));
const VerifyEmailPage = lazy(
  () => import("../../widgets/register/VerifyEmailPage"),
);
const ForgotPasswordPage = lazy(() => import("../../pages/ForgotPasswordPage"));
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const BoardPage = lazy(() => import("../../pages/BoardPage"));
const ResetPasswordPage = lazy(() => import("../../pages/ResetPasswordPage"));
const UpdateProfilePage = lazy(() => import("../../pages/EditProfilePage"));

export default function PATHS() {
  return (
    <BrowserRouter basename="/SGroup_ReactJs">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile/edit" element={<UpdateProfilePage />} />

          <Route
            element={
              <ProtectedRoute>
                <SelectedWorkspaceProvider>
                  <WorkspaceProvider>
                    <Layout headerContent="Dashboard">
                      <Suspense fallback={<LoadingSpinner />}>
                        <Outlet />
                      </Suspense>
                    </Layout>
                  </WorkspaceProvider>
                </SelectedWorkspaceProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/board/:id" element={<BoardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
