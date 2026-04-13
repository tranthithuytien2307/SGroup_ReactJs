import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import { Input } from "../input";
import { Button } from "../button";
import type { Template } from "../../../entities/template/model/templateType";
import { templateAPI } from "../../../entities/template/api/templateAPI";
import { useWorkspace } from "../../../features/workspace/WorkspaceContext";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../config/PATH";

type CreateFromTemplateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
};

export default function CreateFromTemplateModal({
  open,
  onOpenChange,
  template,
}: CreateFromTemplateModalProps) {
  const { workspaces } = useWorkspace();
  const navigate = useNavigate();

  const [boardName, setBoardName] = useState("");
  const [visibility, setVisibility] = useState<"private" | "workspace" | "public">("private");
  const [workspaceId, setWorkspaceId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset fields when opening
  useEffect(() => {
    if (open && template) {
      setBoardName(template.name);
      setVisibility("private");
      setWorkspaceId(workspaces[0]?.id ?? "");
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open, template, workspaces]);

  const handleSubmit = async () => {
    if (!template) return;
    if (!workspaceId) {
      setError("Please select a workspace.");
      return;
    }

    try {
      setLoading(true);
      const res = await templateAPI.cloneTemplate(template.id, {
        boardName: boardName.trim() || undefined,
        visibility,
        workspaceId: Number(workspaceId),
      });
      onOpenChange(false);
      const newBoardId = res.data.responseObject?.id;
      if (newBoardId) {
        navigate(PATH.BOARDPAGE(newBoardId));
      }
    } catch (err) {
      console.error("Clone template failed:", err);
      setError("Failed to create board. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Use Template</DialogTitle>
          <DialogDescription>
            Create a new board based on{" "}
            <span className="font-medium text-gray-800">{template?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Board Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Board Name</label>
            <Input
              ref={inputRef}
              placeholder="Enter board name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Workspace */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Workspace</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={workspaceId}
              onChange={(e) =>
                setWorkspaceId(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Select a workspace</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Visibility</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "private" | "workspace" | "public")
              }
            >
              <option value="private">Private</option>
              <option value="workspace">Workspace</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2 cursor-pointer"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer bg-black text-white"
            onClick={handleSubmit}
            disabled={loading || !workspaceId}
          >
            {loading ? "Creating…" : "Create Board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
