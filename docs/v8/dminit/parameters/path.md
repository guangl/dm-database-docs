---
title: PATH
---

初始数据库存放的路径。默认路径为 dminit.exe 当前所在的工作目录。文件路径长度最大为 256 个字符。可选参数。

数据库创建成功后，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 的 `SYSTEM_PATH` 参数名查看数据库存放的路径。
