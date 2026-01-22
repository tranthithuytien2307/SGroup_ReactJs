import { useState, useEffect } from "react";
import { workspaceAPI } from "../../../entities/workspace/api/workspaceAPI";
import { useSelectedWorkspace } from "../SelectedWorkspaceContext";
import type { Workspace } from "../../../entities/workspace/model/workspaceType";

export const useWorkspaces = () => {
  const { selected } = useSelectedWorkspace();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selected) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await workspaceAPI.getWorkspace(selected.id);
        setWorkspace(res.data.responseObject);
      } catch (err) {
        console.error("Load workspace failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selected]);

  return { workspace, setWorkspace, loading };
};
