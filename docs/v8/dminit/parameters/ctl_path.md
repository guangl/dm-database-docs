---
title: CTL_PATH
---

初始数据库控制文件的路径，默认值 Windows 下为 `PATH\DB_NAME\dm.ctl`，Linux 下为 `/PATH/DM_NAME/dm.ctl`（`PATH` 和 `DB_NAME` 表示各自设置的值）。文件路径长度最大为 256 个字符。可选参数。

数据库创建成功后，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 的 `CTL_PATH` 参数名查看数据库控制文件的路径。
