import { useState, useEffect } from "react";
import { boardAPI } from "@/shared/api/boardAPI";
import type { Workspace } from "@/shared/types"; 

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await boardAPI.getBoards();
        const data: Workspace[] = res.data.responseObject.map((ws: any) => ({
          ...ws,
          id: Number(ws.id),
          boards:
            ws.boards?.map((b: any) => ({
              ...b,
              id: Number(b.id),
            })) ?? [],
        }));
        setWorkspaces(data);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { workspaces, setWorkspaces, loading };
};
