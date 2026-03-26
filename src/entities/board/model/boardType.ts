export type Board = {
  id: number;
  name: string;
  description?: string;
  memberCount?: number;
  listCount?: number;
  invite_enabled?: boolean;
  workspace_id?: number;
  cover_url?: string | null;
  theme?: string | null;
};
