export type Card = {
  id: number;
  list_id: number;
  title: string;
  position: number;
  is_archived: boolean;
  archived_at: string | null;
  description: string | null;
  strat_date: string | null;
  deadline_date: string | null;
  is_completed: boolean;
  cover_color: string | null;
  cover_image_url: string | null;
  cover_url: string | null;
};
