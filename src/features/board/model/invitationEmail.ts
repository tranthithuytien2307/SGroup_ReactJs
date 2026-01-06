import { boardInviteAPI } from "../api/boardInviteAPI";

export const invitationEmail = async (id: number, email: string) => {
  try {
    await boardInviteAPI.inviteByEmail({ boardId: id, email });
  } catch (error) {
    console.log("Invite email failed: ", error);
    throw error;
  }
};
