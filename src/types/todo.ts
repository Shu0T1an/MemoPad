export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  tags: string[];
  parentId?: string;
  children: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilter {
  status: "all" | "active" | "completed";
  priority?: Priority;
  tags?: string[];
  search?: string;
}
