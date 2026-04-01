import { create } from "zustand";
import type { User } from "../../users/type/types";
import { userAPI } from "../../../entities/users/api/userAPI";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  fetchUser: () => Promise<void>;
}

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN),
  refreshToken: localStorage.getItem(REFRESH_TOKEN),
  user: JSON.parse(localStorage.getItem("user") || "null"),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    set({ accessToken, refreshToken });
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("user");

    set({ accessToken: null, refreshToken: null, user: null });
  },

  fetchUser: async () => {
    try {
      const res = await userAPI.getInformation();
      const user = res.data.responseObject;

      const formattedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        isVerified: user.isVerified ?? true,
      };

      localStorage.setItem("user", JSON.stringify(formattedUser));

      set({ user: formattedUser });
    } catch (err) {
      console.error("Fetch user failed", err);
    }
  },
}));
