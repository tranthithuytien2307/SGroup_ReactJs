import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";

export const archiveWorkspace = async (workspaceId: number) => {
  if (!workspaceId) return;
  try {
    const res = await workspaceAPI.archiveWorkspace(workspaceId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to archive workspace:", error);
    throw error;
  }
};
