import api from "../../../../shared/lib/axiosInstance";

export const registerApi = {
  register: ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    return api.post("/auth/register", { name, email, password });
  },
};
