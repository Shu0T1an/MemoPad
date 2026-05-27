import { Todo } from "../../types/todo";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "../ui/Button";
import { formatDate, isOverdue } from "../ui/DatePicker";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  onDragStart?: (id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

const priorityBorderColors = {
  high: "var(--danger)",
  medium: "var(--warning)",
  low: "var(--success)",
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: TodoItemProps) {
  return (
    <li
      className={`todo-item ${todo.completed ? "completed" : ""} ${isDragging ? "dragging" : ""} fade-in`}
      style={{ borderLeftColor: priorityBorderColors[todo.priority] }}
      draggable
      onDragStart={() => onDragStart?.(todo.id)}
      onDragOver={(e) => onDragOver?.(e, todo.id)}
      onDragEnd={onDragEnd}
    >
      <div className="todo-drag-handle">⋮⋮</div>
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
          {todo.tags.length > 0 &&
            todo.tags.map((tag) => (
              <span key={tag} className="todo-tag">
                {tag}
              </span>
            ))}
          {todo.dueDate && (
            <span className={`todo-due ${isOverdue(todo.dueDate) ? "overdue" : ""}`}>
              📅 {formatDate(todo.dueDate)}
            </span>
          )}
          {todo.children.length > 0 && (
            <span className="todo-subtasks-count">📎 {todo.children.length} 个子任务</span>
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
