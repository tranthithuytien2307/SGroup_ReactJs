import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";

export const getBoardArchiveByWorkspaceId = async (workspaceId: number) => {
  if (!workspaceId) return;
  try {
    const res = await workspaceAPI.getBoardsArchiveByWorkspaceId(workspaceId);
    return res.data.responseObject || [];
  } catch (error) {
    console.error("Failed to fetch archived boards:", error);
    throw error;
  }
};
