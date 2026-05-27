import { Priority } from "../../types/todo";
import { FilterBar } from "../ui/FilterBar";
import "./TodoFilters.css";

interface TodoFiltersProps {
  activeStatus: string;
  activePriority?: Priority;
  activeTags: string[];
  availableTags: string[];
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority?: Priority) => void;
  onTagsChange: (tags: string[]) => void;
}

const statusFilters = [
  { key: "all", label: "全部" },
  { key: "active", label: "进行中" },
  { key: "completed", label: "已完成" },
];

const priorityFilters = [
  { key: "all", label: "全部优先级" },
  { key: "high", label: "🔴 高" },
  { key: "medium", label: "🟡 中" },
  { key: "low", label: "🟢 低" },
];

export function TodoFilters({
  activeStatus,
  activePriority,
  activeTags,
  availableTags,
  onStatusChange,
  onPriorityChange,
  onTagsChange,
}: TodoFiltersProps) {
  return (
    <div className="todo-filters">
      <FilterBar
        filters={statusFilters}
        activeFilter={activeStatus}
        onFilterChange={onStatusChange}
      />

      <FilterBar
        filters={priorityFilters}
        activeFilter={activePriority || "all"}
        onFilterChange={(key) => onPriorityChange(key === "all" ? undefined : key as Priority)}
      />

      {availableTags.length > 0 && (
        <div className="tag-filters">
          {availableTags.map((tag) => (
            <button
              key={tag}
              className={`tag-filter-chip ${activeTags.includes(tag) ? "active" : ""}`}
              onClick={() => {
                if (activeTags.includes(tag)) {
                  onTagsChange(activeTags.filter((t) => t !== tag));
                } else {
                  onTagsChange([...activeTags, tag]);
                }
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
