import { labelAPI } from "../../../entities/label/api/labelAPI";

export const deleteLabel = async (label_id: number) => {
  if (!label_id) return;

  try {
    await labelAPI.deleteLabel(label_id);
    return true;
  } catch (error) {
    console.error("Failed to delete label: ", error);
    throw error;
  }
};
