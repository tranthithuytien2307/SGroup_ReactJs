import { loginApi } from "../api/login.api";
import { useAuthStore } from "../../../../entities/auth/model/auth.store";

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
