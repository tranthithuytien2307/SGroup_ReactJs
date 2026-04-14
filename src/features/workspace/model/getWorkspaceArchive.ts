import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";

export const getWorkspaceArchive = async () => {
  try {
    const res = await workspaceAPI.getWorkspaceArchive();
    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to fetch archived workspaces:", error);
    throw error;
  }
};
