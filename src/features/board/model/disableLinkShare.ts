import { boardInviteAPI } from "../api/boardInviteAPI";

export const disableLinkShare = async (boardId: number) => {
  try {
    await boardInviteAPI.disableLink(boardId);
  } catch (error) {
    console.log("Error disable link: ", error);
    throw error;
  }
};
