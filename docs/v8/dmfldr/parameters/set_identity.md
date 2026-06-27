---
title: SET_IDENTITY
---

设置自增列选项，布尔值。缺省为 `FALSE`。如果指定 `SET_IDENTITY` 选项值为 `TRUE`，则 dmfldr 将把从数据文件中读取的自增列值作为目标值插入数据库表中，用户应当保证每一行的自增列的值符合自增列的规则。如果 `SET_IDENTITY` 选项值设置为 `FALSE`，则 dmfldr 将忽略数据文件中对应自增列的值，服务器将自动生成自增列的值插入每一行的对应列。此参数为可选参数，仅在 `MODE` 为 `IN`、`DIRECT` 为 `TRUE` 且非 DMDPC 环境下有效，DMDPC 环境下暂不支持自增列装载。
