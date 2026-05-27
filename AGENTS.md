# MemoPad

基于 Tauri + Vite + React + TypeScript 的桌面待办事项与便笺应用。

## 项目结构

```
MemoPad/
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 前端入口
├── src-tauri/              # Tauri 后端 (Rust)
│   ├── src/
│   │   ├── lib.rs          # Tauri 命令定义
│   │   └── main.rs         # Rust 入口
│   ├── Cargo.toml          # Rust 依赖
│   └── tauri.conf.json     # Tauri 配置
├── index.html              # HTML 入口
├── package.json            # 前端依赖
└── vite.config.ts          # Vite 配置
```

## 开发命令

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run tauri dev

# 构建应用
bun run tauri build
```

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **后端**: Tauri 2 + Rust
- **包管理**: Bun

## 功能规划

- [ ] 待办事项管理 (Todo)
- [ ] 便笺功能 (Memo)
- [ ] 数据持久化
- [ ] 主题切换
