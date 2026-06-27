---
title: 入门指南
---

## 启动 disql

为了使用 disql，必须首先要启动 disql。disql 工具可以广泛用于各种操作系统，如 Windows, Linux 等。

启动之后，当出现 `SQL>` 符号时，用户就可以利用达梦数据库提供的 SQL 语句和数据库进行交互操作了，需要注意的是，在 disql 中 SQL 语句应以分号 `;` 结束。对于执行语句块，创建触发器、存储过程、函数、包以及模式等时需要用 `/` 结束。

## 使用 disql

以一个简单的查询例子来说明如何使用 disql。只需要输入一条 SQL 语句，回车即可。disql 将 SQL 语句发送给达梦数据库服务器并显示服务器返回的结果。

```txt
SQL>select top 5 name,id from sysobjects;
```

执行结果如下：

```txt
行号       NAME       ID

---------- ---------- -----------

1          SYSOBJECTS 0

2          SYSINDEXES 1

3          SYSCOLUMNS 2

4          SYSUSER$   3

5          SYSCONS    4

已用时间: 0.415(毫秒). 执行号:518.
```

## 退出 disql

使用 EXIT/QUIT 命令，提交或回滚事务，断开数据库连接，并且退出 disql。
