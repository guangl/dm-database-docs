---
title: HUGE_WITH_DELTA
---

是否仅允许创建事务型 HUGE 表，可选参数。

- `1`：是；
- `0`：否。

缺省值为 `1`。设置为 `1` 时，仅允许创建事务型 HUGE 表，不允许创建非事务型 HUGE 表。若需要创建非事务型 HUGE 表，在创建数据库时需要将参数 `HUGE_WITH_DELTA` 和 `RLOG_GEN_FOR_HUGE` 都置为 `0`。

此参数在数据库创建成功后无法修改，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `HUGE_WITH_DELTA` 参数名查看此参数的设置值，还可以通过使用系统函数获取此参数的设置值：`select SF_GET_PARA_VALUE(2,'HUGE_WITH_DELTA');`。
