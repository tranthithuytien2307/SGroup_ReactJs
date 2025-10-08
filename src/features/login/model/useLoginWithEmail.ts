import { loginApi } from "../api/loginApi";

export async function submit(email: string, password: string) {
  const ACCESS_TOKEN = "accessToken";
  const REFRESH_TOKEN = "refreshToken";

  try {
    const res = await loginApi.login({ email, password });
    const { accessToken, refreshToken } = res.data.result;

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  } catch (err) {
    console.error(err);
  }
}
