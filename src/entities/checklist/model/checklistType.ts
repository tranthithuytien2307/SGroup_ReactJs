import type { ChecklistItemType } from "../../checklikstItem/model/checklikstItemType";

export type ChecklistType = {
  id: number;
  card_id: number;
  title: string;
  items: ChecklistItemType[];
};
