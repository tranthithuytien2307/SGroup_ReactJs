import type { Board } from "../../board/model/boardType";

export type Workspace = {
  id: number;
  name: string;
  description?: string;
  boards: Board[];
  countBoard: number;
};
