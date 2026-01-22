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
import { Plus, Circle } from "lucide-react";
import type { Workspace } from "../../../entities/workspace/model/workspaceType";

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
  return (
    <div className="relative p-2 h-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="p-2 gap-2 flex items-center cursor-pointer rounded-lg hover:bg-accent transition data-[state=open]:bg-accent">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <WorkspaceIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {selected ? selected.name : "Loading..."}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selected ? selected.description : ""}
                </span>
              </div>
            </div>
            <CaretDown />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-lg border bg-white shadow-xl p-1 z-50 absolute translate-x-[60%] translate-y-[-20%]">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>

          {Array.isArray(workspaces) &&
            workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                className="flex items-center justify-between gap-6 cursor-pointer"
                onClick={() => setSelected(ws)}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <WorkspaceIcon />
                  </div>
                  <div>
                    <p className="font-medium whitespace-nowrap">{ws.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ws.countBoard} {ws.countBoard === 1 ? "board" : "boards"}
                    </p>
                  </div>
                </div>

                {selected?.id === ws.id && (
                  <Circle className="w-1 h-1 fill-blue-500 text-blue-500" />
                )}
              </DropdownMenuItem>
            ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Create workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
