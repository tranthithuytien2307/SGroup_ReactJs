import api from "../../../shared/lib/axiosInstance";

export const boardMemberAPI = {
  getBoardMember: async (boardId: number) => {
    return await api.get(`/board-member/${boardId}`);
  },
};
