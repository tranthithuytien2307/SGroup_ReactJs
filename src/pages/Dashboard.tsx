import SideBar from "@/shared/ui/sidebar/SideBar";
import WorkspaceSection from "@/features/dashboard/ui/WorkspaceSection";
import { workspaceAPI } from "@/shared/api/workspaceAPI";
import { useEffect, useState } from "react";
import DashboardContentHeader from "@/features/dashboard/ui/DashboardContentHeader";

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

  const onAddWorkspace = () => {
    alert("hi");
  }

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
            <DashboardContentHeader onAddWorkspace={onAddWorkspace} />
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
