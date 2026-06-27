---
title: BLANK_PAD_MODE
---

设置字符串比较时，结尾空格填充模式是否兼容 ORACLE，可选参数。

- `1`：兼容；
- `0`：不兼容。

缺省值为 `0`。

此参数在数据库创建成功后无法修改，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `BLANK_PAD_MODE` 参数名查看此参数的设置值，还可以通过使用系统函数获取此参数的设置值：`select SF_GET_PARA_VALUE(2,'BLANK_PAD_MODE');`。
