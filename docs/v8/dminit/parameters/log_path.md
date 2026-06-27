---
title: LOG_PATH
---

初始数据库日志文件的路径。默认值 Windows 下为 `PATH\DB_NAME\DB_NAME01.log` 和 `PATH\DB_NAME\DB_NAME02.log`，Linux 下为 `PATH/DB_NAME/DB_NAME01.log` 和 `PATH/DB_NAME/DB_NAME02.log`（`PATH` 和 `DB_NAME` 表示各自设置的值）。文件路径长度最大为 256 个字符。日志文件路径个数不能超过 10 个。可选参数。

修改日志文件大小可以使用 `LOG_SIZE` 参数。

例  创建一个数据库，包含两个日志文件 `DATA01.log` 和 `DATA02.log`。

```plaintext
./dminit PATH=/home/dest/dmdbms LOG_PATH=/home/dest/dmdbms/DATA01.log
LOG_PATH=/home/dest/dmdbms/DATA02.log SYSDBA_PWD=DMdba_123 SYSAUDITOR_PWD=DMauditor_123
```

数据库创建成功后，可以在运行时使用 `ALTER DATABASE` 修改数据库语句增加日志文件或对日志文件进行重命名。可通过查询 `V$RLOGFILE` 的 `PATH` 列查看当前系统各日志文件的路径。
