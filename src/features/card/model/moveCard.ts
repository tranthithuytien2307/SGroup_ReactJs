import { cardAPI } from "../../../entities/card/api/cardAPI";

export const moveCard = async (
  id: number,
  toBoardId: number,
  toListId: number,
  newIndex: number,
) => {
  if (!id || !toBoardId || !toListId || newIndex === undefined) return;
  try {
    await cardAPI.moveCard(id, toBoardId, toListId, newIndex);
  } catch (error) {
    console.error(`Error moving card ${id}: `, error);
    throw error;
  }
};
