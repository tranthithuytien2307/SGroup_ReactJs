import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { ProtectedRoute } from "@/shared/ProtectedRoute";
import { lazy, Suspense } from "react";
import { WorkspaceProvider } from "@/shared/context/WorkspaceContext";
import Layout from "@/shared/ui/layout/Layout";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const GoogleCallbackPage = lazy(
  () => import("@/features/login/ui/GoogleCallbackPage")
);
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Board = lazy(() => import("@/pages/Board"));

export default function PATHS() {
  return (
    <BrowserRouter basename="/SGroup_ReactJs">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WorkspaceProvider>
                  <Layout headerContent="Dashboard">
                    <Dashboard />
                  </Layout>
                </WorkspaceProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkspaceProvider>
                  <Layout headerContent="Dashboard">
                    <Dashboard />
                  </Layout>
                </WorkspaceProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/board/:id"
            element={
              <ProtectedRoute>
                <WorkspaceProvider>
                  <Layout>
                    <Board />
                  </Layout>
                </WorkspaceProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
