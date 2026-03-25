import { labelAPI } from "../../../entities/label/api/labelAPI";

export const updateLabel = async (
  label_id: number,
  name?: string | null,
  color?: string,
) => {
  if (!label_id) return;

  if (name === undefined && color === undefined) return;

  try {
    const res = await labelAPI.updateLabel({ label_id, name, color });

    return res.data;
  } catch (error) {
    console.error("Failed to update label: ", error);
    throw error;
  }
};
