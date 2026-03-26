import axios from "axios";
import { CONFIG } from "../config/config";

let getAccessToken: (() => string | null) | null = null;
let onUnauthorized: (() => Promise<string | null>) | null = null;

export const registerAuthHandlers = (handlers: {
  getAccessToken: () => string | null;
  onUnauthorized: () => Promise<string | null>;
}) => {
  getAccessToken = handlers.getAccessToken;
  onUnauthorized = handlers.onUnauthorized;
};

const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: CONFIG.API_BASE_URL,
});

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken?.();
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
      onUnauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await onUnauthorized();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
export default api;
