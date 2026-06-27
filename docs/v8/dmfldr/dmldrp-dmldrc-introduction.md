---
title: dmldrp 和 dmldrc 入门
---

# dmldrp 和 dmldrc 入门

dmldrp 和 dmldrc 只支持快速载入功能，不支持快速载出功能。

## dmldrp

### 启动 dmldrp

安装达梦数据库管理系统后，在安装目录 `bin` 子目录下可找到 dmldrp 执行文件。

启动操作系统的命令行窗口，进入 dmldrp 所在目录，可以准备启动 dmldrp 工具了。

dmldrp 的使用必须指定必要的参数，否则工具会报错"无效的参数个数"并退出。为 dmldrp 指定参数的格式为：

```
dmldrp keyword=value
```

**例** 启动一个端口号为 9898 的 dmldrp：

```
./dmldrp.exe port=9898
```

### 查看 dmldrp 参数

用户可以使用 `dmldrp help` 查看 dmldrp 版本信息和各参数的简单信息。

```
./dmldrp help
dmldrp V8
version: 03134284585-20260210-314028-20151
书写格式: ./dmldrp KEYWORD=<value>
使用示例: ./dmldrp
---------------------------------------------------------------------
关键词（KEYWORD）        说明                缺省值        是否必选项
---------------------------------------------------------------------
PORT                     端口号              8336          否
HELP                     打印帮助信息        无            否
---------------------------------------------------------------------
```

### dmldrp 参数简介

dmldrp 只有两个参数：端口号和 `HELP`。

`PORT`

dmldrp 的端口号，用于 dmldrp 和 dmldrc 之间的通信连接。取值范围为 1024~65534。可选配置，不配置则使用默认的端口 8336。

`HELP`

获取帮助信息。

## dmldrc

### 启动 dmldrc

安装好达梦数据库管理系统后，在安装目录 `bin` 子目录下可找到 dmldrc 执行文件。

启动操作系统的命令行窗口，进入 dmldrc 所在目录，可以准备启动 dmldrc 工具了。

dmldrc 的使用必须指定必要的参数，否则工具会报错"无效的参数个数"并退出。为 dmldrc 指定参数的格式为：

```
dmldrc keyword=value [keyword=value ...]
```

**例** dmldrc 连接一个端口号为 9898 的 dmldrp：

```
./dmldrc userid=SYSDBA/Dmsys_123@localhost:5236 localhost:9898 control='/opt/data/test.ctl'
```

### 查看 dmldrc 参数

dmldrc 使用较为灵活，参数较多，用户可以使用 `dmldrc help` 查看 dmldrc 版本信息和各参数的简单信息。

```
./dmldrc help
dmldrc V8
version: 03134284585-20260210-314028-20151
书写格式: ./dmldrc KEYWORD=<value> {KEYWORD=<value>}
          其中{}表示大括号内的关键词可为0~N个，N为正整数，{}本身无需出现在语句中
使用示例: ./dmldrc SYSDBA/SYSDBA 192.168.0.1:8336

USERID 必须是命令行中的第一个参数
SERVER 必须是命令行中的第二个参数
字符串类型参数必须以引号封闭
```

dmldrc 的参数大部分与 dmfldr 参数用法一致，`SERVER`、`RECONN`、`PLOG` 三个为 dmldrc 特有参数，详见[查看 dmfldr 参数](./parameters/)。
