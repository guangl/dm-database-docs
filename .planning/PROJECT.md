# 达梦数据库文档站

## What This Is

面向达梦数据库（DM）用户的官方文档站，基于 Rspress v2 构建。提供多版本文档支持，覆盖从达梦 v8 开始的各版本，包括安装指南、SQL 参考、管理手册等内容。

## Core Value

开发者能快速找到对应版本的达梦数据库权威参考文档。

## Current Milestone: v0.1.0 项目脚手架

**Goal:** 完成文档站的工程基础设施与多版本文档框架，使项目可持续集成、自动部署并支持版本化内容管理

**Target features:**
- GitHub Actions CI/CD 工作流（构建 + 部署）
- GitHub Pages 部署配置
- LICENSE 文件
- README.md（真实内容，替换模板）
- 多版本文档结构（从达梦 v8 开始，填充版本框架内容）

## Requirements

### Validated

- ✓ INFRA-01: 项目包含 LICENSE 文件 — Phase 1
- ✓ INFRA-02: README.md 包含达梦文档站的真实介绍（替换 Rspress 模板）— Phase 1
- ✓ INFRA-03: GitHub Actions 在推送主分支时自动构建文档站 — Phase 2
- ✓ INFRA-04: GitHub Actions 构建成功后自动部署到 GitHub Pages — Phase 2

### Active

- [ ] MULTI-01: 文档站配置多版本支持（Rspress multiVersion 插件）
- [ ] MULTI-02: 达梦 v8 版本目录结构已建立，含核心章节占位内容
- [ ] MULTI-03: 首页展示达梦数据库品牌信息（非 Rspress 默认模板）
- [ ] MULTI-04: 导航栏包含版本选择器

### Out of Scope

- 实际文档内容编写 — 本里程碑只建框架，内容填充在后续里程碑
- 自定义主题/样式 — 使用 Rspress 默认主题
- 国际化（i18n） — 暂时只支持中文

## Context

- 技术栈: Rspress v2、Bun、Biome
- 部署目标: GitHub Pages（静态站点）
- 多版本策略: 基于 Rspress 内置 multiVersion 插件，按达梦版本号分目录
- 当前内容全为 Rspress 默认模板，需要替换

## Constraints

- **Tech stack**: Rspress v2 + Bun — 不引入额外框架
- **Deployment**: GitHub Pages — 静态站点，无服务端
- **Compatibility**: 从达梦 v8 开始建立版本结构

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 使用 Rspress multiVersion 插件 | 原生支持，无需自研版本切换逻辑 | — Phase 3 待验证 |
| GitHub Pages 部署 | 免费、适合静态文档站 | ✓ 已验证 — guangl.github.io/dm-database-docs/ 可访问 |
| GitHub 官方 Pages Actions（非 peaceiris） | OIDC 鉴权更安全，官方维护 | ✓ Phase 2 — 工作流全绿 |
| rspress base: '/dm-database-docs/' | GitHub Pages 子路径部署必需 | ✓ Phase 2 — 静态资源路径正确 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-25 after Phase 2 (CI/CD 自动化)*
