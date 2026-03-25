import { loginApi } from "../api/login.api";
import { useAuthStore } from "../../../../entities/auth/model/auth.store";

export async function submit(email: string, password: string) {
  try {
    const res = await loginApi.login({ email, password });
    const { accessToken, refreshToken } = res.data.responseObject;

    const { setTokens } = useAuthStore.getState();
    setTokens(accessToken, refreshToken);

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Invalid email or password",
    };
  }
}
