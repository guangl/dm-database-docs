# Roadmap: 达梦数据库文档站

## Overview

从工程脚手架出发，分三个阶段完成 v0.1.0 里程碑：先建立项目基础文件，再配置 CI/CD 自动化流水线，最后搭建多版本文档框架，使文档站具备持续集成、自动部署与版本化内容管理能力。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: 项目基础文件** - 添加 LICENSE 和真实内容的 README，完成项目身份 (completed 2026-05-25)
- [ ] **Phase 2: CI/CD 自动化** - 配置 GitHub Actions 实现推送主分支时自动构建并部署到 GitHub Pages
- [ ] **Phase 3: 多版本文档框架** - 配置 multiVersion 插件、建立 v8 文档目录结构、替换首页与导航内容

## Phase Details

### Phase 1: 项目基础文件
**Goal**: 项目具备真实身份标识，访问者和贡献者能了解项目用途与许可证
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02
**Success Criteria** (what must be TRUE):
  1. 仓库根目录存在 LICENSE 文件，内容为 MIT 许可证，年份与作者正确
  2. README.md 描述达梦数据库文档站的用途，不含 Rspress 默认模板内容
  3. README.md 包含本地开发启动步骤（`bun run dev`）
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — 创建 MIT LICENSE 文件并替换 README.md 为达梦文档站中文内容

### Phase 2: CI/CD 自动化
**Goal**: 每次推送主分支时，文档站自动构建并部署到 GitHub Pages，无需手动操作
**Depends on**: Phase 1
**Requirements**: INFRA-03, INFRA-04
**Success Criteria** (what must be TRUE):
  1. 推送代码到 main 分支后，GitHub Actions 工作流自动触发
  2. 构建步骤使用 Bun 安装依赖并运行 `bun run build`，构建失败时工作流标红
  3. 构建成功后，生成的静态文件自动发布到 GitHub Pages，可通过公开 URL 访问
  4. 工作流文件存在于 `.github/workflows/` 目录下
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — 添加 rspress base 配置并创建 GitHub Actions 部署工作流

### Phase 3: 多版本文档框架
**Goal**: 用户打开文档站能看到达梦品牌首页，导航栏可切换版本，v8 各核心章节的占位页面均可访问
**Depends on**: Phase 2
**Requirements**: MULTI-01, MULTI-02, MULTI-03, MULTI-04
**Success Criteria** (what must be TRUE):
  1. `rspress.config.ts` 中启用 multiVersion 插件，至少注册达梦 v8 版本
  2. docs 目录下存在 v8 版本子目录，含简介、安装、快速开始、SQL 参考四个章节的占位 Markdown 文件
  3. 文档站首页（`docs/index.md`）展示达梦数据库名称与描述，不含 Rspress 默认的 "Rspress" 字样
  4. 导航栏渲染版本选择器，用户点击后可切换到不同版本的文档路径
**UI hint**: yes
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 项目基础文件 | 1/1 | Complete   | 2026-05-25 |
| 2. CI/CD 自动化 | 0/TBD | Not started | - |
| 3. 多版本文档框架 | 0/TBD | Not started | - |
