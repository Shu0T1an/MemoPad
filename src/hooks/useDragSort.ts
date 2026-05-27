import { useState, useCallback } from "react";
import { Todo } from "../types/todo";

export function useDragSort(todos: Todo[], onReorder: (newOrder: Todo[]) => void) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!draggedId || draggedId === targetId) return;

      const newTodos = [...todos];
      const draggedIndex = newTodos.findIndex((t) => t.id === draggedId);
      const targetIndex = newTodos.findIndex((t) => t.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const [removed] = newTodos.splice(draggedIndex, 1);
      newTodos.splice(targetIndex, 0, removed);

      onReorder(newTodos);
    },
    [todos, draggedId, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  return {
    draggedId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
