export type ID = number;

export type Board = {
  id: ID;
  name: string;
  description?: string;
  cover_url?: string;
};

export type Workspace = {
  id: ID;
  name: string;
  description?: string;
  boards: Board[];
  countBoard: number;
};
