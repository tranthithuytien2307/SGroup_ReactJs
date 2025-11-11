import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { ProtectedRoute } from "@/shared/ProtectedRoute";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const GoogleCallbackPage = lazy(
  () => import("@/features/login/ui/GoogleCallbackPage")
);

export default function PATHS() {
  return (
    <BrowserRouter basename="/SGroup_ReactJs">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
