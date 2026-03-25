import api from "../../../shared/lib/axiosInstance";

export const updateChecklistTitle = async (id: number, title: string) => {
  if (!id || !title) return;
  try {
    const res = await api.put(`/checklist/${id}`, { title });
    return res.data.responseObject;
  } catch (error) {
    console.error(`Failed to update checklist title for id ${id}:`, error);
    throw error;
  }
};
