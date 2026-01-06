import { useState } from "react";
import { userAPI } from "@/shared/api/userAPI";

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const updateProfile = async (name: string, email: string) => {
    try {
      setLoading(true);
      await userAPI.updateProfile({ name, email });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setAvatarLoading(true);
      const res = await userAPI.uploadAvatar(file);
      alert("Avatar updated!");
      return res.data.responseObject.avatar_url;
    } catch (err: any) {
      alert(err?.response?.data?.message || "Upload avatar failed");
    } finally {
      setAvatarLoading(false);
    }
  };

  return {
    updateProfile,
    uploadAvatar,
    loading,
    avatarLoading,
  };
}
