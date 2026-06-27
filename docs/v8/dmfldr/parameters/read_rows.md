---
title: READ_ROWS
---

指定读取缓冲区每次读取的最大行数，整数类型，取值范围为 0~(2^26-10000)，缺省为 100000。在某些情况下，1MB 的 `BUFFER_NODE_SIZE` 读入的数据行数很大，而后续操作处理不了这么大的行数，此时可以用 `READ_ROWS` 来限制处理的行数。dmfldr 取 `READ_ROWS` 和 `BUFFER_NODE_SIZE` 中较小的值作为一次处理的行数。
