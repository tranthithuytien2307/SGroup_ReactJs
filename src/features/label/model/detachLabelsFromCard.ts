import { labelAPI } from "../../../entities/label/api/labelAPI";

export const detachLabelsFromCard = async (
  card_id: number,
  label_ids: number[],
) => {
  if (!card_id || label_ids.length === 0) return;
  try {
    await labelAPI.detachLabelsFromCard(card_id, label_ids);
  } catch (error) {
    console.error("Failed to detach labels from card: ", error);
    throw error;
  }
};
