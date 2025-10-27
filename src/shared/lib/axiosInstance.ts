import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:3000/",
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
  (respone) => respone,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 403) {
      try {
        const refeshTokenOld = localStorage.getItem(REFRESH_TOKEN);
        if (!refeshTokenOld) throw new Error("refresh token not available");

        const res = await axios.post(import.meta.env.VITE_BACKEND_URL + `/auth/refresh`, {
          refeshToken: refeshTokenOld,
        });

        const { accessToken } = res.data.result;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token expried - redirecting to login");
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
