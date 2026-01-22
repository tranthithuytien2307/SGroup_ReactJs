import { boardAPI } from "../../../entities/board/api/boardAPI";

export const getBoardsByWorkspaceId = async (workspaceId: number) => {
  if (!workspaceId) return;
  try {
    const res = await boardAPI.getBoardsByWorkspaceId(workspaceId);
    return res.data.responseObject;
  } catch (error) {
    console.log("Error fetching boards by workspace ID: ", error);
    throw error;
  }
};
