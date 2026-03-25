import { boardMemberAPI } from "../../../entities/board/api/boardMemberAPI";

export const getBoardMember = async (boardId: number) => {
  if (!boardId) return;
  try {
    const res = await boardMemberAPI.getBoardMember(boardId);
    return res.data.responseObject;
  } catch (error) {
    console.log("Error fetching board members: ", error);
    throw error;
  }
};
