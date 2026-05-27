# MemoPad 待办事项功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完善 MemoPad 待办事项功能，包含优先级、截止日期、子任务、拖拽排序、标签、搜索 6 个特性。

**Architecture:** 使用 React Context + useReducer 管理状态，自定义 Hook 封装业务逻辑，Tauri 文件 API 实现本地持久化。

**Tech Stack:** React 19, TypeScript, Vite, Tauri 2, @dnd-kit（拖拽）

---

## Task 1: 基础架构 - 数据结构与类型定义

**Files:**
- Create: `src/types/todo.ts`
- Modify: `src/components/todo/types.ts`

**Step 1: 创建类型定义文件**

```typescript
// src/types/todo.ts
export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  tags: string[];
  parentId?: string;
  children: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilter {
  status: "all" | "active" | "completed";
  priority?: Priority;
  tags?: string[];
  search?: string;
}
```

**Step 2: 删除旧的 types.ts，更新导入**

修改 `src/components/todo/types.ts` 为空文件或删除。

**Step 3: Commit**

```bash
git add src/types/todo.ts src/components/todo/types.ts
git commit -m "新增：Todo 类型定义"
```

---

## Task 2: 基础架构 - useLocalStorage Hook

**Files:**
- Create: `src/hooks/useLocalStorage.ts`

**Step 1: 创建 useLocalStorage Hook**

```typescript
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
```

**Step 2: Commit**

```bash
git add src/hooks/useLocalStorage.ts
git commit -m "新增：useLocalStorage Hook"
```

---

## Task 3: 基础架构 - TodoContext 与 useTodos Hook

**Files:**
- Create: `src/context/TodoContext.tsx`
- Create: `src/hooks/useTodos.ts`

**Step 1: 创建 TodoContext**

```typescript
// src/context/TodoContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import { Todo } from "../types/todo";
import { useLocalStorage } from "../hooks/useLocalStorage";

type TodoAction =
  | { type: "ADD"; payload: Todo }
  | { type: "UPDATE"; payload: Todo }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE"; payload: string }
  | { type: "REORDER"; payload: Todo[] };

const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((t) => (t.id === action.payload.id ? action.payload : t));
    case "DELETE":
      return state.filter((t) => t.id !== action.payload);
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
    case "REORDER":
      return action.payload;
    default:
      return state;
  }
};

interface TodoContextType {
  todos: Todo[];
  dispatch: React.Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>("memopad-todos", []);
  const [todos, dispatch] = useReducer(todoReducer, storedTodos);

  useEffect(() => {
    setStoredTodos(todos);
  }, [todos, setStoredTodos]);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within TodoProvider");
  }
  return context;
}
```

**Step 2: 创建 useTodos Hook**

```typescript
// src/hooks/useTodos.ts
import { useTodoContext } from "../context/TodoContext";
import { Todo } from "../types/todo";

export function useTodos() {
  const { todos, dispatch } = useTodoContext();

  const addTodo = (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD", payload: newTodo });
  };

  const updateTodo = (todo: Todo) => {
    dispatch({ type: "UPDATE", payload: { ...todo, updatedAt: new Date().toISOString() } });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: "TOGGLE", payload: id });
  };

  const reorderTodos = (newOrder: Todo[]) => {
    dispatch({ type: "REORDER", payload: newOrder });
  };

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo, reorderTodos };
}
```

**Step 3: Commit**

```bash
git add src/context/TodoContext.tsx src/hooks/useTodos.ts
git commit -m "新增：TodoContext 与 useTodos Hook"
```

---

## Task 4: 基础架构 - useFilter 与 useSearch Hook

**Files:**
- Create: `src/hooks/useFilter.ts`
- Create: `src/hooks/useSearch.ts`

**Step 1: 创建 useFilter Hook**

