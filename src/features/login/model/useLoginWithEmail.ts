import { loginApi } from "../api/loginApi";

export async function submit(
  email: string,
  password: string,
  navigate: (path: string) => void
) {
  const ACCESS_TOKEN = "accessToken";
  const REFRESH_TOKEN = "refreshToken";

  try {
    const res = await loginApi.login({ email, password });
    const { accessToken, refreshToken } = res.data;

    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
}
