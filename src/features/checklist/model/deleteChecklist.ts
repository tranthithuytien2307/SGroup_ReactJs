import api from "../../../shared/lib/axiosInstance";

export const deleteChecklist = async (id: number): Promise<void> => {
  if (!id) return;
  try {
    await api.delete(`/checklist/${id}`);
  } catch (error) {
    console.error(`Failed to delete checklist with id ${id}:`, error);
    throw error;
  }
};
