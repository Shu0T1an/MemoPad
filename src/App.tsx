import { useState } from "react";
import { Sidebar, MainContent, QuickAddInput, TodoList, Button, FilterBar } from "./components";
import type { Todo } from "./components/todo/types";
import "./styles/variables.css";
import "./styles/layout.css";

const initialTodos: Todo[] = [
  { id: 1, title: "完成项目提案", desc: "准备Q3项目计划和预算", tag: "工作", completed: false, date: "今天" },
  { id: 2, title: "健身 - 胸肌训练", desc: "卧推、飞鸟、俯卧撑", tag: "个人", completed: false, date: "今天" },
  { id: 3, title: "阅读《设计心理学》第3章", desc: "", tag: "学习", completed: true, date: "昨天" },
  { id: 4, title: "购买生日礼物", desc: "朋友下周生日", tag: "个人", completed: false, date: "明天" },
  { id: 5, title: "代码审查", desc: "审查团队PR", tag: "工作", completed: false, date: "今天" },
];

const filters = [
  { key: "all", label: "全部" },
  { key: "active", label: "进行中" },
  { key: "completed", label: "已完成" },
];

function App() {
  const [currentView, setCurrentView] = useState<"todos" | "notes">("todos");
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [todoFilter, setTodoFilter] = useState("all");

  const handleQuickAdd = (title: string) => {
    setTodos([
      {
        id: Date.now(),
        title,
        desc: "",
        tag: "",
        completed: false,
        date: "今天",
      },
      ...todos,
    ]);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const activeTodoCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <Sidebar
        currentView={currentView}
        todoCount={activeTodoCount}
        notesCount={0}
        onViewChange={setCurrentView}
        onFilterChange={(filter) => {
          setCurrentView("todos");
          setTodoFilter(filter === "completed" ? "completed" : "all");
        }}
      />

      {currentView === "todos" && (
        <MainContent
          title="待办事项"
          actions={
            <Button>
              <span>+</span> 添加任务
            </Button>
          }
        >
          <FilterBar
            filters={filters}
            activeFilter={todoFilter}
            onFilterChange={setTodoFilter}
          />
          <QuickAddInput onAdd={handleQuickAdd} />
          <TodoList
            todos={todos}
            filter={todoFilter}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        </MainContent>
      )}

      {currentView === "notes" && (
        <MainContent
          title="便签"
          actions={
            <Button>
              <span>+</span> 新建便签
            </Button>
          }
        >
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>还没有便签</h3>
            <p>点击"新建便签"记录你的想法</p>
          </div>
        </MainContent>
      )}
    </div>
  );
}

export default App;
