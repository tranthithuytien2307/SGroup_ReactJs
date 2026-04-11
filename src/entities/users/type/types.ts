export interface User {
  id: number;
  email: string;
  isVerified: boolean;
  avatar_url: string | null;
  name: string;
  bio: string | null;
}

export interface BoardMember {
  id: number;
  role: "admin" | "member" | "viewer";
  user: User;
}

export interface WorkspaceMember {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "owner" | "member";
}
