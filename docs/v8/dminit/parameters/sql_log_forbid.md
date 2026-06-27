---
title: SQL_LOG_FORBID
---

是否禁止打开 SQL 日志，可选参数。此功能禁用之后，无法再通过任何方式打开 SQL 日志。

- `Y`/`1`：是；
- `N`/`0`：否。

缺省为 `N`。

例如，当 `SQL_LOG_FORBID`=`1` 后，即使开启 DM_INI 的 `SVR_LOG` 也不会打印 SQL 日志。

此参数在数据库创建成功后无法修改，可通过使用系统函数获取此参数的设置值：`select SF_GET_PARA_VALUE(2,'SQL_LOG_FORBID');`。
