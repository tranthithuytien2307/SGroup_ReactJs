import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../dropdown-menu";

import { LogOut, Settings, User } from "lucide-react";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SideBarFooterProps {
  user: UserType | null;
}

export default function SideBarFooter({ user }: SideBarFooterProps) {
  return (
    <div className="relative p-2 h-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <footer className="w-full border-t p-4 flex items-center justify-between hover:bg-accent data-[state=open]:bg-accent">
            <div className="flex items-center gap-3">
              <img
                src="/avatar-default.png"
                alt="User Avatar"
                width={48}
                height={48}
                className="rounded-full border border-gray-200 object-cover"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-800">
                  {user?.name ?? "Chưa có tên"}
                </span>
                <span className="text-sm text-gray-500">
                  {user?.email ?? "Chưa có email"}
                </span>
              </div>
            </div>
          </footer>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="translate-x-[100%] translate-y-[30%] rounded-lg border bg-white shadow-xl p-1 z-50">
          <DropdownMenuItem>
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/avatar-default.png"
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full border border-gray-200 object-cover"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-normal text-gray-800 text-sm">
                    {user?.name ?? "Chưa có tên"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.email ?? "Chưa có email"}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-700">
            <LogOut className="w-4 h-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
