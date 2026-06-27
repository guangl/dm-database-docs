---
title: MAIN_DBF_PATH
---

初始化 MAIN.DBF 数据文件的存放路径。文件路径长度最大为 256 个字符。可选参数。

默认情况下 Windows 存放在 `PATH`\`DB_NAME` 下，Linux 存放在/`PATH`/DM_NAME 下（`PATH` 和 `DB_NAME` 表示各自设置的值）。文件名固定为 MAIN.DBF。

该路径不允许是 `HUGE_PATH` 路径及其子目录。（`HUGE_PATH` 默认为 `PATH`\`DB_NAME`\HMAIN）。
