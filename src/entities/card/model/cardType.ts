import type { ChecklistType } from "../../checklist/model/checklistType";
import type { User } from "../../users/type/types";

export type CardMember = {
  card_id: number;
  user_id: number;
};

export type Card = {
  id: number;
  version: number;
  list_id: number;
  title: string;
  position: number;
  is_archived: boolean;
  archived_at: string | null;
  description: string | null;
  start_date: string | null;
  deadline_date: string | null;
  is_completed: boolean;
  cover_color: string | null;
  cover_image_url: string | null;
  cover_url: string | null;

  members?: User[];
  checklists?: ChecklistType[];
};
