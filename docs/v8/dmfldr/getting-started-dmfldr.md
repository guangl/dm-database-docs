---
title: dmfldr 入门
---

# dmfldr 入门

本章简单介绍如何启动 dmfldr，以及 dmfldr 支持的参数概览。通过阅读本章，读者可以了解 dmfldr 通过各参数能提供的各项功能，不过要想熟练灵活地使用 dmfldr 还需要继续阅读下一章。

## 启动 dmfldr

安装好达梦数据库管理系统后，在安装目录的 `bin` 子目录下可找到 dmfldr 执行文件。启动操作系统的命令行窗口，进入 dmfldr 所在目录，可以准备启动 dmfldr 工具了。

dmfldr 的使用必须指定必要的参数，否则工具会报错"无效的参数个数"并退出。为 dmfldr 指定参数的格式为：

```
dmfldr keyword=value [keyword=value ...]
```

`USERID` 是启动 dmfldr 必须要指定的参数，且 `USERID` 必须是第一个参数。其它参数用户需根据实际情况选取。

**例 1** 使用 `USERID` 和 `CONTROL` 参数启动 dmfldr，完成载入。

```
./dmfldr USERID=SYSDBA/Dmsys_123 MODE='IN' CONTROL='/opt/data/test.ctl'
```

**例 2** 使用 `USERID` 和 `CONTROL` 参数启动 dmfldr，完成载出。

```
./dmfldr USERID=SYSDBA/Dmsys_123 MODE='OUT' CONTROL='/opt/data/test.ctl'
```

**例 3** 使用 `USERID`、`OUT`、`TABLE` 和 `DATA` 参数启动 dmfldr。将 test 表中数据载出到 test.txt 文件中。

```
./dmfldr USERID=SYSDBA/Dmsys_123@localhost:5236 MODE='OUT' TABLE=test DATA='/opt/data/test.txt'
```

**例 4** 使用 `USERID`、`IN`、`TABLE` 和 `DATA` 参数启动 dmfldr。将 test.txt 文件中数据载入到 test 表中。

```
./dmfldr USERID=SYSDBA/Dmsys_123@localhost:5236 MODE='IN' TABLE=test DATA='/opt/data/test.txt'
```

除了在启动命令行中直接指定 dmfldr 参数值外，用户还可以通过 `CONTROL` 参数设置控制文件中的 `OPTIONS` 选项来指定 dmfldr 参数值，也可以在 dmfldr.ini 配置文件中指定 dmfldr 参数值。

:::tip 注意
dmfldr 参数值的优先选择顺序为：优先为命令行参数，其次为控制文件中指定的参数值，最后为 dmfldr.ini 配置文件中指定的参数值。

有以下特殊情况：

- 使用控制文件时，装载表和数据文件优先使用控制文件中的值；
- 不使用控制文件时，装载表和数据文件优先使用命令行中的值。
:::

参数详情请参阅[查看 dmfldr 参数](./parameters/)。
