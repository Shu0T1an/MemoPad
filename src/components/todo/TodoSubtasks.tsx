import { useState } from "react";
import { Todo } from "../../types/todo";
import { Button } from "../ui/Button";
import "./TodoSubtasks.css";

interface TodoSubtasksProps {
  parentId: string;
  subtasks: Todo[];
  onAdd: (parentId: string, title: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoSubtasks({
  parentId,
  subtasks,
  onAdd,
  onToggle,
  onDelete,
}: TodoSubtasksProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = subtasks.filter((s) => s.completed).length;

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAdd(parentId, newTitle.trim());
      setNewTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div className="subtasks-container">
      <div className="subtasks-header">
        <span className="subtasks-progress">
          子任务 {completedCount}/{subtasks.length}
        </span>
        <Button variant="ghost" icon onClick={() => setIsAdding(true)} title="添加子任务">
          +
        </Button>
      </div>

      {subtasks.length > 0 && (
        <div className="subtasks-progress-bar">
          <div
            className="subtasks-progress-fill"
            style={{
              width: `${subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      )}

      <ul className="subtasks-list">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className="subtask-item">
            <div
              className={`subtask-checkbox ${subtask.completed ? "checked" : ""}`}
              onClick={() => onToggle(subtask.id)}
            />
            <span className={`subtask-title ${subtask.completed ? "completed" : ""}`}>
              {subtask.title}
            </span>
            <button className="subtask-delete" onClick={() => onDelete(subtask.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {isAdding && (
        <div className="subtask-add-row">
          <input
            type="text"
            className="subtask-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setIsAdding(false);
            }}
            placeholder="输入子任务..."
            autoFocus
          />
          <Button variant="ghost" onClick={handleAdd}>
            添加
          </Button>
          <Button variant="ghost" onClick={() => setIsAdding(false)}>
            取消
          </Button>
        </div>
      )}
    </div>
  );
}
