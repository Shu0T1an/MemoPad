import { useTodoContext } from "../context/TodoContext";
import { Todo } from "../types/todo";

export function useTodos() {
  const { todos, dispatch } = useTodoContext();

  const addTodo = (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD", payload: newTodo });
  };

  const updateTodo = (todo: Todo) => {
    dispatch({ type: "UPDATE", payload: { ...todo, updatedAt: new Date().toISOString() } });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: "TOGGLE", payload: id });
  };

  const reorderTodos = (newOrder: Todo[]) => {
    dispatch({ type: "REORDER", payload: newOrder });
  };

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo, reorderTodos };
}
