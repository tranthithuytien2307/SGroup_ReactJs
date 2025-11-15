import api from "@/shared/lib/axiosInstance";

export const loginApi = {
  login: ({ email, password }: { email: string; password: string }) => {
    return api.post("/auth/login", { email, password });
  },
  exchangeCode: ({ code }: { code: string }) => {
    return api.post("/auth/google/login", { code });
  },
};
