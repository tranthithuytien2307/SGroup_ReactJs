import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";
import type { Workspace } from "../../../entities/workspace/model/workspaceType";

export const createWorkspaceInModel = async (
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>,
  setSelected: React.Dispatch<React.SetStateAction<Workspace | null>>,
  data: { name: string; description?: string },
) => {
  try {
    const res = await workspaceAPI.createWorkspace({
      name: data.name,
      description: data.description ?? "",
    });

    const newWorkspace: Workspace = {
      ...res.data.responseObject,
      boards: res.data.responseObject?.boards ?? [],
      countBoard: res.data.responseObject?.countBoard ?? 0,
    };

    setWorkspace(newWorkspace);
    setSelected(newWorkspace);
  } catch (error) {
    console.log("Create Workspace failed: ", error);
    throw error;
  }
};
