import { useState } from "react";
import "./QuickAddInput.css";

interface QuickAddInputProps {
  onAdd: (title: string) => void;
}

export function QuickAddInput({ onAdd }: QuickAddInputProps) {
  const [value, setValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };

  return (
    <div className="todo-input-row">
      <input
        type="text"
        className="todo-input"
        placeholder="快速添加任务，按回车确认..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}
