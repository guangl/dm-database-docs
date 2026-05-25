# Phase 2: CI/CD 自动化 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-25
**Phase:** 2-CI/CD 自动化
**Areas discussed:** GitHub Pages 部署方式, CI 触发条件

---

## GitHub Pages 部署方式

### 部署 Action 选择

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub 官方方式 | actions/upload-pages-artifact + actions/deploy-pages。官方推荐，不需要额外 Token，较新且更安全。 | ✓ |
| peaceiris/actions-gh-pages | 老牌第三方 Action，写入 gh-pages 分支。配置简单且社区案例多，但需手动配置 GITHUB_TOKEN 权限。 | |

**User's choice:** GitHub 官方方式

### Base URL 配置

| Option | Description | Selected |
|--------|-------------|----------|
| /dm-database-docs/ | 与仓库名一致，标准做法。需在 rspress.config.ts 加一行 base: '/dm-database-docs/'。 | ✓ |
| 让我自己确认仓库名 | 如果仓库名不是 dm-database-docs，告知正确名称。 | |

**User's choice:** /dm-database-docs/

### 权限配置范围

| Option | Description | Selected |
|--------|-------------|----------|
| job 级别设置 | 最小权限原则：只给部署 job 添加需要的权限，其他 job 不受影响。 | ✓ |
| 全局设置 | 配置简单，但全局权限范围过大。 | |

**User's choice:** job 级别设置

---

## CI 触发条件

### 触发策略

| Option | Description | Selected |
|--------|-------------|----------|
| push main 构建+部署 + PR 只构建 | PR 触发构建验证，不部署。更安全，但配置稍复杂（需条件判断是否部署）。 | ✓ |
| 仅 push main | 构建 + 部署都在 push main 时触发。简单直接，满足 Phase 2 的所有成功标准。 | |

**User's choice:** push main 构建+部署 + PR 只构建

### 工作流文件名

| Option | Description | Selected |
|--------|-------------|----------|
| deploy.yml | 语义明确，清楚表达此工作流的目的是构建并部署。 | ✓ |
| ci.yml | 通用名称，适合后续添加更多 CI 步骤（如 lint、test）。 | |
| pages.yml | 强调部署目标，如果后续分离 CI 和部署则不太合适。 | |

**User's choice:** deploy.yml

---

## Claude's Discretion

- Bun 版本在 CI 中的具体固定方式（latest 或特定版本）
- rspress 构建输出目录的实际路径确认

## Deferred Ideas

None
