import { Priority } from "../../types/todo";
import "./PriorityBadge.css";

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
}

const priorityConfig = {
  high: { label: "高", color: "var(--danger)" },
  medium: { label: "中", color: "var(--warning)" },
  low: { label: "低", color: "var(--success)" },
};

export function PriorityBadge({ priority, showLabel = false }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className="priority-badge"
      style={{ backgroundColor: config.color }}
      title={config.label}
    >
      {showLabel && config.label}
    </span>
  );
}
