import { loginApi } from "../api/loginApi";
import { useAuthStore } from "@/entities/user/model/authStore";

export async function submit(
  email: string,
  password: string,
  navigate: (path: string) => void
) {
  try {
    const res = await loginApi.login({ email, password });
    const { accessToken, refreshToken } = res.data.responseObject;

    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);

    const { setTokens } = useAuthStore.getState();
    setTokens(accessToken, refreshToken);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
}
