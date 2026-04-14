import { cardAPI } from "../../../entities/card/api/cardAPI";

export const moveCard = async (
  id: number,
  toBoardId: number,
  toListId: number,
  newIndex: number,
  boardVersion: number,
  targetBoardVersion?: number,
) => {
  if (
    !id ||
    !toBoardId ||
    !toListId ||
    newIndex === undefined ||
    boardVersion === undefined
  )
    return;
  try {
    await cardAPI.moveCard(
      id,
      toBoardId,
      toListId,
      newIndex,
      boardVersion,
      targetBoardVersion,
    );
  } catch (error) {
    console.error(`Error moving card ${id}: `, error);
    throw error;
  }
};
