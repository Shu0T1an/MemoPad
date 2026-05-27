import type { Todo } from "./types";
import { TodoItem } from "./TodoItem";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  filter: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete, onEdit }: TodoListProps) {
  const filtered = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>{filter === "completed" ? "还没有完成的任务" : "没有待办事项"}</h3>
        <p>
          {filter === "completed"
            ? "完成一些任务后会显示在这里"
            : "点击上方按钮添加新任务"}
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
