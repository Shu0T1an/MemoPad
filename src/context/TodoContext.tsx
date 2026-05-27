import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Todo } from "../types/todo";
import { useLocalStorage } from "../hooks/useLocalStorage";

type TodoAction =
  | { type: "ADD"; payload: Todo }
  | { type: "UPDATE"; payload: Todo }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE"; payload: string }
  | { type: "REORDER"; payload: Todo[] };

const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((t) => (t.id === action.payload.id ? action.payload : t));
    case "DELETE":
      return state.filter((t) => t.id !== action.payload);
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
    case "REORDER":
      return action.payload;
    default:
      return state;
  }
};

interface TodoContextType {
  todos: Todo[];
  dispatch: React.Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>("memopad-todos", []);
  const [todos, dispatch] = useReducer(todoReducer, storedTodos);

  useEffect(() => {
    setStoredTodos(todos);
  }, [todos, setStoredTodos]);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within TodoProvider");
  }
  return context;
}
