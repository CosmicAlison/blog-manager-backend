export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  tag: "Essay" | "Dev" | "Life";
  readTime: string;
}

export type ModalState =
  | { kind: "none" }
  | { kind: "edit"; post: Post }
  | { kind: "delete"; post: Post };
