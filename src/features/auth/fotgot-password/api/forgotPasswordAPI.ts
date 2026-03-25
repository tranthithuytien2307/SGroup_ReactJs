import api from "../../../../shared/lib/axiosInstance";

export const forgotpasswordAPI = {
  forgotpassword: (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },
};
