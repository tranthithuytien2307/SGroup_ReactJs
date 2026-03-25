import { Navigate } from "react-router-dom";
import { useAuthStore } from "../entities/auth/model/auth.store";
import LoginForm from "../widgets/login/LoginForm";
import { PATH } from "../shared/config/PATH";

export default function LoginPage() {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to={PATH.DASHBOARD} replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <LoginForm></LoginForm>
    </div>
  );
}
