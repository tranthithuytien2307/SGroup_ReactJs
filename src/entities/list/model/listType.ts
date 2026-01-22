import type { Card } from "../../card/model/cardType";

export type List = {
  id: number;
  board_id: number;
  name: string;
  position: number;
  cover_url: string | null;
  is_archived: boolean;
  archived_at: string | null;
  cards: Card[];
};