```typescript
// src/hooks/useFilter.ts
import { useState, useMemo } from "react";
import { Todo, TodoFilter } from "../types/todo";

export function useFilter(todos: Todo[]) {
  const [filter, setFilter] = useState<TodoFilter>({ status: "all" });

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 状态筛选
      if (filter.status === "active" && todo.completed) return false;
      if (filter.status === "completed" && !todo.completed) return false;

      // 优先级筛选
      if (filter.priority && todo.priority !== filter.priority) return false;

      // 标签筛选
      if (filter.tags && filter.tags.length > 0) {
        if (!filter.tags.some((tag) => todo.tags.includes(tag))) return false;
      }

      return true;
    });
  }, [todos, filter]);

  return { filter, setFilter, filteredTodos };
}
```

**Step 2: 创建 useSearch Hook**

```typescript
// src/hooks/useSearch.ts
import { useState, useMemo } from "react";
import { Todo } from "../types/todo";

export function useSearch(todos: Todo[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return todos;

    const term = searchTerm.toLowerCase();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(term) ||
        todo.description?.toLowerCase().includes(term)
    );
  }, [todos, searchTerm]);

  return { searchTerm, setSearchTerm, searchResults };
}
```

**Step 3: Commit**

```bash
git add src/hooks/useFilter.ts src/hooks/useSearch.ts
git commit -m "新增：useFilter 与 useSearch Hook"
```

---

## Task 5: UI 组件 - Modal

**Files:**
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Modal.css`

**Step 1: 创建 Modal 组件**

```tsx
// src/components/ui/Modal.tsx
import { useEffect } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
```

**Step 2: 创建 Modal 样式**

```css
/* src/components/ui/Modal.css */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: oklch(0% 0 0 / 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--surface);
  border-radius: 14px;
  box-shadow: var(--shadow-lg);
  width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.2s ease;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  font-size: 17px;
  font-weight: 600;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Step 3: Commit**

```bash
git add src/components/ui/Modal.tsx src/components/ui/Modal.css
git commit -m "新增：Modal 组件"
```

---

## Task 6: UI 组件 - SearchInput 与 PriorityBadge

**Files:**
- Create: `src/components/ui/SearchInput.tsx`
- Create: `src/components/ui/SearchInput.css`
- Create: `src/components/todo/PriorityBadge.tsx`
- Create: `src/components/todo/PriorityBadge.css`

**Step 1: 创建 SearchInput 组件**

```tsx
// src/components/ui/SearchInput.tsx
import "./SearchInput.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "搜索..." }: SearchInputProps) {
  return (
    <div className="search-input-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}
```

```css
/* src/components/ui/SearchInput.css */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: var(--muted);
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.15s;
  background: var(--bg);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
}
```

**Step 2: 创建 PriorityBadge 组件**

```tsx
// src/components/todo/PriorityBadge.tsx
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
```

```css
/* src/components/todo/PriorityBadge.css */
.priority-badge {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.priority-badge:has(+ *) {
  margin-right: 8px;
}
```

**Step 3: Commit**

```bash
git add src/components/ui/SearchInput.tsx src/components/ui/SearchInput.css \
        src/components/todo/PriorityBadge.tsx src/components/todo/PriorityBadge.css
git commit -m "新增：SearchInput 与 PriorityBadge 组件"
```

---

## Task 7: 优先级系统 - TodoItem 更新

**Files:**
- Modify: `src/components/todo/TodoItem.tsx`
- Modify: `src/components/todo/TodoList.tsx`

**Step 1: 更新 TodoItem 显示优先级**

在 TodoItem 中添加 PriorityBadge 显示，根据优先级设置左边框颜色。

**Step 2: Commit**

```bash
git add src/components/todo/TodoItem.tsx src/components/todo/TodoList.tsx
git commit -m "更新：TodoItem 显示优先级"
```

---

## Task 8: 优先级系统 - TodoForm 添加优先级选择

**Files:**
- Create: `src/components/todo/TodoForm.tsx`
- Create: `src/components/todo/TodoForm.css`

**Step 1: 创建 TodoForm 组件**

包含标题、描述、优先级选择、标签输入、截止日期选择。

**Step 2: Commit**

```bash
git add src/components/todo/TodoForm.tsx src/components/todo/TodoForm.css
git commit -m "新增：TodoForm 表单组件"
```

---

