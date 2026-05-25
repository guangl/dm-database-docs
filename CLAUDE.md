# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # start local dev server
bun run build      # production build
bun run preview    # preview the production build
bun run check      # lint + format with Biome (writes fixes)
bun run format     # format only
```

## Architecture

This is an [Rspress v2](https://rspress.rs/) documentation site. All content lives under `docs/`.

**Routing** is file-system based — a file at `docs/guide/start/introduction.md` becomes `/guide/start/introduction`. Navigation order within a directory is controlled by `_meta.json` files; top-level navbar links are defined in `docs/_nav.json`.

**Content format**: plain Markdown (`.md`) or MDX (`.mdx`). MDX files can import and render React components inline.

**Config**: `rspress.config.ts` — sets the site title, logo, plugins, and theme options. Two plugins are active: `pluginLlms` (generates `llms.txt` / SSG-MD for AI consumption) and the sitemap plugin (in `package.json`).

**Linting/Formatting**: Biome with single-quote JS style and space indentation. Run `bun run check` before committing.
