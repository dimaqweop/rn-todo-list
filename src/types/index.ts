import type { Doc, Id } from "@/convex/_generated/dataModel";

export type TodoDoc = Doc<"todos">;

export interface Todo {
  _id: Id<"todos"> | string;
  id?: string;
  text: string;
  isCompleted: boolean;
  completed?: boolean;
  createdAt: number;
  _creationTime?: number;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  percentage: number;
}
