import SideBar from "@/shared/ui/sidebar/SideBar";
import WorkspaceSection from "@/features/dashboard/ui/WorkspaceSection";
import { workspaceAPI } from "@/shared/api/workspaceAPI";
import { useEffect, useState } from "react";
import DashboardContentHeader from "@/features/dashboard/ui/DashboardContentHeader";
import HeaderContent from "@/shared/ui/ContentHeader";
import { useWorkspace } from "@/shared/context/WorkspaceContext";

type Board = {
  id: number;
  name: string;
  description?: string;
  cover_url?: string;
};

type Workspace = {
  id: number;
  name: string;
  description: string;
  boards: Board[];
  countBoard: number;
};

export default function Dashboard() {
  const { setWorkspaces, workspaces } = useWorkspace();

  const onAddWorkspace = () => {
    alert("hi");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await workspaceAPI.getWorkspaces();
        setWorkspaces(res.data.responseObject);
      } catch (err) {
        console.log("Err: ", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full">
      <SideBar />
      <div className="flex-1">
        <div className="flex flex-col h-screen">
          <HeaderContent headerContent="Dashboard" />
          <div className="flex-1 p-8 flex-col gap-3 overflow-y-auto">
            <DashboardContentHeader onAddWorkspace={onAddWorkspace} />
            <div className="flex-1">
              {Array.isArray(workspaces) &&
                workspaces.map((ws) => (
                  <WorkspaceSection
                    key={ws.id}
                    id={ws.id}
                    name={ws.name}
                    description={ws.description}
                    boards={ws.boards}
                    countBoard={ws.countBoard}
                    onAddBoard={(workspaceId, boardData) => {
                      console.log(
                        "Add board to workspace:",
                        workspaceId,
                        boardData
                      );
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
