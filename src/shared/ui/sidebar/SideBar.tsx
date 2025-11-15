import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";
import SideBarFooter from "./SideBarFooter";
import { getInformationUser } from "@/features/dashboard/model/getInformationUser";
import { useEffect, useState } from "react";
import { workspaceAPI } from "@/shared/api/workspaceAPI";
import { boardAPI } from "@/shared/api/boardAPI";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

interface Board {
  id: string | number;
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
      setWorkspaces(res.data.responseObject);
      setSelected(res.data.responseObject[0]);
      console.log("workspace: ", res.data.responseObject);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selected?.id) return;

    const fetchData = async () => {
      try {
        const res = await boardAPI.getBoardByWorkspaceId(selected.id);
        setBoards(res.data.responseObject);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetchData();
  }, [selected]);

  return (
    <div className="flex flex-col justify-between h-screen border-r-[1px] border-r-gray-200 bg-gray-50 min-w-[64px]">
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
