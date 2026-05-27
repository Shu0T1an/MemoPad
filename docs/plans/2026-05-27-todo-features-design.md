# MemoPad 待办事项功能设计文档

**日期**：2026-05-27  
**版本**：v1.0  
**状态**：已批准

---

## 1. 项目概述

完善 MemoPad 的待办事项功能，包含 6 个核心特性：优先级系统、截止日期、子任务、拖拽排序、分类标签、搜索功能。

## 2. 功能需求

### 2.1 优先级系统
- 支持高/中/低三级优先级
- 使用颜色标记区分（红色/橙色/绿色）
- 可按优先级筛选任务

### 2.2 截止日期
- 支持设置截止日期
- 过期任务高亮显示
- 可按日期筛选（今天、本周、已过期）

### 2.3 子任务
- 一个任务可拆分为多个子任务
- 父任务显示完成进度（x/y）
- 子任务可独立完成

### 2.4 拖拽排序
- 支持手动调整任务顺序
- 拖拽时显示占位符
- 排序结果持久化保存

### 2.5 分类标签
- 支持自定义标签（工作、个人、学习等）
- 可按标签筛选任务
- 支持多标签组合筛选

### 2.6 搜索功能
- 支持按标题搜索
- 支持按描述搜索
- 实时搜索（输入即搜索）

## 3. 技术设计

### 3.1 数据结构

```typescript
// 优先级枚举
export type Priority = "high" | "medium" | "low";

// 待办事项
export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;        // ISO 日期字符串
  completed: boolean;
  tags: string[];
  parentId?: string;       // 父任务 ID，用于子任务
  children: string[];      // 子任务 ID 列表
  order: number;           // 排序权重
  createdAt: string;
  updatedAt: string;
}

// 筛选条件
export interface TodoFilter {
  status: "all" | "active" | "completed";
  priority?: Priority;
  tags?: string[];
  search?: string;
}
```

### 3.2 自定义 Hook

| Hook | 职责 |
|------|------|
| `useTodos` | Todo CRUD 操作、数据持久化 |
| `useFilter` | 筛选逻辑（状态、优先级、标签） |
| `useSearch` | 搜索逻辑（标题、描述） |
| `useDragSort` | 拖拽排序逻辑 |

### 3.3 组件架构

```
src/components/
├── todo/
│   ├── TodoApp.tsx           # Todo 主容器
│   ├── TodoHeader.tsx        # 标题 + 搜索框 + 添加按钮
│   ├── TodoFilters.tsx       # 筛选栏（状态、优先级、标签）
│   ├── TodoList.tsx          # 任务列表容器
│   ├── TodoItem.tsx          # 单个任务项
│   ├── TodoSubtasks.tsx      # 子任务列表
│   ├── TodoForm.tsx          # 添加/编辑表单（Modal）
│   └── PriorityBadge.tsx    # 优先级标记
├── ui/
│   ├── Button.tsx
│   ├── FilterBar.tsx
│   ├── SearchInput.tsx       # 搜索输入框
│   ├── DatePicker.tsx        # 日期选择器
│   └── Modal.tsx             # 弹窗组件
```

### 3.4 文件存储方案

- 文件路径：`~/.memopad/todos.json`
- 存储格式：JSON 数组
- 自动保存：每次操作后自动写入
- 启动时加载：应用启动时读取文件

## 4. 实现顺序

1. **基础架构** - 自定义 Hook + 数据结构 + 文件存储
2. **优先级系统** - 高/中/低优先级，颜色标记
3. **分类标签** - 标签管理 + 筛选
4. **搜索功能** - 关键词搜索
5. **截止日期** - 日期选择 + 过期提醒
6. **子任务** - 任务拆分 + 嵌套显示
7. **拖拽排序** - 手动调整顺序

## 5. 验收标准

- [ ] 可以添加、编辑、删除待办事项
- [ ] 可以设置优先级并按优先级筛选
- [ ] 可以设置截止日期并高亮过期任务
- [ ] 可以创建子任务并显示完成进度
- [ ] 可以拖拽调整任务顺序
- [ ] 可以添加标签并按标签筛选
- [ ] 可以搜索任务（标题、描述）
- [ ] 数据持久化到本地文件
- [ ] 应用启动时自动加载数据
