import { useState, useMemo } from "react";
import { Todo, TodoFilter } from "../types/todo";

export function useFilter(todos: Todo[]) {
  const [filter, setFilter] = useState<TodoFilter>({ status: "all" });

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 状态筛选
      if (filter.status === "active" && todo.completed) return false;
      if (filter.status === "completed" && !todo.completed) return false;

      // 优先级筛选
      if (filter.priority && todo.priority !== filter.priority) return false;

      // 标签筛选
      if (filter.tags && filter.tags.length > 0) {
        if (!filter.tags.some((tag) => todo.tags.includes(tag))) return false;
      }

      return true;
    });
  }, [todos, filter]);

  return { filter, setFilter, filteredTodos };
}
