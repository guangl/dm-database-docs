# Phase 1: 项目基础文件 - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

为仓库添加 LICENSE 文件和真实内容的 README.md，使访问者和贡献者能了解项目用途、许可证及本地开发方式。不含 CI/CD 配置、多版本文档或任何实际文档内容。

</domain>

<decisions>
## Implementation Decisions

### LICENSE
- **D-01:** 使用 MIT 许可证，年份 2026，作者名 Guang

### README
- **D-02:** 语言为**中文**
- **D-03:** 内容为**精简版**：项目简介（达梦数据库文档站用途）+ 本地开发启动步骤（`bun run dev`）
- **D-04:** 暂不加在线地址（部署后再更新）
- **D-05:** 替换全部 Rspress 默认模板内容，不保留 "Rspress website" 等字样

### Claude's Discretion
- README 的具体措辞由 Claude 根据项目背景自行拟定，保持简洁专业风格

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 需求文档
- `.planning/REQUIREMENTS.md` — INFRA-01（LICENSE）、INFRA-02（README）的具体要求
- `.planning/ROADMAP.md` §Phase 1 — Success Criteria（三条验收标准）

### 现有文件（需替换）
- `README.md` — 当前为 Rspress 默认模板，Phase 1 需完全替换
- `rspress.config.ts` — 当前 title 为 "My Site"，Phase 1 **不涉及**此文件修改

</canonical_refs>

<code_context>
## Existing Code Insights

### 现有文件状态
- `README.md`：Rspress 默认模板，含 npm 命令，需替换为 bun 命令和达梦项目描述
- `package.json`：scripts 使用 bun（dev/build/preview），README 本地开发步骤须与此一致
- 仓库根目录无 LICENSE 文件

### Established Patterns
- 包管理器：Bun（`bun run dev` / `bun run build`）
- 代码检查：Biome（`bun run check`）

### Integration Points
- LICENSE 和 README 都在仓库根目录，不影响任何代码文件

</code_context>

<specifics>
## Specific Ideas

- README 中的本地开发命令使用 `bun run dev`（对应 package.json scripts）
- LICENSE 年份：2026，作者：Guang

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 1-项目基础文件*
*Context gathered: 2026-05-25*
