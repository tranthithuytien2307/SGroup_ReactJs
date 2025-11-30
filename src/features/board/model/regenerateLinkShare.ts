import { boardInviteAPI } from "../api/boardInviteAPI";

export const regenerateLinkShare = async (boardId: number) => {
  try {
    await boardInviteAPI.regenerateLink(boardId);
  } catch (error) {
    console.log("Error regenerate link: ", error);
    throw error;
  }
};
