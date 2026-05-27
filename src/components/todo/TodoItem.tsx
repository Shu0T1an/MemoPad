import { Todo } from "../../types/todo";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "../ui/Button";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

const priorityBorderColors = {
  high: "var(--danger)",
  medium: "var(--warning)",
  low: "var(--success)",
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <li
      className={`todo-item ${todo.completed ? "completed" : ""} fade-in`}
      style={{ borderLeftColor: priorityBorderColors[todo.priority] }}
    >
      <div
        className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
        onClick={() => onToggle(todo.id)}
      />
      <div className="todo-body">
        <div className="todo-title-row">
          <PriorityBadge priority={todo.priority} />
          <div className="todo-title">{todo.title}</div>
        </div>
        {todo.description && (
          <div className="todo-meta">
            <span>{todo.description}</span>
          </div>
        )}
        <div className="todo-meta">
          {todo.tags.length > 0 && todo.tags.map((tag) => (
            <span key={tag} className="todo-tag">{tag}</span>
          ))}
          {todo.dueDate && (
            <span className={`todo-due ${isOverdue(todo.dueDate) ? "overdue" : ""}`}>
              📅 {formatDate(todo.dueDate)}
            </span>
          )}
          {todo.children.length > 0 && (
            <span className="todo-subtasks">
              ✓ {todo.children.filter(() => false).length}/{todo.children.length}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        {onEdit && (
          <Button variant="ghost" icon onClick={() => onEdit(todo)} title="编辑">
            ✏️
          </Button>
        )}
        <Button variant="ghost" icon onClick={() => onDelete(todo.id)} title="删除">
          🗑
        </Button>
      </div>
    </li>
  );
}

function isOverdue(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr < today;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === today.toISOString().split("T")[0]) return "今天";
  if (dateStr === tomorrow.toISOString().split("T")[0]) return "明天";

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
