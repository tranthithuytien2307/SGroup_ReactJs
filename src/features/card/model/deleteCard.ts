import { cardAPI } from "../../../entities/card/api/cardAPI";

export const deleteCrad = async (id: number) => {
  if (!id) return;

  try {
    await cardAPI.deleteCard(id);
  } catch (error) {
    console.error("Failed to delete card: ", error);
    throw error;
  }
};
