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
  visibility?: "private" | "workspace" | "public";
  is_archived?: boolean;
  invite_token?: string | null;
  created_at?: string;
};
