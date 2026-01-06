import { useState, useEffect } from "react";
import { workspaceAPI } from "@/shared/api/workspaceAPI";

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await workspaceAPI.getWorkspaces();
        setWorkspaces(res.data.responseObject);
      } catch (err) {
        console.error("Load workspace failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { workspaces, setWorkspaces, loading };
};
