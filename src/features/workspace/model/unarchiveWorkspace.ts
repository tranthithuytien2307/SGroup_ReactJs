import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";

export const unarchiveWorkspace = async (workspaceId: number) => {
  if (!workspaceId) return;
  try {
    const res = await workspaceAPI.unarchiveWorkspace(workspaceId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to unarchive workspace:", error);
    throw error;
  }
};
