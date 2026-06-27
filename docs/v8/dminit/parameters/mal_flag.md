---
title: MAL_FLAG
---

初始化时设置 dm.ini 中的 `MAL_INI` 值，可选参数。

- `1`：设置 `MAL_INI`=`1`，启动 MAL 系统。同时，需要配置 dmmal.ini 文件；
- `0`：设置 `MAL_INI`=`0`，不启用 MAL 系统。

缺省值为 `0`。

数据库创建成功后，可通过修改 INI 参数 `MAL_INI` 重新设置 `MAL_INI`。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `MAL_INI` 参数名查看 `MAL_INI` 当前的设置值，还可以通过使用系统函数 SF_GET_PARA_VALUE 获取 `MAL_INI` 当前的设置值。
