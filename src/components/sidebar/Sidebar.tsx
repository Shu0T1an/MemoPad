import "./Sidebar.css";

interface SidebarProps {
  currentView: "todos" | "notes";
  todoCount: number;
  notesCount: number;
  onViewChange: (view: "todos" | "notes") => void;
  onFilterChange: (filter: string) => void;
}

export function Sidebar({
  currentView,
  todoCount,
  notesCount,
  onViewChange,
  onFilterChange,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">M</div>
        <span className="logo-text">MemoPad</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">工作区</div>
        <div
          className={`sidebar-item ${currentView === "todos" ? "active" : ""}`}
          onClick={() => onViewChange("todos")}
        >
          <span className="item-icon">☐</span>
          <span>待办事项</span>
          <span className="item-count">{todoCount}</span>
        </div>
        <div
          className={`sidebar-item ${currentView === "notes" ? "active" : ""}`}
          onClick={() => onViewChange("notes")}
        >
          <span className="item-icon">📝</span>
          <span>便签</span>
          <span className="item-count">{notesCount}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">分类</div>
        <div className="sidebar-item" onClick={() => onFilterChange("today")}>
          <span className="item-icon">📅</span>
          <span>今天</span>
        </div>
        <div
          className="sidebar-item"
          onClick={() => onFilterChange("upcoming")}
        >
          <span className="item-icon">📆</span>
          <span>即将到来</span>
        </div>
        <div
          className="sidebar-item"
          onClick={() => onFilterChange("completed")}
        >
          <span className="item-icon">✓</span>
          <span>已完成</span>
        </div>
      </div>

      <div className="sidebar-spacer" />

      <div className="sidebar-section">
        <div className="sidebar-item">
          <span className="item-icon">⚙️</span>
          <span>设置</span>
        </div>
      </div>
    </aside>
  );
}
