import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import { PATH } from "../../shared/config/PATH";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to={PATH.LOGIN} replace />;
  }
  return <>{children}</>;
}
