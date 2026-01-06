import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";
import SideBarFooter from "./SideBarFooter";
import { getInformationUser } from "@/features/dashboard/model/getInformationUser";
import { useEffect, useState } from "react";
import { workspaceAPI } from "@/shared/api/workspaceAPI";
import { boardAPI } from "@/shared/api/boardAPI";

interface UserType {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: {
    id: number;
    name: "admin" | "staff" | "user";
    description?: string;
  };
}

interface Board {
  id: number;
  name: string;
}

type Workspace = {
  id: number;
  name: string;
  description: string;
  countBoard: number;
};

export default function SideBar() {
  const [dataUser, setDataUser] = useState<UserType | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selected, setSelected] = useState<Workspace | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    getInformationUser(setDataUser);

    const fetchData = async () => {
      const res = await workspaceAPI.getWorkspaces();
      const ws = res.data.responseObject;
      setWorkspaces(ws);
      setSelected(ws[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selected?.id) return;

    const fetchBoards = async () => {
      try {
        const res = await boardAPI.getBoardsByWorkspaceId(selected.id);
        setBoards(res.data.responseObject);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetchBoards();
  }, [selected]);

  return (
    <div className="flex flex-col justify-between h-screen border-r border-gray-200 bg-gray-50 min-w-[64px]">
      <div className="flex flex-col justify-between">
        <SideBarHeader
          workspaces={workspaces}
          selected={selected}
          setSelected={setSelected}
        />
        <SideBarContent boards={boards} />
      </div>
      <SideBarFooter user={dataUser} />
    </div>
  );
}
