import { cardAPI } from "../../../entities/card/api/cardAPI";

export const addMemberToCard = async (cardId: number, userId: number) => {
  if (!cardId || !userId) return;

  try {
    const res = await cardAPI.addMember(cardId, userId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error adding member to card: ", error);
    throw error;
  }
};
