import { useState, useMemo } from "react";
import { TodoProvider, useTodoContext } from "./context/TodoContext";
import { useTodos } from "./hooks/useTodos";
import { useFilter } from "./hooks/useFilter";
import { useSearch } from "./hooks/useSearch";
import {
  Sidebar,
  MainContent,
  TodoHeader,
  TodoFilters,
  TodoList,
  TodoForm,
  TodoSubtasks,
} from "./components";
import type { Todo, Priority } from "./types/todo";
import "./styles/variables.css";
import "./styles/layout.css";

function TodoApp() {
  const { todos } = useTodoContext();
  const { addTodo, updateTodo, deleteTodo, toggleTodo, reorderTodos } = useTodos();
  const { filter, setFilter, filteredTodos } = useFilter(todos);
  const { searchTerm, setSearchTerm, searchResults } = useSearch(filteredTodos);

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // 获取所有已使用的标签
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    todos.forEach((todo) => todo.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [todos]);

  // 应用搜索筛选
  const displayTodos = searchTerm ? searchResults : filteredTodos;

  const handleAdd = (data: {
    title: string;
    description: string;
    priority: Priority;
    tags: string[];
    dueDate?: string;
  }) => {
    addTodo({
      ...data,
      completed: false,
      children: [],
      order: todos.length,
    });
  };

  const handleEdit = (data: {
    title: string;
    description: string;
    priority: Priority;
    tags: string[];
    dueDate?: string;
  }) => {
    if (editingTodo) {
      updateTodo({
        ...editingTodo,
        ...data,
      });
      setEditingTodo(null);
    }
  };

  const handleAddSubtask = (parentId: string, title: string) => {
    const parent = todos.find((t) => t.id === parentId);
    if (parent) {
      const newSubtask: Todo = {
        id: Date.now().toString(),
        title,
        description: "",
        priority: "medium",
        tags: [],
        completed: false,
        children: [],
        order: 0,
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updateTodo({
        ...parent,
        children: [...parent.children, newSubtask.id],
      });
      // 添加子任务到列表
      addTodo(newSubtask);
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentView="todos"
        todoCount={todos.filter((t) => !t.completed).length}
        notesCount={0}
        onViewChange={() => {}}
        onFilterChange={(filter) => {
          setFilter({
            ...filter,
            status: filter === "completed" ? "completed" : "all",
          });
        }}
      />

      <MainContent
        title=""
        header={
          <TodoHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setShowForm(true)}
          />
        }
      >
        <TodoFilters
          activeStatus={filter.status}
          activePriority={filter.priority}
          activeTags={filter.tags || []}
          availableTags={availableTags}
          onStatusChange={(status) => setFilter({ ...filter, status: status as any })}
          onPriorityChange={(priority) => setFilter({ ...filter, priority })}
          onTagsChange={(tags) => setFilter({ ...filter, tags })}
        />

        <TodoList
          todos={displayTodos}
          filter={filter.status}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={(todo) => setEditingTodo(todo)}
          onReorder={reorderTodos}
        />

        {selectedTodo && selectedTodo.children.length > 0 && (
          <TodoSubtasks
            parentId={selectedTodo.id}
            subtasks={todos.filter((t) => t.parentId === selectedTodo.id)}
            onAdd={handleAddSubtask}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
      </MainContent>

      <TodoForm
        isOpen={showForm || !!editingTodo}
        onClose={() => {
          setShowForm(false);
          setEditingTodo(null);
        }}
        onSubmit={editingTodo ? handleEdit : handleAdd}
        initialData={
          editingTodo
            ? {
                title: editingTodo.title,
                description: editingTodo.description || "",
                priority: editingTodo.priority,
                tags: editingTodo.tags,
                dueDate: editingTodo.dueDate,
              }
            : undefined
        }
      />
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
}

export default App;
