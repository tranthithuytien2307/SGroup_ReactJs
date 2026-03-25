import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useChecklistStore } from "../../../features/checklist/model/checklistStore";
import { useShallow } from "zustand/react/shallow";
import { ChecklistGroup } from "./ChecklistGroup";
import { useChecklistItemStore } from "../../../features/checklistItem/model/checklistItemStore";

export default function ChecklistSection({ cardId }: { cardId: number }) {
  const [openNewChecklist, setOpenNewChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  const { createChecklist, updateChecklistTitle, deleteChecklist } =
    useChecklistStore();
  const checklists = useChecklistStore(
    useShallow((s) => s.checklistsByCardId[cardId] || []),
  );

  const fetchAllChecklists = useChecklistStore((s) => s.fetchAllChecklists);

  useEffect(() => {
    if (cardId && checklists.length === 0) {
      fetchAllChecklists();
    }
  }, [cardId]);

  const handleCreateChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    await createChecklist(cardId, newChecklistTitle.trim());
    setNewChecklistTitle("");
    setOpenNewChecklist(false);
  };

  return (
    <div className="space-y-8 mt-6">
      {checklists.map((ch) => (
        <ChecklistGroup
          key={ch.id}
          ch={ch}
          cardId={cardId}
          deleteChecklist={deleteChecklist}
          updateChecklistTitle={updateChecklistTitle}
        />
      ))}

      <div className="pt-2">
        {openNewChecklist ? (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
            <p className="text-sm font-bold text-gray-600">Thêm checklist</p>
            <input
              autoFocus
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              className="w-full p-2 border-2 border-blue-500 rounded-md outline-none text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleCreateChecklist()}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateChecklist}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium"
              >
                Thêm
              </button>
              <button
                onClick={() => setOpenNewChecklist(false)}
                className="text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpenNewChecklist(true)}
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 bg-gray-100 px-4 py-2 rounded text-sm font-medium transition-all"
          >
            + Thêm checklist mới
          </button>
        )}
      </div>
    </div>
  );
}
