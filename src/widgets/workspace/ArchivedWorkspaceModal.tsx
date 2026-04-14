import { useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useWorkspaceStore } from "../../features/workspace/model/workspaceStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ArchivedWorkspaceModal({ open, onClose }: Props) {
  const { archivedWorkspaces, getWorkspaceArchive, unarchiveWorkspace } =
    useWorkspaceStore();

  useEffect(() => {
    if (open) {
      getWorkspaceArchive();
    }
  }, [open]);

  if (!open) return null;

  const handleRestore = async (id: number) => {
    try {
      await unarchiveWorkspace(id);
      toast.success("Workspace restored");
    } catch (err) {
      toast.error("Failed to restore workspace");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Archived Workspaces</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {archivedWorkspaces.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No archived workspaces
            </p>
          )}

          {archivedWorkspaces.map((ws) => (
            <div
              key={ws.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
            >
              <div>
                <p className="font-medium text-sm">{ws.name}</p>
                <p className="text-xs text-gray-500">{ws.description}</p>
              </div>

              <button
                className="text-sm text-blue-600 hover:underline font-medium"
                onClick={() => handleRestore(ws.id)}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
