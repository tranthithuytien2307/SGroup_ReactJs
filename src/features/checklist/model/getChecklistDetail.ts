import api from "../../../shared/lib/axiosInstance";
export const getChecklistDetail = async (id: number) => {
  if (!id) return;
  try {
    const res = await api.get(`/checklist/${id}`);
    return res.data.responseObject;
  } catch (error) {
    console.error(`Failed to get checklist detail for id ${id}:`, error);
    throw error;
  }
};
