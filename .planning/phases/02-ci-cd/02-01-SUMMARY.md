---
phase: 02-ci-cd
plan: 01
subsystem: infra/ci-cd
tags: [github-actions, github-pages, rspress, bun, ci-cd]
dependency_graph:
  requires: []
  provides: [github-pages-deployment, ci-cd-pipeline]
  affects: [rspress.config.ts, .github/workflows/deploy.yml]
tech_stack:
  added: []
  patterns: [dual-job-build-deploy, oidc-pages-auth, frozen-lockfile-ci]
key_files:
  created:
    - .github/workflows/deploy.yml
  modified:
    - rspress.config.ts
decisions:
  - "D-01: 使用 GitHub 官方 Actions (upload-pages-artifact + deploy-pages)，不用 peaceiris"
  - "D-02: 权限在 job 级别声明，顶层只有 contents: read"
  - "D-03: base: '/dm-database-docs/' 适配 GitHub Pages 子路径（末尾斜杠保留）"
  - "D-04: push 到 main 触发构建 + 部署"
  - "D-05: pull_request 只触发构建，不部署（upload + deploy job 各带 if 条件）"
metrics:
  duration_minutes: 2
  completed_date: "2026-05-25"
  tasks_completed: 2
  tasks_total: 3
  files_created: 1
  files_modified: 1
---

# Phase 2 Plan 1: CI/CD 自动化部署工作流 Summary

**One-liner:** GitHub Actions 双 Job 工作流（OIDC 鉴权，build + deploy 分离）+ rspress base 路径配置，实现 push main 自动部署到 guangl.github.io/dm-database-docs/

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | 修改 rspress.config.ts 添加 base 配置 | 4e21c5b | rspress.config.ts |
| 2 | 创建 .github/workflows/deploy.yml 工作流 | f4f8e78 | .github/workflows/deploy.yml |
| 3 | 推送 main 触发部署验证 | — | CHECKPOINT: awaiting human verification |

## What Was Built

### Task 1: rspress.config.ts base 路径配置

在 `rspress.config.ts` 的 `defineConfig` 中 `root` 行之后插入：

```typescript
base: '/dm-database-docs/',
```

构建验证（`bun run build`）成功，`doc_build/404.html` 中静态资源路径前缀为 `/dm-database-docs/`。Biome 格式检查通过。

### Task 2: .github/workflows/deploy.yml 工作流

创建完整的 GitHub Actions 工作流，包含：
- **build job**：checkout → setup-bun → bun install --frozen-lockfile → bun run build → upload-pages-artifact（仅 push 时）
- **deploy job**：仅在 push 时运行，OIDC 鉴权，部署到 github-pages 环境

所有验收断言通过：
- `if: github.event_name == 'push'` 出现 2 次（upload step + deploy job）
- `cancel-in-progress: false` 防止并发部署冲突
- `path: doc_build`（非 dist/build）
- `environment.name: github-pages`（精确匹配）
- 顶层 `contents: read`，deploy job 单独 `pages: write` + `id-token: write`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] 移除 rspress.config.ts 中引用不存在文件的 icon 和 logo 配置**

- **Found during:** Task 1 - 本地构建验证
- **Issue:** `icon: '/rspress-icon.png'` 和 `logo.light/dark` 引用了 `docs/public/` 目录中的图片，但该目录已在工作树中被删除（未提交的已有变更），导致 `bun run build` 报错："Failed to read the favicon file at ..."
- **Fix:** 从 rspress.config.ts 中移除 `icon` 和 `logo` 字段，使构建成功
- **Files modified:** rspress.config.ts
- **Commit:** 4e21c5b（包含在 Task 1 的提交中）

**说明：** docs/public/ 目录的删除是预先存在的工作树未提交变更，不属于本计划范围。本次自动修复仅针对 rspress.config.ts 中引用不存在文件导致构建失败的直接问题。

## Task 3: Checkpoint 状态

Task 3 是 `type="checkpoint:human-verify"` 任务，需要：
1. 手动在 GitHub 仓库 Settings → Pages → Source 切换为 "GitHub Actions"
2. 推送提交到 main 触发工作流
3. 验证工作流全绿 + Pages URL 可访问

等待用户 approved 后继续。

## Known Stubs

无。两个文件都是完整实现，无占位符或硬编码空值。

## Threat Flags

无新增安全威胁面。工作流权限配置符合计划 threat_model 中的 T-02-01 缓解措施（顶层只读，deploy job 最小权限授权）。

## Self-Check: PASSED

- [x] `rspress.config.ts` 中 `base: '/dm-database-docs/'` 存在
- [x] `.github/workflows/deploy.yml` 文件存在
- [x] Commit 4e21c5b 存在（Task 1）
- [x] Commit f4f8e78 存在（Task 2）
- [x] `bun run build` 成功，doc_build/ 产物含 /dm-database-docs/ 前缀
- [x] YAML 无 tab 字符，deploy.yml 结构合法
