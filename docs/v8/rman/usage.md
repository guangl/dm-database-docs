---
title: 使用 dmrman
---

# 使用 dmrman

dmrman 工具需要从命令行启动。找到 dmrman 所在安装目录的执行码目录（如 LINUX 上为 `/bin`），转到该目录，输入以下命令即可启动：

```bash
./dmrman
```

启动成功后，控制台会显示命令提示符：

```plaintext
RMAN>
```

在提示符下输入命令即可执行备份还原操作，大多数命令可以加分号结束，也可以不加分号。命令是按行解析的，一条完整的命令不能拆成多行输入，否则会报错。退出 dmrman 环境，在提示符下输入 `exit` 即可：

```plaintext
RMAN>exit
```

除了逐条输入命令，dmrman 控制台还支持执行脚本文件。先创建一个包含 dmrman 命令的文本文件，再在提示符下用反引号（`` ` ``）加文件路径的方式执行：

```plaintext
RMAN>`/home/dm_cmd/cmd_file.txt
```

## 命令行启动参数

除了进入控制台交互执行命令外，dmrman 也支持在启动时通过命令行参数指定脚本或语句，命令执行完毕后工具会自动退出。dmrman 支持的命令行参数如下：

- `CTLFILE`：指定待执行语句所在的脚本文件路径，文件格式为 `*.txt`，不能和 `CTLSTMT` 同时使用。
- `CTLSTMT`：直接在命令行中指定待执行的语句，不能和 `CTLFILE` 同时使用，待执行语句需要用双引号括起来。
- `DCR_INI`：指定 `dmdcr.ini` 路径，用于访问 ASM 存储服务；若未指定，则认为不存在 ASM 存储。主要用于 DMDSC 环境，可单独使用，也可与其他参数配合使用。
- `USE_AP`：指定备份还原的执行策略，取值 `1` 或 `2`，默认为 `1`。`1` 表示使用 dmap 辅助进程方式执行备份还原，此时要求先启动 dmap 服务；`2` 表示无辅助进程方式，由 dmrman 进程自身完成备份还原，不依赖 dmap 服务，但在该取值下不能执行第三方介质备份（即指定 `DEVICE TYPE` 为 `TAPE`）。
- `AP_PORT`：使用 dmap 执行备份还原时 dmap 的监听端口号，取值范围 1024~65534，默认为 4236；发起连接端的端口则在 1024~65535 之间随机分配。
- `DMAP_INI`：指定 `dmap.ini` 路径，用于配置 dmrman 执行脱机备份还原操作时生成的 dmrman、BAKRES 日志的日志切换参数。需要注意，`dmap.ini` 中配置的 `AP_PORT` 不会更改 dmrman 连接 dmap 的端口号，仍以命令行指定的 `AP_PORT` 为准。
- `HELP`：打印帮助信息。

`CTLFILE` 或 `CTLSTMT` 中如果包含多条语句，每条语句都必须以分号结尾；若只执行单条语句，分号可以省略。若使用 DMASM 文件系统，可通过 `DCR_INI` 指定目标联机的 ASM 服务器。

命令行指定脚本执行的示例：先创建一个名为 `cmd_rman.txt` 的文件，保存到 `/home/dm_cmd` 目录下，文件中包含如下一行命令：

```plaintext
BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini';
```

设置 `CTLFILE` 参数启动 dmrman，指定脚本文件中的命令将被执行：

```bash
./dmrman CTLFILE=/home/dm_cmd/cmd_rman.txt
```

命令行直接指定执行语句的示例：

```bash
./dmrman CTLSTMT="BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini';"
```

## 示例会话

下面是一个简单的交互式会话示例：备份数据库，然后退出工具。

```plaintext
$ ./dmrman
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini';
...
backup successfully!
RMAN>exit
```
