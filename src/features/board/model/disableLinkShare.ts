import { inviteMemberAPI } from "../../../entities/board/api/inviteMemberAPI";

export const disableLinkShare = async (boardId: number) => {
  try {
    await inviteMemberAPI.disableLink(boardId);
  } catch (error) {
    console.log("Error disable link: ", error);
    throw error;
  }
};
