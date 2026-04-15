import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useWorkspaceStore } from "../../features/workspace/model/workspaceStore";
import type { Workspace } from "../../entities/workspace/model/workspaceType";

interface EditWorkspaceModalProps {
  workspace: Workspace;
  onClose: () => void;
}

export default function EditWorkspaceModal({
  workspace,
  onClose,
}: EditWorkspaceModalProps) {
  const [name, setName] = useState<string>(workspace.name);
  const [description, setDescription] = useState<string>(
    workspace.description || "",
  );
  const [loading, setLoading] = useState<boolean>(false);

  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    try {
      setLoading(true);

      await updateWorkspace({
        workspace_id: workspace.id,
        name: name.trim(),
        description: description.trim(),
        is_active: workspace.is_active,
      });

      toast.success("Workspace updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white w-[400px] rounded-xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Edit Workspace</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-3 py-1 text-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50"
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
