import api from "../../../../shared/lib/axiosInstance";

export const verifyApi = {
  verifyEmail: (email: string, code: string) =>
    api.get(`/auth/verify-email?email=${email}&code=${code}`),
};
