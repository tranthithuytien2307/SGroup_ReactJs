import { boardAPI } from "../../../entities/board/api/boardAPI";

export const getBoardByUser = async () => {
  try {
    const res = await boardAPI.getBoardByUserId();
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to fetch boards by user:", error);
    throw error;
  }
};
