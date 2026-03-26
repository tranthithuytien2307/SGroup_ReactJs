import { cardAPI } from "../../../entities/card/api/cardAPI";

export const createCard = async (listId: number, title: string) => {
  if (!listId || !title.trim()) return;

  try {
    const res = await cardAPI.createCard(listId, title);
    return res.data.responseObject;
  } catch (error) {
    console.error("Error creating card: ", error);
    throw error;
  }
};
