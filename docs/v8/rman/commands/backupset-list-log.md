---
title: 查看操作日志
---

# 查看操作日志

dmrman 执行脱机备份还原过程中涉及的日志或跟踪文件，默认情况下都位于达梦数据库的 `log` 目录中。这些日志按月生成，文件名中代表年月的部分会随生成时间变化，例如 2022 年 5 月生成的日志文件名中对应部分为 `202205`，同一个月内日志内容会持续追加。事件日志文件支持按 INI 参数 `SVR_ELOG_FREQ` 指定的频度切换；备份还原日志文件、SBT 接口跟踪文件和 dmrman 日志文件均不支持切换。

操作日志主要包括以下四种类型：

- 事件日志文件：`dm_DMSERVER_xxx.log`
- 备份还原日志文件：`dm_BAKRES_xxx.log`
- SBT 接口跟踪文件：`dm_SBTTRACE_xxx.log`
- dmrman 日志文件：`dm_dmrman_xxx.log`

## 事件日志文件

`dm_DMSERVER_xxx.log` 是全局日志文件，不可配置，记录了达梦数据库运行时的关键事件，例如系统启动、关闭、内存申请失败、IO 错误等致命错误，以及备份还原过程中的阶段性信息。日志格式为：

```plaintext
时间 + 日志类型（INFO/WARN/ERROR/FATAL）+ 进程(database)+ 进程 ID(P 开头)+ 线程(dm_sql_thd/main_thread 等)+ 日志内容
```

示例：

```plaintext
2018-10-08 16:05:06 [INFO] database P0000012596 main_thread  version info: develop
2018-10-08 16:05:06 [INFO] database P0000012596 main_thread  DM Database Server x64 V8.0.0.90-Build(2018.08.20-96055)ENT  startup...
```

## 备份还原日志文件

`dm_BAKRES_xxx.log` 是备份还原日志文件，不可配置。它记录了达梦数据库备份还原在执行备份与还原时产生的日志，包括任务发起进程（联机时为 dmserver 工作线程，脱机时为 dmrman）发送的信息以及 AP 进程的处理过程信息。日志格式为：

```plaintext
时间 + 日志类型（INFO/WARN/ERROR/FATAL/CMD/CMD_PARSE）+ 进程名（dmrman/database/dmap_br）+ 进程 ID(P 开头)+ 线程 ID（T 开头）+ 任务 ID(TID 开头的随机数，唯一标识一条备份还原语句)+ 日志内容
```

示例：

```plaintext
2024-10-11 09:26:17.289 [CMD] database P0000003824 T0000022676 TID1633993416  backup database;
2024-10-11 09:26:17.290 [INFO] database P0000003824 T0000022676 TID1633993416  BACKUP DATABASE [DAMENG],execute......
```

## SBT 接口跟踪文件

`dm_SBTTRACE_xxx.log` 是 SBT 接口跟踪文件，可配置（参见 [配置 dmrman](../configure) 中的跟踪日志文件部分）。只有在打开 TRACE 跟踪（`TRACE LEVEL` 大于 1）的情况下才会生成该文件，记录 SBT 接口的调用过程。默认文件名为 `dm_SBTTRACE_xxx.log`，用户也可以自行设置文件名。日志格式为：

```plaintext
时间 + SBT 接口的调用过程
```

示例：

```plaintext
2018-10-10 16:06:23 sbtrestore(filepath=d:\dmdbms\data\bak\bak.meta)
2018-10-10 16:06:23 sbtread(buf != NULL, buf_len = 4096)
```

## dmrman 日志文件

`dm_dmrman_xxx.log` 是 dmrman 日志文件。使用 dmrman 工具进行脱机备份还原时产生的相关日志信息均记录在该文件中，日志格式与事件日志文件相同。

示例：

```plaintext
2022-11-28 21:41:18.629 [WARNING] dmrman P0000064373 T0000000000000064373 file dm.key not found, use default license!
2022-11-28 21:41:18.682 [INFO] dmrman P0000064373 T0000000000000064373 fil_sys_init
```

## 查看备份集自身的操作记录

除了上述日志文件，还可以使用 [SHOW BACKUPSET](./backupset) 命令查看某个备份集的详细元信息（如备份类型、起止 LSN、备份时间等），结合日志文件中的时间戳和任务 ID，可以完整还原一次备份还原操作的执行过程，便于排查问题。
