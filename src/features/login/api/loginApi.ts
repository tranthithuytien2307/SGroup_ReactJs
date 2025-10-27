import api from "@/shared/lib/axiosInstance";

export const loginApi = {
  login: ({ email, password }: { email: string; password: string }) => {
    return api.post("/auth/login", { email, password });
  },
};
