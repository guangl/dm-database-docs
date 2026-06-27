---
title: BLOB_TYPE
---

指定 BLOB 数据值的实际类型，字符串类型。可选项为 `HEX` 表示值为十六进制，`HEX_CHAR` 表示值为十六进制字符，默认为 `HEX_CHAR`。此参数为可选参数，只在 `DIRECT` 参数为 `FALSE` 的情况下有效。

:::tip 注意
不支持使用包含 BLOB 列的表生成的导出数据文件在导入时指定 `BLOB_TYPE` 为 `HEX_CHAR`。
:::
