import { registerAuthHandlers } from "../../shared/lib/axiosInstance";
import { authHandlers } from "../../features/auth/model/auth.handlers";

export const initAuth = () => {
  registerAuthHandlers(authHandlers);
};
