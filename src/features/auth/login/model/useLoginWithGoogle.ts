import { loginApi } from "../api/login.api";
import { useAuthStore } from "../../../../entities/auth/model/auth.store";

export async function exchangeCode(
  code: string,
  navigate: (path: string) => void
) {
  try {
    const res = await loginApi.exchangeCode({ code });
    const data = res.data;

    if (data.success === true) {
      const { accessToken, refreshToken } = data.responseObject;
      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);
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
