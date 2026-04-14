import SideBarHeader from "./SideBarHeader";
import SideBarContent from "./SideBarContent";
import SideBarFooter from "./SideBarFooter";
import { useEffect, useState } from "react";
import { boardAPI } from "../../../entities/board/api/boardAPI";
import type { Board } from "../../../entities/board/model/boardType";
import { useSelectedWorkspace } from "../../../features/workspace/SelectedWorkspaceContext";
import { useWorkspace } from "../../../features/workspace/WorkspaceContext";
import { useAuthStore } from "../../../entities/auth/model/auth.store";

export default function SideBar() {
  const user = useAuthStore((state) => state.user);
  const [boards, setBoards] = useState<Board[]>([]);
  const { selected, setSelected } = useSelectedWorkspace();
  const { workspaces } = useWorkspace();

  useEffect(() => {
    if (!selected?.id) {
      setBoards([]);
      return;
    }

    const fetchBoards = async () => {
      try {
        const res = await boardAPI.getBoardsByWorkspaceId(selected.id);
        const boardList = res.data.responseObject;

        setBoards(boardList);
      } catch (err) {
        console.error("Error fetching boards:", err);
        setBoards([]);
      }
    };

    void fetchBoards();
  }, [selected?.id]);

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
      <SideBarFooter user={user as any} />
    </div>
  );
}
