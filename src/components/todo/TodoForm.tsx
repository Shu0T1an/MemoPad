import { useState } from "react";
import { Priority } from "../../types/todo";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import "./TodoForm.css";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    tags: string[];
    dueDate?: string;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    priority: Priority;
    tags: string[];
    dueDate?: string;
  };
}

export function TodoForm({ isOpen, onClose, onSubmit, initialData }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || "medium");
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setTagsInput("");
    setDueDate("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "编辑任务" : "添加任务"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSubmit}>{initialData ? "保存" : "添加任务"}</Button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">任务名称 *</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入任务名称..."
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">描述</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="添加任务描述..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">优先级</label>
        <div className="priority-selector">
          <button
            className={`priority-option high ${priority === "high" ? "selected" : ""}`}
            onClick={() => setPriority("high")}
          >
            高
          </button>
          <button
            className={`priority-option medium ${priority === "medium" ? "selected" : ""}`}
            onClick={() => setPriority("medium")}
          >
            中
          </button>
          <button
            className={`priority-option low ${priority === "low" ? "selected" : ""}`}
            onClick={() => setPriority("low")}
          >
            低
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">截止日期</label>
        <input
          type="date"
          className="form-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">标签</label>
        <input
          type="text"
          className="form-input"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="用逗号分隔标签，如：工作, 个人"
        />
      </div>
    </Modal>
  );
}
