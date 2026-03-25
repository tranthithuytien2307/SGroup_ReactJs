import { checklistItemAPI } from "../../../entities/checklikstItem/api/checklistItemAPI";

export const getChecklistProgress = async (checklist_id: number) => {
  if (!checklist_id) return;

  try {
    const res = await checklistItemAPI.getChecklistProgress(checklist_id);
    return res.data.responseObject;
  } catch (error) {
    console.error(
      `Error getting progress for checklist ${checklist_id}: `,
      error,
    );
    throw error;
  }
};
