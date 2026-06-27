---
title: SERVER（dmldrc）
---

用于指定 dmldrp 的 IP 地址和端口号。必选参数，且必须位于参数位置的第二个。

该参数不需要指定参数名 `SERVER`，直接指定 `host[:port]`。端口号缺省为 8336，本机 IP 可写做 localhost。

**例** 在 dmldrc 中指定 IP 和端口号分别为 192.168.1.64 和 9898 的 dmldrp：

```
./dmldrc userid=SYSDBA/Dmsys_123@localhost:5236 192.168.1.64:9898 control='/opt/data/test.ctl'
```
