---
title: DPC_MODE
---

DMDPC 专用参数。指定 DMDPC 集群中的实例角色，可选参数。

- `0`：无；
- `1`/`MP`：MP；
- `2`/`BP`：BP；
- `3`/`SP`：SP。

缺省为 `0`。`DPC_MODE` 参数值既可以使用数字 `0`/`1`/`2`/`3`，也可以使用 `MP`/`BP`/`SP` 字符串代替，二者作用等价。

此参数在数据库创建成功后无法修改，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `DPC_MODE` 参数名查看此参数的设置值，还可以通过使用系统函数获取此参数的设置值：`select SF_GET_PARA_VALUE(2,'DPC_MODE');`。
