import { cardAPI } from "../../../entities/card/api/cardAPI";

export const removeMemberFromCard = async (cardId: number, userId: number) => {
  if (!cardId || !userId) return;

  try {
    const res = await cardAPI.removeMember(cardId, userId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error removing member from card: ", error);
    throw error;
  }
};
