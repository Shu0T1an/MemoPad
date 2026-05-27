import { SearchInput } from "../ui/SearchInput";
import { Button } from "../ui/Button";
import "./TodoHeader.css";

interface TodoHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
}

export function TodoHeader({ searchTerm, onSearchChange, onAddClick }: TodoHeaderProps) {
  return (
    <header className="todo-header">
      <h1>待办事项</h1>
      <div className="todo-header-actions">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="搜索任务..."
        />
        <Button onClick={onAddClick}>
          <span>+</span> 添加任务
        </Button>
      </div>
    </header>
  );
}
