import { useState, useMemo } from "react";
import { Todo } from "../types/todo";

export function useSearch(todos: Todo[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return todos;

    const term = searchTerm.toLowerCase();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(term) ||
        todo.description?.toLowerCase().includes(term)
    );
  }, [todos, searchTerm]);

  return { searchTerm, setSearchTerm, searchResults };
}
