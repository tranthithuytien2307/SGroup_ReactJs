import api from "../../../shared/lib/axiosInstance";

export const getAllChecklists = async () => {
  try {
    const res = await api.get("/checklist");
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to get all checklists:", error);
    throw error;
  }
};
