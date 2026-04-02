export interface CommentType {
  id: number;
  content: string;
  card_id: number;
  user_id: number;

  created_at: string;
  updated_at: string;

  clientId: number;

  user: {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}
