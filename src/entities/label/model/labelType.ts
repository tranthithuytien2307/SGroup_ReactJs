import type { Card } from "../../card/model/cardType";

export type Label = {
  id: number;
  name: string | null;
  color: string;
  board_id: number;
  cards?: Card[];
};
