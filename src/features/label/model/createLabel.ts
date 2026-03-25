import { labelAPI } from "../../../entities/label/api/labelAPI";
import type { Label } from "../../../entities/label/model/labelType";

export const createLabel = async (
  board_id: number,
  name: string | null,
  color: string,
): Promise<Label | null> => {
  if (!board_id || !color.trim()) return null;

  try {
    const res = await labelAPI.createLabel(board_id, name, color);
    return res.data;
  } catch (error) {
    console.error("Failed to create label: ", error);
    throw error;
  }
};
