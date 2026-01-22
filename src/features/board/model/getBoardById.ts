import { boardAPI } from "../../../entities/board/api/boardAPI";

export const getBoardById = async (id: number) => {
  if (!id) return;
  try {
    const res = await boardAPI.getBoard(id);
    return res.data.responseObject;
  } catch (error) {
    console.log("Error fetching board data: ", error);
    throw error;
  }
};
