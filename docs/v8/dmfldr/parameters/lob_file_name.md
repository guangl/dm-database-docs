---
title: LOB_FILE_NAME
---

指明 dmfldr 导出大字段数据的文件名，字符串类型，缺省为 `dmfldr.lob`。当 `MODE` 为 `OUT` 时，dmfldr 生成大字段对应的数据文件名由 `LOB_FILE_NAME` 指定，若未指定默认为 `dmfldr.lob`，文件存放于 `LOB_DIRECTORY` 指定的目录。此参数为可选参数，作用于 `MODE` 为 `OUT` 的情况下，当 `MODE` 为 `IN` 时无效。
