---
title: RLOG_GEN_FOR_HUGE
---

是否生成 HUGE 表 REDO 日志。1：是；0：否。缺省值为 1。可选参数。

参数值 1 仅在 HUGE_WITH_DELTA=1 时才有效，也就是仅限于对事务型 HUGE 表设置是否生成 REDO 日志。

此参数在数据库创建成功后无法修改，可通过查询 V$PARAMETER 或 V$DM_INI 中的 RLOG_GEN_FOR_HUGE 参数名查看此参数的设置值，还可以通过使用系统函数获取此参数的设置值：select SF_GET_PARA_VALUE(2,'RLOG_GEN_FOR_HUGE');。
