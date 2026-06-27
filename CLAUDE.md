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

**Syntax diagrams**: command/statement "## 语法" (or "语法如下：") sections are rendered as railroad diagrams (SVG, via the `railroad-diagrams` npm package), not plain BNF text. `scripts/gen-railroad.mjs` generates the disql `SET` environment-variable diagrams; `scripts/gen-railroad-rman.mjs` generates the dmrman command diagrams under `docs/v8/rman/`. Each script defines the grammar in JS (`Diagram`/`Sequence`/`Choice`/`Optional`/`OneOrMore`/`Terminal`/`NonTerminal`), writes SVGs to a `railroad/` subfolder next to the source `.md`, and rewrites the syntax section to `![语法图](./railroad/.../<name>.svg)`. A statement with multiple alternative forms or `<rule>::= ...` sub-productions gets one diagram per form/sub-rule (labeled with the rule name), mirroring how the original BNF text is split. In `gen-railroad-rman.mjs`, each section provides a flat `items` array (not a pre-built `Diagram`); `wrapToRows()` measures cumulative item width and splits anything wider than `MAX_ROW_WIDTH` (900px) into multiple rows, each rendered as a `ComplexDiagram` (double-line caps, signaling "continues"). The library itself has no built-in line-wrapping — there's no width/wrap config on `Diagram`, only cosmetic constants (`ARC_RADIUS`, `VERTICAL_SEPARATION`, etc.) — so `mergeRowsToSVG()` manually stacks the per-row SVGs' inner `<g>` content into one `<svg>` canvas (translating each row down by the previous rows' height) and writes a single `<name>.svg` file. The result is still exactly one `![语法图](...)` per section, just with internal line breaks, rather than several separate `<img>` tags. Re-run the relevant script after editing a command's grammar; don't hand-edit the generated SVGs or the `![语法图](...)` lines.

## Writing conventions

**Inline code marks (`` ` ``)** — when to wrap a term in backticks inside prose:

- **Wrap**: file paths (`/etc/dm.ini`), filenames (`dm.ini`), config/INI parameter names (`BAK_USE_AP`), command keywords and SQL/DMSQL fragments (`RESTORE DATABASE`), database/object status or role keywords (`` `OPEN` ``, `` `MOUNT` ``, `` `SUSPEND` ``, `` `STANDBY` ``, `` `PRIMARY` ``, `` `STRUCT` ``, `` `TAPE` ``, `` `DISK` ``), error codes (`-8085`), and OS/database account or role names (`` `dmdba` ``, `` `root` ``, `` `SYSDBA` ``, `` `SYSAUDITOR` ``, `` `SYSSSO` ``, `` `SYSDBO` ``, `` `dinstall` ``) whenever they appear as a standalone term in prose. SQL/DMSQL statement and clause keywords specifically (`BACKUP TABLE`, `RESTORE TABLE`, `ALTER TABLE`, `DROP TABLE`, `GRANT`, `COMMIT`, `DBA`, etc.) must be both **uppercase and backticked** when referenced in prose — never lowercase bare text like "backup table" or "restore table", even inside an otherwise-bolded FAQ section. Verbatim transcripts inside fenced code blocks (where a tool literally echoes back lowercase, e.g. a `SQL>` prompt log) are exempt — leave those exactly as captured.
- **Don't wrap**: product/tool names (dmrman, dminit, dmfldr, dmdbchk, disql) — these are written as plain text everywhere in this repo, never in backticks. Tool names are also always written **lowercase** in prose (`dmrman`, not `DMRMAN`), matching the binary name — only uppercase when quoting literal log/process output inside a code block.
- Content already inside a fenced code block (` ``` `) doesn't need additional backticks — the whole block is already code.
- This rule is enforced repo-wide; when adding or editing a page, check that account/role names, tool-name casing, and code-like tokens are consistently backticked/cased rather than left bare or capitalized inconsistently.

**Product name**: refer to the product as **达梦数据库** in prose, never the bare English abbreviation "DM" (e.g. "达梦数据库提供四种安装方式", not "DM 提供四种安装方式"). This applies to headings, body text, and frontmatter `title` fields alike, including loose references to manuals (e.g. "《达梦数据库备份与还原手册》"). Exceptions — leave these as-is, don't expand them: version-tagged product names (`DM8`), and tool/component identifiers that happen to start with `dm`/`DM` as a literal token (`dmrman`, `dmap`, `DMSERVER`, `DM_BAKRES`, `dm.ini`, etc.) — only the standalone word "DM" used as shorthand for the product itself gets expanded. When the replacement removes a space between two Chinese segments (e.g. "DM 中的" → "达梦数据库中的"), drop the now-redundant space — Chinese prose doesn't space between adjacent Chinese words, only between Chinese and Latin/digit runs.

**`dmap`/`DMAP` casing**: like the other tool names, write it lowercase (`dmap`) in prose — "dmap 服务", "dmap 进程" — never uppercase `DMAP`. Exceptions: the literal mixed-case service name `DmAPService`, the literal filename `dmap.ini`, and the dmrman CLI flag `DMAP_INI` (uppercase by definition) stay as-is; content inside fenced code blocks or inline code spans is always left verbatim regardless of casing.

**Paragraph and line breaks**: break up long, dense paragraphs into multiple paragraphs or shorter sentences for readability, rather than running many distinct points together in one block. This applies especially to prose explaining multi-step procedures or several distinct facts — each distinct idea should generally get its own sentence or paragraph rather than being chained with 、/；into one long run-on sentence.

**FAQ structure**: every page under `docs/v8/pm/faq-install/` and `docs/v8/rman/faq/` uses exactly three top-level bold sections, in this order, with no other competing `**【...】**` headers: `**【问题描述】**` (restate the symptom/question), `**【问题原因】**` (the root cause; for pure how-to questions with no real "cause," explain why the need/question arises rather than fabricating a technical cause), `**【问题解决】**` (the fix/steps/answer). Multiple alternative fixes go inside the 解决 section as inline sub-labels (e.g. "方法一："), not as separate top-level headers.

**Error message citations**: when prose quotes a literal database error (in a FAQ description, a parameter doc, anywhere), use exactly one form: half-width square brackets around the numeric code, a colon immediately after the bracket, one space before the message text, the whole `[-NNNN]: 错误信息` string wrapped in a single pair of backticks, and no extra surrounding quote marks (`""`/`“”`/`【】`) — e.g. 报错：`` `[-8310]: 备份集校验错误` ``。 Never use full-width brackets (`【-802】`) for an error code. Multi-field log-style citations (`CODE:[...], DESC:[...]`) and odd nested-bracket strings copied verbatim from real output also get wrapped whole in one pair of backticks rather than reformatted — don't try to force those into the `[-NNNN]: message` shape if that's not what the literal output looks like. This only applies to citations inside prose; verbatim transcripts already inside fenced code blocks are left exactly as captured. Malformed/truncated frontmatter `title` fields that resulted from copying a broken nested-bracket error string should be rewritten as a clean, human-readable summary instead of preserving the corruption.
