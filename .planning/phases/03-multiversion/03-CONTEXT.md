# Phase 3: 多版本文档框架 - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

配置 Rspress multiVersion 插件，建立 v8 文档目录结构（4 个章节含占位内容），更新站点 title，删除 Rspress 模板内容；根路径自动跳转至 v8 文档，导航栏渲染版本选择器。

</domain>

<decisions>
## Implementation Decisions

### v8 目录结构
- **D-01:** 每个章节独立目录：`docs/v8/introduction/`、`docs/v8/installation/`、`docs/v8/quickstart/`、`docs/v8/sql-reference/`
- **D-02:** 每个章节目录下放 `index.md`，访问路径如 `/v8/sql-reference`
- **D-03:** `docs/v8/` 下添加 `_meta.json` 控制章节导航顺序：`["introduction", "installation", "quickstart", "sql-reference"]`
- **D-04:** 占位页面格式：最简单形式，只有 frontmatter title + H1 + "内容建设中。"

### 首页
- **D-05:** 不创建 `docs/index.md`，依赖 multiVersion 的 `default: 'v8'` 将根路径自动跳转至 v8 文档

### 现有模板内容
- **D-06:** 删除 `docs/api/` 目录（Rspress 默认模板，与达梦文档无关）

### 版本注册策略
- **D-07:** multiVersion 只注册 v8，不预建 v9 占位目录；v9 在后续里程碑单独添加
  ```ts
  multiVersion: {
    default: 'v8',
    versions: ['v8'],
  }
  ```
- **D-08:** 将 `rspress.config.ts` 的 `title` 从 "My Site" 更新为 "达梦数据库文档"

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求文档
- `.planning/REQUIREMENTS.md` — MULTI-01 至 MULTI-04 的具体要求
- `.planning/ROADMAP.md` §Phase 3 — Success Criteria（四条验收标准）

### 现有文件（需修改）
- `rspress.config.ts` — 需启用 multiVersion 插件、更新 title；当前 multiVersion 已注释，base 已配置

### 需删除文件
- `docs/api/` — 整个目录删除

### 需新建文件
- `docs/v8/index.md` — v8 版本首页
- `docs/v8/_meta.json` — 章节导航顺序
- `docs/v8/introduction/index.md`
- `docs/v8/installation/index.md`
- `docs/v8/quickstart/index.md`
- `docs/v8/sql-reference/index.md`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `rspress.config.ts`：multiVersion 配置已注释预备，`base: '/dm-database-docs/'` 已配置，直接解注释并调整即可

### Established Patterns
- 导航顺序由 `_meta.json` 控制（CLAUDE.md 架构说明）
- 包管理器：Bun；Biome 格式化（提交前运行 `bun run check`）

### Integration Points
- multiVersion 插件启用后，所有文档路径均需前缀版本号（`/v8/...`）
- `base: '/dm-database-docs/'` 与 multiVersion 路径叠加，部署后完整路径形如 `/dm-database-docs/v8/introduction`

</code_context>

<specifics>
## Specific Ideas

- 根路径 `/` 跳转至 `/v8/`，由 multiVersion `default: 'v8'` 驱动，无需手动重定向
- v8 各章节标题（中文）：简介 / 安装 / 快速开始 / SQL 参考

</specifics>

<deferred>
## Deferred Ideas

- v9 版本目录结构与注册 — 后续里程碑处理
- 首页品牌定制（hero、CTA 按钮）— 不在本阶段范围内

</deferred>

---

*Phase: 3-多版本文档框架*
*Context gathered: 2026-05-25*
