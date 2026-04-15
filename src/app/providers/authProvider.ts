import { registerAuthHandlers } from "../../shared/lib/axiosInstance";
import { authHandlers } from "../../features/auth/model/auth.handlers";
import { useAuthStore } from "../../entities/auth/model/auth.store";

export const initAuth = () => {
  registerAuthHandlers(authHandlers);

  const { accessToken, user, fetchUser } = useAuthStore.getState();
  if (accessToken && !user) {
    void fetchUser();
  }
};
