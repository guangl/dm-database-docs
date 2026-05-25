# Phase 2: CI/CD 自动化 - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

配置 GitHub Actions 工作流，实现推送 main 分支时自动构建文档站并部署到 GitHub Pages；PR 触发只构建不部署。同时在 rspress.config.ts 中配置正确的 base 路径以适配 GitHub Pages 子路径。

</domain>

<decisions>
## Implementation Decisions

### GitHub Pages 部署方式
- **D-01:** 使用 GitHub 官方 Actions：`actions/upload-pages-artifact` + `actions/deploy-pages`（不使用 peaceiris/actions-gh-pages）
- **D-02:** 权限配置在 **job 级别**（最小权限原则），需要 `pages: write` 和 `id-token: write`

### rspress 配置
- **D-03:** 在 `rspress.config.ts` 中添加 `base: '/dm-database-docs/'`，与 GitHub 仓库名一致，避免静态资源路径错误

### CI 触发条件
- **D-04:** `push` 到 `main` 分支 → 构建 + 部署到 GitHub Pages
- **D-05:** `pull_request` → 只构建（验证），不部署

### 工作流文件
- **D-06:** 文件路径：`.github/workflows/deploy.yml`

### 构建工具
- **D-07:** CI 使用 Bun 安装依赖（`bun install`）并运行 `bun run build`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求文档
- `.planning/REQUIREMENTS.md` — INFRA-03（自动构建）、INFRA-04（自动部署）的具体要求
- `.planning/ROADMAP.md` §Phase 2 — Success Criteria（四条验收标准）

### 现有文件（需修改）
- `rspress.config.ts` — 需添加 `base: '/dm-database-docs/'` 配置项
- `package.json` — 确认 `build` script 为 `rspress build`

### 新增文件
- `.github/workflows/deploy.yml` — 需创建，当前目录不存在

</canonical_refs>

<code_context>
## Existing Code Insights

### 现有文件状态
- `rspress.config.ts`：当前无 base 配置，title 为 "My Site"（Phase 3 再替换 title）
- `package.json`：build script = `rspress build`，依赖 `@rspress/core ^2.0.11`
- 无 `.github/` 目录，需从零创建

### Established Patterns
- 包管理器：Bun（CI 中使用 `bun install` + `bun run build`）
- 构建输出目录：rspress 默认输出到 `doc_build/`（需确认实际输出路径）

### Integration Points
- `rspress.config.ts` 的 `base` 配置影响所有静态资源路径和路由
- GitHub Pages 需要在仓库 Settings → Pages 中设置 Source 为 "GitHub Actions"

</code_context>

<specifics>
## Specific Ideas

- GitHub Pages URL：`guangl.github.io/dm-database-docs/`（对应 base `/dm-database-docs/`）
- 部署 job 权限（job 级别）：
  ```yaml
  permissions:
    pages: write
    id-token: write
  ```
- PR 构建 job 只需 `contents: read`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 2-CI/CD 自动化*
*Context gathered: 2026-05-25*
