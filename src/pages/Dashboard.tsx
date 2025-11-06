import SideBar from "@/shared/ui/sidebar/SideBar";
import WorkspaceSection from "@/features/dashboard/ui/WorkspaceSection";
import { workspaceAPI } from "@/shared/api/workspaceAPI";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

type Board = {
  id: number | string;
  name: string;
};

type Workspace = {
  id: string | number;
  name: string;
  description: string;
  boards: Board[];
  countBoard: number;
};

export default function Dashboard() {
  const [data, setData] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await workspaceAPI.getWorkspaces();
        setData(res.data);
      } catch (err) {
        console.log("Err: ", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full">
      <SideBar />
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-screen">
          <div className="pl-4 border-b">
            <p className="text-lg font-semibold text-gray-900 p-4">Dashborad</p>
          </div>
          <div className="flex-1 p-8 flex-col gap-3 overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold tracking-tight">Dashboard</p>
                <p className="text-muted-foreground">
                  Manage your workspaces and boards
                </p>
              </div>
              <Button className="whitespace-normal inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <p>New Workspace</p>
              </Button>
            </div>
            <div className="flex-1">
              {data.map((ws) => (
                <WorkspaceSection
                  key={ws.id}
                  id={ws.id}
                  name={ws.name}
                  description={ws.description}
                  boards={ws.boards}
                  countBoard={ws.countBoard}
                  onAddBoard={(id) =>
                    console.log("Thêm board vào workspace", id)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
