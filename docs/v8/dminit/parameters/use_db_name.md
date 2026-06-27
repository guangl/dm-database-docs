---
title: USE_DB_NAME
---

初始化数据库的路径是否拼接 `DB_NAME`。Y、y、1：是；N、n、0：否。缺省值为 1。可选参数。

例如 dm.ini 的默认路径在 `USE_DB_NAME` 配置为 1 时是 `PATH\DB_NAME\dm.ini`；在 `USE_DB_NAME` 配置为 0 时是 `PATH\dm.ini`。
