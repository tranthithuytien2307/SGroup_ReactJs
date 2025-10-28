import api from "../lib/axiosInstance";

export const userAPI = {
  getInformation: () => {
    return api.get("/auth/information");
  },
};
