import { inviteMemberAPI } from "../../../entities/board/api/inviteMemberAPI";

export const invitationEmail = async (id: number, email: string) => {
  try {
    await inviteMemberAPI.inviteByEmail({ boardId: id, email });
  } catch (error) {
    console.log("Invite email failed: ", error);
    throw error;
  }
};
