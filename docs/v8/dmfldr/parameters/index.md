---
title: 查看 dmfldr 参数
overview: true
---

dmfldr 使用较为灵活，参数较多，用户可以使用 `dmfldr help` 查看 dmfldr 版本信息和各参数的简单信息。

```bash
./dmfldr help
dmfldr V8
version: 03134284585-20260210-314028-20151
书写格式: ./dmfldr KEYWORD=<value> {KEYWORD=<value>}
          其中{}表示大括号内的关键词可为0~N个，N为正整数，{}本身无需出现在语句中
使用示例: ./dmfldr SYSDBA/SYSDBA CONTROL='/opt/data/fldr.ctl'

USERID 必须是命令行中的第一个参数
字符串类型参数必须以引号封闭
```

dmfldr 的众多参数中，`USERID` 是必选参数，且位置必须是第一位。其余参数均为可选参数，需要时指定，指定时也无顺序要求。

快速装载参数的优先级，总体上为命令行参数（接口中为 fldr_set_attr）> 控制文件 > 配置文件。但存在几个特殊参数，如 fields_seperator、badfile、table 等，此类在控制文件的 load 中配置的参数，每个 load 可能使用不同的值，而通过命令行参数对于一个装载进程只能配置一项，因此对于这些参数，命令行参数配置的为全局参数，load 配置的为针对当前 load 的参数，因此 load 中的参数优先级高于命令行参数。

以下为 dmfldr 支持的参数及其说明。dmldrc 的参数大部分与 dmfldr 一致，仅 `SERVER`、`RECONN`、`PLOG` 三个参数为 dmldrc 特有，已一并列于本页末尾（标题中标注"（dmldrc）"以区分）。
