import { useState } from "react";
import { userAPI } from "../../../entities/users/api/userAPI";
import { useAuthStore } from "../../../entities/auth/model/auth.store";
import type { User } from "../../../entities/users/type/types";

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const syncAuthUser = (partialUser: Partial<User>) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const nextUser: User = {
      ...currentUser,
      ...partialUser,
    };

    localStorage.setItem("user", JSON.stringify(nextUser));
    useAuthStore.setState({ user: nextUser });
  };

  const updateProfile = async (name: string, email: string, bio?: string) => {
    try {
      setLoading(true);
      const res = await userAPI.updateProfile({ name, email, bio: bio ?? "" });
      const updatedUser = res.data.responseObject;

      syncAuthUser({
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio ?? null,
        avatar_url: updatedUser.avatar_url ?? null,
      });

      return updatedUser;
    } catch (err: any) {
      alert(err?.response?.data?.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setAvatarLoading(true);
      const res = await userAPI.uploadAvatar(file);
      const avatarUrl = res.data.responseObject.avatar_url;

      syncAuthUser({ avatar_url: avatarUrl });

      return avatarUrl;
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
