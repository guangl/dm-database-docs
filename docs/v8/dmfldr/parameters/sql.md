---
title: SQL
---

用户指定 `SQL` 查询语句，用于导出自定义查询结果数据，仅导出模式有效。自定义 `SQL` 查询语句会将 `SQL` 语句发送到服务器进行分析执行，若发现 `SQL` 语句不是查询语句，dmfldr 将报错返回。`SQL` 语句可以实现用户的个性化数据导出需要，可以选择需要导出的列，需要过滤的结果。此参数为可选参数，在 `MODE` 为 `OUT` 的情况下有效。`SQL` 查询语句需要使用双引号括起来。

:::tip 注意
当同时使用 `SQL`、`SQLFILE` 参数时，`SQLFILE` 设置的 `SQL` 语句优先级更高。
:::

示例：

```
./dmfldr USERID=SYSDBA/Dmsys_123@192.168.100.121:5254 MODE='OUT' SQL="select * from test where c1='b';" data='/home/test/yy/test.txt'
```
