import axios from "axios";
import { useAuthStore } from "@/entities/user/model/authStore";
import { CONFIG } from "./config";
const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: CONFIG.API_BASE_URL,
});

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshTokenOld = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshTokenOld) throw new Error("No refresh token");

        const res = await axios.post(`http://localhost:3000/api/auth/refresh`, {
          refreshToken: refreshTokenOld,
        });

        const { accessToken } = res.data.responseObject;
        console.log("Refreshed accessToken:", accessToken);

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        const { setTokens } = useAuthStore.getState();
        setTokens(accessToken, refreshTokenOld);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token expired - redirecting to login");
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);

        const { clearTokens } = useAuthStore.getState();
        clearTokens();

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
