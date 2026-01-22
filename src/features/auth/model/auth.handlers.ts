import axios from "axios";
import { useAuthStore } from "../../../entities/auth/model/auth.store";
import { CONFIG } from "../../../shared/config/config";
import { PATH } from "../../../shared/config/PATH";

export const authHandlers = {
  getAccessToken: () => {
    return useAuthStore.getState().accessToken;
  },

  onUnauthorized: async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      const { accessToken } = response.data.responseObject;
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      return accessToken;
    } catch (error) {
      useAuthStore.getState().clearTokens();
      window.location.href = PATH.LOGIN;
      return null;
    }
  },
};
