---
title: EXPLAIN_MODE
---

设置 SQL 执行方式。

## 语法

## 参数

* `0` - 正常执行 SQL 语句；
* `1` - 按照 `EXPLAIN FOR` 方式执行，即在 SQL 语句前自动拼接上 `EXPLAIN FOR` 之后再执行；
* `2` - 按 `EXPLAIN` 方式执行，即在 SQL 语句前自动拼接上 `EXPLAIN` 之后再执行；
