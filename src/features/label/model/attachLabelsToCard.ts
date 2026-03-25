import { labelAPI } from "../../../entities/label/api/labelAPI";

export const attachLabelsToCard = async (
  card_id: number,
  label_ids: number[],
) => {
  if (!card_id || label_ids.length === 0) return;
  try {
    await labelAPI.attachLabelsToCard(card_id, label_ids);
  } catch (error) {
    console.error("Failed to attach labels to card: ", error);
    throw error;
  }
};