## Task 9: 分类标签 - 标签管理与筛选

**Files:**
- Modify: `src/components/todo/TodoFilters.tsx`
- Create: `src/components/todo/TagInput.tsx`

**Step 1: 创建 TagInput 组件**

支持输入标签、删除标签、标签建议。

**Step 2: 更新 TodoFilters 支持标签筛选**

显示已有标签，支持多选筛选。

**Step 3: Commit**

```bash
git add src/components/todo/TodoFilters.tsx src/components/todo/TagInput.tsx
git commit -m "新增：标签输入与筛选功能"
```

---

## Task 10: 搜索功能 - 集成到主界面

**Files:**
- Modify: `src/components/todo/TodoHeader.tsx`

**Step 1: 在 TodoHeader 中添加 SearchInput**

集成 useSearch Hook，实时搜索。

**Step 2: Commit**

```bash
git add src/components/todo/TodoHeader.tsx
git commit -m "更新：集成搜索功能到 TodoHeader"
```

---

## Task 11: 截止日期 - DatePicker 组件

**Files:**
- Create: `src/components/ui/DatePicker.tsx`
- Create: `src/components/ui/DatePicker.css`

**Step 1: 创建 DatePicker 组件**

使用原生 input[type="date"] 或简单日期选择器。

**Step 2: 在 TodoItem 中显示截止日期**

过期任务高亮显示。

**Step 3: Commit**

```bash
git add src/components/ui/DatePicker.tsx src/components/ui/DatePicker.css \
        src/components/todo/TodoItem.tsx
git commit -m "新增：DatePicker 组件与截止日期显示"
```

---

## Task 12: 子任务 - 嵌套任务支持

**Files:**
- Create: `src/components/todo/TodoSubtasks.tsx`
- Modify: `src/components/todo/TodoItem.tsx`

**Step 1: 创建 TodoSubtasks 组件**

显示子任务列表，支持添加、完成、删除。

**Step 2: 更新 TodoItem 显示子任务进度**

显示 "x/y 已完成" 进度条。

**Step 3: Commit**

```bash
git add src/components/todo/TodoSubtasks.tsx src/components/todo/TodoItem.tsx
git commit -m "新增：子任务功能"
```

---

## Task 13: 拖拽排序 - @dnd-kit 集成

**Files:**
- Modify: `package.json`
- Create: `src/hooks/useDragSort.ts`
- Modify: `src/components/todo/TodoList.tsx`

**Step 1: 安装 @dnd-kit**

```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Step 2: 创建 useDragSort Hook**

封装 @dnd-kit 拖拽逻辑。

**Step 3: 更新 TodoList 支持拖拽**

使用 DndContext、SortableContext 包装列表。

**Step 4: Commit**

```bash
git add package.json src/hooks/useDragSort.ts src/components/todo/TodoList.tsx
git commit -m "新增：拖拽排序功能"
```

---

## Task 14: 集成测试与最终提交

**Files:**
- Modify: `src/App.tsx`
- Modify: `CHANGELOG.md`

**Step 1: 更新 App.tsx 集成所有功能**

使用 TodoProvider 包装应用，集成所有组件。

**Step 2: 运行测试**

```bash
bun run tauri dev
```

手动测试所有功能：
- 添加/编辑/删除任务
- 设置优先级并筛选
- 添加标签并筛选
- 搜索任务
- 设置截止日期
- 创建子任务
- 拖拽排序

**Step 3: 更新 CHANGELOG.md**

**Step 4: 最终提交**

```bash
git add .
git commit -m "完成：待办事项全部功能"
git push
```

---

## 验收清单

- [ ] 可以添加、编辑、删除待办事项
- [ ] 可以设置优先级并按优先级筛选
- [ ] 可以设置截止日期并高亮过期任务
- [ ] 可以创建子任务并显示完成进度
- [ ] 可以拖拽调整任务顺序
- [ ] 可以添加标签并按标签筛选
- [ ] 可以搜索任务（标题、描述）
- [ ] 数据持久化到本地文件
- [ ] 应用启动时自动加载数据
