import { WorkspaceIcon } from "../../../shared/ui/icon/WorkspaceIcon";
import { CaretDown } from "../../../shared/ui/icon/CaretDown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../shared/ui/dropdown-menu";
import { Pencil, Circle, Archive } from "lucide-react";
import type { Workspace } from "../../../entities/workspace/model/workspaceType";
import { useWorkspaceStore } from "../../../features/workspace/model/workspaceStore";
import toast from "react-hot-toast";
import { useState } from "react";
import EditWorkspaceModal from "../../workspace/EditWorkspaceModal";

interface Props {
  workspaces: Workspace[];
  selected: Workspace | null;
  setSelected: React.Dispatch<React.SetStateAction<Workspace | null>>;
}

export default function SideBarHeader({
  workspaces,
  selected,
  setSelected,
}: Props) {
  const archiveWorkspace = useWorkspaceStore((state) => state.archiveWorkspace);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );

  const handleArchiveWorkspace = async (id: number) => {
    console.log("Attempting to archive workspace with ID:", id);
    try {
      console.log("Archiving workspace with ID:", id);
      await archiveWorkspace(id);

      toast.success("Workspace archived successfully");
    } catch (error) {
      console.error("Error archiving workspace:", error);

      toast.error("Failed to archive workspace");
    }
  };
  return (
    <div className="relative p-2 h-auto">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="p-2 gap-2 flex items-center cursor-pointer rounded-lg hover:bg-accent transition data-[state=open]:bg-accent">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-2 bg-blue-600 rounded-2xl text-white">
                <WorkspaceIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {selected
                    ? selected.name
                    : workspaces.length > 0
                      ? "Loading..."
                      : "No workspace yet"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selected
                    ? selected.description
                    : workspaces.length > 0
                      ? ""
                      : "Create a workspace to get started"}
                </span>
              </div>
            </div>
            <CaretDown />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-lg border bg-white shadow-xl p-1 z-50 absolute translate-x-[60%] translate-y-[-20%] w-72">
          <div className="flex items-center justify-between px-2 py-1">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto pr-1">
            {Array.isArray(workspaces) && workspaces.length === 0 && (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                No workspace available
              </div>
            )}

            {Array.isArray(workspaces) &&
              workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center justify-between gap-4 cursor-pointer rounded-md px-2 py-2 hover:bg-accent group"
                >
                  <div
                    className="flex items-center gap-2 min-w-0"
                    onClick={() => setSelected(ws)}
                  >
                    <div className="p-2 bg-blue-600 rounded-xl text-white">
                      <WorkspaceIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium truncate">{ws.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ws.countBoard}{" "}
                        {ws.countBoard === 1 ? "board" : "boards"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEditingWorkspace(ws);
                        setOpenEdit(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
                    </button>

                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleArchiveWorkspace(ws.id);
                      }}
                    >
                      <Archive className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                    </button>

                    {selected?.id === ws.id && (
                      <Circle className="w-2 h-2 fill-blue-500 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
          </div>
          {openEdit && editingWorkspace && (
            <EditWorkspaceModal
              workspace={editingWorkspace}
              onClose={() => setOpenEdit(false)}
            />
          )}

          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
