import api from "@/shared/lib/axiosInstance";

export const boardInviteAPI = {
  inviteByEmail: ({ boardId, email }: { boardId: number; email: string }) => {
    return api.post(`/board/${boardId}/invation-email`, { email });
  },

  inviteByLink: (boardId: number) => {
    return api.get(`/board/${boardId}/link_invite`);
  },

  regenerateLink: (boardId: number) => {
    return api.post(`/board/${boardId}/invite/regenerate`);
  },

  disableLink: (boardId: number) => {
    return api.post(`/board/${boardId}/invite/disable`);
  },
};
