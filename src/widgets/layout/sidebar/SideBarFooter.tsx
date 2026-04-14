import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../../shared/ui/dropdown-menu";

import { LogOut, Settings, User, Archive } from "lucide-react";
import { useState } from "react";
import ArchivedWorkspaceModal from "../../workspace/ArchivedWorkspaceModal";

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

interface SideBarFooterProps {
  user: UserType | null;
}

export default function SideBarFooter({ user }: SideBarFooterProps) {
  const navigate = useNavigate();
  const [openArchiveModal, setOpenArchiveModal] = useState(false);

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="p-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <footer className="w-full border-t p-3 flex items-center gap-3 hover:bg-accent data-[state=open]:bg-accent rounded-lg cursor-pointer transition-colors overflow-hidden">
            <div className="flex-shrink-0">
              <img
                src={user?.avatar_url ?? "/avatar-default.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1 leading-tight text-left">
              <span className="font-medium text-gray-800 truncate block">
                {user?.name ?? "Chưa có tên"}
              </span>
              <span className="text-xs text-gray-500 truncate block">
                {user?.email ?? "Chưa có email"}
              </span>
            </div>
          </footer>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="end"
          sideOffset={10}
          className="w-64 rounded-xl border bg-white shadow-2xl p-2 z-50"
        >
          <div className="px-2 py-3 mb-1">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user?.avatar_url ?? "/avatar-default.png"}
                alt="User Avatar"
                className="w-10 h-10 flex-shrink-0 rounded-full border border-gray-100 object-cover"
              />
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="font-semibold text-gray-900 text-sm truncate">
                  {user?.name ?? "Chưa có tên"}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user?.email ?? "Chưa có email"}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md focus:bg-gray-100"
            onClick={goToProfile}
          >
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md focus:bg-gray-100">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenArchiveModal(true)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md focus:bg-gray-100"
          >
            <Archive className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Workspace storage</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md focus:bg-red-50 text-red-600 focus:text-red-700">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openArchiveModal && (
        <ArchivedWorkspaceModal
          open={openArchiveModal}
          onClose={() => setOpenArchiveModal(false)}
        />
      )}
    </div>
  );
}
