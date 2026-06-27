---
title: FLDR_INI
---

指定 dmfldr.ini 配置文件路径，字符串类型。用户可在 dmfldr.ini 文件中指定除 `USERID`、`CONTROL`、`HELP` 以外的所有 dmfldr 参数值。可选参数，未指定该参数时，默认在当前目录下查找 dmfldr.ini 配置文件。

dmfldr.ini 配置文件的语法如下：

```
OPTIONS(
<id>=<value>
……
)
```

文件中每个参数值对之间使用空格或者换行分隔。dmfldr.ini 配置文件中指定 `SQL` 参数时，对于 `SQL` 语句中出现的单引号需要使用单引号括起来。

示例：完整的 dmfldr.ini 文件。

```
OPTIONS(
MODE='OUT'
SQL='SELECT * FROM TEST WHERE C1=''B'';'
LOG='/home/test/yy/test_log.log'
DATA='/home/test/yy/test.txt'
)
```
