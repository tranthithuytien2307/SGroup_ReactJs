import { cardAPI } from "../../../entities/card/api/cardAPI";

export const createCard = async (listId: number, title: string) => {
  if (!listId || !title.trim()) return;

  try {
    await cardAPI.createCard(listId, title);
  } catch (error) {
    console.error("Error creating card: ", error);
    throw error;
  }
};
