import { inviteMemberAPI } from "../../../entities/board/api/inviteMemberAPI";

export const linkShareInvite = async (boardId: number) => {
  try {
    const res = await inviteMemberAPI.inviteByLink(boardId);
    const invite_enable = res.data.responseObject.invite_enabled;
    const link = res.data.responseObject.inviteUrl;
    if (!invite_enable) {
      return null;
    }
    return link;
  } catch (error) {
    console.log("Get link invite share error: ", error);
    throw error;
  }
};
