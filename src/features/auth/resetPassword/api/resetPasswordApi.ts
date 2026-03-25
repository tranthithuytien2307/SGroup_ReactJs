import api from "../../../../shared/lib/axiosInstance";

export const resetPasswordApi = {
  resetPassword: ({
    email,
    token,
    newPassword,
  }: {
    email: string;
    token: string;
    newPassword: string;
  }) => {
    return api.post("/auth/reset-password", {
      email,
      token,
      newPassword,
    });
  },
};
