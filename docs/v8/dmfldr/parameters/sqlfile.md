---
title: SQLFILE
---

用户指定 `SQL` 查询语句所在文件路径，用于导出自定义查询结果数据，仅导出模式有效。当 `SQL` 查询语句过长时，用户可以将 `SQL` 查询语句写入文件中，然后使用 `SQLFILE` 参数指定 `SQL` 查询语句所在文件路径。此参数为可选参数，在 `MODE` 为 `OUT` 的情况下有效。

:::tip 注意
当同时使用 `SQL`、`SQLFILE` 参数时，`SQLFILE` 设置的 `SQL` 语句优先级更高。
:::

示例：`SQL` 查询语句所在文件路径为 `/home/test/yy/test.sql`，文件内容如下：

```sql
select * from test where c1='b';
```

使用 `SQLFILE` 参数指定 `SQL` 查询语句所在文件路径进行数据导出。

```
./dmfldr USERID=SYSDBA/Dmsys_123@192.168.100.121:5254 MODE='OUT' SQLFILE='/home/test/yy/test.sql' data='/home/test/yy/test.txt'
```
