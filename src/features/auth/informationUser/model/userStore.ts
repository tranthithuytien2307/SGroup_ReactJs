import { create } from "zustand";
import { updateInformationUser } from "./updateInformationUser";
import { useAuthStore } from "../../../../entities/auth/model/auth.store";

interface UserState {
  loading: boolean;
  error: string | null;

  updateUser: (name: string, email: string, bio: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  loading: false,
  error: null,

  updateUser: async (name, email, bio) => {
    set({ loading: true, error: null });

    try {
      const updatedUser = await updateInformationUser(name, email, bio);

      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error("User not found");
      }

      const newUser = {
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio ?? null,
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      useAuthStore.setState({ user: newUser });

      set({ loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || "Update failed",
      });
      throw error;
    }
  },
}));
