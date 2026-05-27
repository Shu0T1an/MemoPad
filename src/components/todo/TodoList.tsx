import type { Todo } from "./types";
import { Button } from "../ui/Button";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  filter: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete }: TodoListProps) {
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
        <li
          key={todo.id}
          className={`todo-item ${todo.completed ? "completed" : ""} fade-in`}
        >
          <div
            className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
            onClick={() => onToggle(todo.id)}
          />
          <div className="todo-body">
            <div className="todo-title">{todo.title}</div>
            {todo.description && (
              <div className="todo-meta">
                <span>{todo.description}</span>
              </div>
            )}
            <div className="todo-meta">
              {todo.tags.length > 0 && (
                <span className="todo-tag">{todo.tags[0]}</span>
              )}
              {todo.dueDate && <span>{todo.dueDate}</span>}
            </div>
          </div>
          <div className="todo-actions">
            <Button
              variant="ghost"
              icon
              onClick={() => onDelete(todo.id)}
              title="删除"
            >
              🗑
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
