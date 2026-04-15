import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";

export const updateWorkspace = async ({
  name,
  description,
  is_active,
  workspace_id,
}: {
  name: string;
  description: string;
  is_active: boolean;
  workspace_id: number;
}) => {
  try {
    const res = await workspaceAPI.updatedWorkspace({
      name,
      description,
      is_active,
      workspace_id,
    });

    return res.data.responseObject;
  } catch (error) {
    console.error("Failed to update workspace:", error);
    throw error;
  }
};
