import api from "../../../../shared/lib/axiosInstance";

export const resendApi = {
  resendCode: (email: string) =>
    api.post("/auth/resend-code", { email }),
};