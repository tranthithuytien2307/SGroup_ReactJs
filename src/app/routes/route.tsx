import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const BoardPage = lazy(() => import("../../pages/BoardPage"));

export default function PATHS() {
  return (
    <BrowserRouter basename="/SGroup_ReactJs">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SelectedWorkspaceProvider>
                  <WorkspaceProvider>
                    <Layout headerContent="Dashboard">
                      <Dashboard />
                    </Layout>
                  </WorkspaceProvider>
                </SelectedWorkspaceProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/board/:id"
            element={
              <ProtectedRoute>
                <SelectedWorkspaceProvider>
                  <WorkspaceProvider>
                    <Layout headerContent="Dashboard">
                      <BoardPage />
                    </Layout>
                  </WorkspaceProvider>
                </SelectedWorkspaceProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SelectedWorkspaceProvider>
                  <WorkspaceProvider>
                    <Layout headerContent="Dashboard">
                      <Dashboard />
                    </Layout>
                  </WorkspaceProvider>
                </SelectedWorkspaceProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
