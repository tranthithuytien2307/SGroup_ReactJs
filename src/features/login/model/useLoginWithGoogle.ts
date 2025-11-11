import { loginApi } from "../api/loginApi";
import { useAuthStore } from "@/entities/user/model/authStore";

export async function exchangeCode(
  code: string,
  navigate: (path: string) => void
) {
  try {
    const res = await loginApi.exchangeCode({ code });
    const data = res.data;

    if (data.success === true) {
      const { accessToken, refreshToken } = data.responseObject;
      const { setTokens } = useAuthStore.getState();
      setTokens(accessToken, refreshToken);

      navigate("/dashboard");
    } else {
      throw new Error("User not authenticated");
    }
  } catch (err) {
    console.error("Google OAuth error:", err);
    navigate("/login");
  }
}
