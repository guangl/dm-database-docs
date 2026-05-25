# 达梦数据库文档站

本站是达梦数据库（DM Database）的中文参考文档站，帮助开发者快速查阅各版本的官方技术文档。内容覆盖安装指南、SQL 参考、管理手册等核心主题，持续更新维护。

## 本地开发

开发前请先安装 [Bun](https://bun.sh)，然后执行以下步骤：

1. 安装依赖：

   ```bash
   bun install
   ```

2. 启动开发服务器：

   ```bash
   bun run dev
   ```

## 常用命令

| 命令               | 说明                          |
| ------------------ | ----------------------------- |
| `bun run dev`      | 启动本地开发服务器            |
| `bun run build`    | 生产构建                      |
| `bun run preview`  | 预览生产构建产物              |
| `bun run check`    | Biome lint + 格式化（自动修复）|
| `bun run format`   | 仅格式化                      |

## 文档结构

- 所有文档内容放在 `docs/` 目录下
- 路由由文件路径决定，如 `docs/guide/start/intro.md` → `/guide/start/intro`
- 目录导航顺序通过 `_meta.json` 控制，顶部导航通过 `docs/_nav.json` 控制
- 提交前请运行 `bun run check` 确保格式通过

## License

MIT © Guang Luo
