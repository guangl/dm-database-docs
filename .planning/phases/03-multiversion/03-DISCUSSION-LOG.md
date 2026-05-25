# Phase 3: 多版本文档框架 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-25
**Phase:** 3-多版本文档框架
**Areas discussed:** v8 目录结构, 首页内容, 现有 api/ 模板内容, 版本注册策略

---

## v8 目录结构

| Option | Description | Selected |
|--------|-------------|----------|
| 平铺 | docs/v8/introduction.md 等，最简单 | |
| 带子目录 | docs/v8/guide/introduction.md 等 | |
| 按章节分目录 | 每个章节独立目录，各含 index.md | ✓ |

**User's choice:** 按章节分目录

| Option | Description | Selected |
|--------|-------------|----------|
| index.md | 每章节目录下放 index.md | ✓ |
| 与目录同名文件 | 如 sql-reference.md | |

**User's choice:** index.md

| Option | Description | Selected |
|--------|-------------|----------|
| _meta.json | 控制章节导航顺序 | ✓ |
| 不需要，默认顺序 | Rspress 按文件名排序 | |

**User's choice:** _meta.json

| Option | Description | Selected |
|--------|-------------|----------|
| 最简单占位 | 标题 + "内容建设中。" | ✓ |
| 带简介 | 标题 + 小段简介 + 内容建设中 | |

**User's choice:** 最简单占位

---

## 首页内容

**User's choice:** 不需要首页，根路径直接跳转至 v8（由 multiVersion default 驱动）
**Notes:** 用户明确表示不需要 docs/index.md，与 ROADMAP.md 成功标准 #3 有出入，用户决策优先

---

## 现有 api/ 模板内容

| Option | Description | Selected |
|--------|-------------|----------|
| 直接删除 | Rspress 模板文件，与达梦无关 | ✓ |
| 保留旧着 | 不属于本阶段范围 | |

**User's choice:** 直接删除

---

## 版本注册策略

| Option | Description | Selected |
|--------|-------------|----------|
| 只注册 v8 | 现阶段只有 v8 内容，避免空版本导致导航异常 | ✓ |
| 同时注册 v8 + v9 | 预建 v9 占位目录 | |

**User's choice:** 只注册 v8

| Option | Description | Selected |
|--------|-------------|----------|
| 更新 title 为达梦数据库 | 和项目身份一致 | ✓ |
| 保留旧着 | 后续阶段再改 | |

**User's choice:** 更新为"达梦数据库文档"

---

## Claude's Discretion

无 — 所有决策均由用户明确选择

## Deferred Ideas

- v9 版本目录结构与注册 — 后续里程碑
- 首页品牌定制（hero 组件、CTA 按钮）— 不在本阶段范围内
