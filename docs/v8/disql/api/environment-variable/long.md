---
title: LONG
---

设置 `BLOB/CLOB/CHAR/VARCHAR/BINARY/VARBINARY/CLASS` 等类型一列能显示的最大字节数。

## 语法

![语法图](./railroad/long.svg)

## 参数

* `n` - 能够显示的最大字节数；

## 示例

表结构为：
```sql
CREATE TABLE TEST(C1 TEXT);
INSERT INTO TEST VALUES('disql是DM数据库的一个命令行客户端工具，用来与DM数据库服务器进行交互。');
COMMIT;

```

执行以下命令
```txt
SQL> SET LONG 10
SQL> SELECT * FROM TEST;
```
执行结果如下
```txt
警告: 字符串截断
行号     C1
---------- ---------
1          disql是DM
已用时间: 0.237(毫秒). 执行号:55109.
```
