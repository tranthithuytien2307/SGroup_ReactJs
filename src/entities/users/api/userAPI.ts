import api from "../../../shared/lib/axiosInstance";

export const userAPI = {
  getInformation: () => {
    return api.get("/auth/information");
  },

  updateProfile: (data: { name: string; email: string }) => {
    return api.put("/user/profile", data);
  },

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.put("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
