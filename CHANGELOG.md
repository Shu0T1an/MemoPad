# Changelog

本文档记录 MemoPad 项目的所有重要变更。

## [0.2.0] - 2026-05-27

### 新增
- 完善待办事项功能
- 优先级系统（高/中/低，颜色标记）
- 截止日期（日期选择、过期高亮）
- 子任务（嵌套任务、进度显示）
- 拖拽排序（拖拽调整任务顺序）
- 分类标签（标签管理、多选筛选）
- 搜索功能（标题、描述搜索）
- 数据持久化（localStorage）
- 新增组件：Modal、SearchInput、DatePicker、PriorityBadge、TagInput、TodoForm、TodoFilters、TodoHeader、TodoSubtasks
- 新增 Hook：useLocalStorage、useTodos、useFilter、useSearch、useDragSort
- 新增 Context：TodoContext

## [0.1.0] - 2026-05-27

### 新增
- 初始化项目：Tauri + Vite + React 骨架
- 添加 AGENTS.md 项目说明文件
- 实现前端组件拆分：Sidebar、MainContent、TodoList、FilterBar、Button
- 创建 indexdemo.html 样式参考
