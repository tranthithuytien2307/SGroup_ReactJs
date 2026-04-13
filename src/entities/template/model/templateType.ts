export interface TemplateList {
  id: number;
  name: string;
  position: number;
}

export interface Template {
  id: number;
  name: string;
  description: string | null;
  cover_url: string | null;
  theme: string | null;
  is_archived: boolean;
  created_at: string;
  lists?: TemplateList[];
}

export interface CloneTemplateBody {
  boardName?: string;
  visibility?: "private" | "workspace" | "public";
  workspaceId: number;
}
