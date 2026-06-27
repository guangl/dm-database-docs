---
title: CONTROL
---

指定初始化配置文件路径。可选参数。

使用 `CONTROL` 参数时，`CONTROL` 参数必须位于首位，且 `CONTROL` 参数只能和 `SYSDBA_PWD`、`SYSAUDITOR_PWD`、`SYSSSO_PWD`、`SYSDBO_PWD` 参数同时使用，和其他参数同时使用时将会报错。当命令行和 ctl 文件参数值存在冲突时，以命令行给出的值为准。

`CONTROL` 参数主要用于将数据文件创建在 ASM 上或者 DSC 环境中。`CONTROL` 参数和初始化配置文件，详细信息见下一章节。
