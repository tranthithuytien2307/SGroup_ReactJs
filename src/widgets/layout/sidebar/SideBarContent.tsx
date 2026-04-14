import { useState } from "react";
import LoadingSpinner from "../../../shared/ui/LoadingSpinner";
import { ChevronDown, ChevronRight, LayoutGrid, LayoutTemplate, Archive  } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PATH } from "../../../shared/config/PATH";
import ArchivedBoardsModal from "../../workspace/ArchivedBoardsModal";
import { useWorkspaceStore } from "../../../features/workspace/model/workspaceStore";
import { useSelectedWorkspace } from "../../../features/workspace/SelectedWorkspaceContext";
import toast from "react-hot-toast";

interface Board {
  id: number;
  name: string;
}

interface Props {
  boards: Board[];
}

export default function SideBarContent({ boards }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);

  const { id } = useParams();
  const activeBoardId = Number(id);
  const location = useLocation();

  const { selected } = useSelectedWorkspace();

  const { archivedBoards, loadingArchive, getBoardArchiveByWorkspaceId } =
    useWorkspaceStore();

  const isDashboardActive =
    location.pathname === PATH.DASHBOARD ||
    location.pathname.endsWith(PATH.DASHBOARD);

  const handleBoardDetail = (id: number) => {
    navigate(PATH.BOARDPAGE(id));
  };

  const handleOnDashboard = () => {
    navigate(PATH.DASHBOARD);
  };

  const handleOnTemplates = () => {
    navigate(PATH.TEMPLATES);
  };

  const isTemplatesActive = location.pathname === PATH.TEMPLATES;
  const handleOpenArchive = async () => {
    if (!selected?.id) return;

    try {
      setOpenArchiveModal(true);

      await getBoardArchiveByWorkspaceId(selected.id);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load archived boards ❌",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
          Navigation
        </p>

        <button
          className={`flex items-center gap-2 text-sm font-medium bg-muted px-2 py-1.5 rounded-md w-full cursor-pointer ${
            isDashboardActive
              ? "bg-gray-200 text-gray-900"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onClick={handleOnDashboard}
        >
          <LayoutGrid className="w-4 h-4" />
          Dashboard
        </button>
        <button
          className={`flex items-center gap-2 text-sm font-medium px-2 py-1.5 rounded-md w-full cursor-pointer ${isTemplatesActive ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100 text-gray-700"}`}
          onClick={() => handleOnTemplates()}
        >
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
          Boards
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted w-full transition-colors"
          >
            {open ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            All Boards
          </button>

          <button
            onClick={handleOpenArchive}
            className="p-1.5 rounded-md hover:bg-gray-100 transition"
          >
            <Archive className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {open && (
          <div className="ml-6 mt-1 flex flex-col gap-1">
            {boards.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Chưa có board nào
              </p>
            )}

            {boards.map((board) => {
              const isActive = board.id === activeBoardId;

              return (
                <button
                  key={board.id}
                  onClick={() => handleBoardDetail(board.id)}
                  className={`
                    text-sm px-2 py-1 rounded-md text-left transition-colors cursor-pointer
                    ${
                      isActive ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
                    }
                  `}
                >
                  {board.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ArchivedBoardsModal
        open={openArchiveModal}
        onClose={() => setOpenArchiveModal(false)}
        boards={archivedBoards}
        loading={loadingArchive}
        onOpenBoard={handleBoardDetail}
      />
    </div>
  );
}
