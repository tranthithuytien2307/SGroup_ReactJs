import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

type DashboardContentHeaderProp = {
  onAddWorkspace?: () => void;
}

export default function DashboardContentHeader({onAddWorkspace}: DashboardContentHeaderProp) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold tracking-tight">Dashboard</p>
        <p className="text-muted-foreground">
          Manage your workspaces and boards
        </p>
      </div>
      <Button onClick={onAddWorkspace} className="whitespace-normal inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer">
        <Plus className="mr-2 h-4 w-4" />
        <p>New Workspace</p>
      </Button>
    </div>
  );
}
