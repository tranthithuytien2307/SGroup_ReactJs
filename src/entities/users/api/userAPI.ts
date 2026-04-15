import api from "../../../shared/lib/axiosInstance";
import { uploadWithPresignedUrl } from "../../../shared/lib/uploadWithPresignedUrl";

export const userAPI = {
  getInformation: () => {
    return api.get("/auth/information");
  },

  updateProfile: (data: { name?: string; email?: string; bio?: string }) => {
    return api.put("/user/profile", data);
  },

  createAvatarUploadUrl: (file: File) => {
    return api.post("/user/avatar/presign", {
      file_name: file.name,
      content_type: file.type || "application/octet-stream",
    });
  },

  completeAvatarUpload: (avatar_url: string) => {
    return api.put("/user/avatar", { avatar_url });
  },

  uploadAvatar: async (file: File) => {
    const presignRes = await userAPI.createAvatarUploadUrl(file);
    const { uploadUrl, fileUrl } = presignRes.data.responseObject;

    await uploadWithPresignedUrl(uploadUrl, file);

    return userAPI.completeAvatarUpload(fileUrl);
  },
};
