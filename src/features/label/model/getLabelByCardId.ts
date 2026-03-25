import { labelAPI } from "../../../entities/label/api/labelAPI";

export const getLabelByCardId = async (card_id: number) => {
  if (!card_id) return [];
  try {
    const res = await labelAPI.getLabelsByCardId(card_id);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to get labels by card id: ", error);
    throw error;
  }
};
