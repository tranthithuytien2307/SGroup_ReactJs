import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/LoginPage";
import { ProtectedRoute } from "@/shared/ProtectedRoute";

export default function PATHS() {
  return (
    <BrowserRouter basename="/SGroup_ReactJs">
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
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
