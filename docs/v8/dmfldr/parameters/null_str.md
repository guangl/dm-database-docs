---
title: NULL_STR
---

载入时视为 NULL 值处理的字符串，字符串类型，默认忽略此参数。载入时，数据中的该内容被视为 NULL；载出时，数据中的 NULL 被转换为 null_str 指定的内容。

一般情况下，若设置了 `NULL_STR`，则此参数值将成为数据文件中 NULL 值的唯一表示方式。`NULL_STR` 区分字符串大小写，并且长度不允许超过 128 个字节。

但需要注意的是，在开启装载兼容模式 `COMPATIBLE_MODE` 时，`NULL_STR` 的优先级会低于兼容模式下的相关 NULL 的特殊值，此时 `NULL_STR` 不再是数据文件中 NULL 的唯一表示方式。此参数为可选参数。

示例：

```
./dmfldr USERID=SYSDBA/Dmsys_123@localhost:5236 MODE='IN' TABLE=test DATA='/opt/data/test.txt' null_str='abc'
```
