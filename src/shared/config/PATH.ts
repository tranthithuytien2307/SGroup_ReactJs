export const PATH = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  TEMPLATES: "/templates",
  BOARDPAGE: (id: number) => `/dashboard/board/${id}`,
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  UPDATE_PROFILE: "/profile/edit",
};
