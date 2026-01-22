import { inviteMemberAPI } from "../../../entities/board/api/inviteMemberAPI";

export const regenerateLinkShare = async (boardId: number) => {
  try {
    await inviteMemberAPI.regenerateLink(boardId);
  } catch (error) {
    console.log("Error regenerate link: ", error);
    throw error;
  }
};
