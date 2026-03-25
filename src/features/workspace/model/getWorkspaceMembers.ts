import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";
import type { WorkspaceMember } from "../../../entities/users/type/types";

export const getWorkspaceMembers = async (
  workspaceId: number,
): Promise<WorkspaceMember[]> => {
  try {
    const res = await workspaceAPI.getMembers(workspaceId);
    return res.data.responseObject;
  } catch (error) {
    console.error("Get workspace members error:", error);
    return [];
  }
};