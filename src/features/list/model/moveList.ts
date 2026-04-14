import { listAPI } from "../../../entities/list/api/listAPI";

export const moveList = async (
  id: number,
  newBoardId: number,
  newIndex: number,
  boardVersion: number,
  targetBoardVersion?: number,
) => {
  if (!id || !newBoardId || newIndex === undefined || boardVersion === undefined)
    return;
  try {
    const response = await listAPI.moveList(
      id,
      newBoardId,
      newIndex,
      boardVersion,
      targetBoardVersion,
    );
    return response.data.responseObject;
  } catch (error) {
    console.log(`Error moving card ${id}: `, error);
    throw error;
  }
};
