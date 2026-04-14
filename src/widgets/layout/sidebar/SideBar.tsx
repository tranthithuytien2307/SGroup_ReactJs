import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";
import SideBarFooter from "./SideBarFooter";
import { useEffect, useState } from "react";
import { boardAPI } from "../../../entities/board/api/boardAPI";
import type { Board } from "../../../entities/board/model/boardType";
import { useSelectedWorkspace } from "../../../features/workspace/SelectedWorkspaceContext";
import { useWorkspace } from "../../../features/workspace/WorkspaceContext";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../shared/config/PATH";
import { getInformationUser } from "../../../features/auth/informationUser/model/getInformationUser";
import { useBoardStore } from "../../../features/board/model/boardStore";

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

export default function SideBar() {
  const [dataUser, setDataUser] = useState<UserType | null>(null);
  const boards = useBoardStore((state) => state.boards);
  const setBoards = useBoardStore((state) => state.setBoards);
  const { selected, setSelected } = useSelectedWorkspace();
  const { workspaces } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    getInformationUser(setDataUser);
  }, []);

  useEffect(() => {
    console.log("Workspaces updated in SideBar:", workspaces);

    if (workspaces.length === 0) return;

    setSelected((prev) => prev ?? workspaces[0]);
  }, [workspaces]);

  useEffect(() => {
    if (!selected?.id) return;

    const fetchBoards = async () => {
      try {
        const res = await boardAPI.getBoardsByWorkspaceId(selected.id);
        const boardList = res.data.responseObject;

        setBoards(boardList);
        if (boardList.length >= 0) {
          navigate(PATH.DASHBOARD);
        }
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    fetchBoards();
  }, [selected]);

  return (
    <div className="flex flex-col justify-between h-screen border-r border-gray-200 bg-gray-50 w-[304px]">
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
