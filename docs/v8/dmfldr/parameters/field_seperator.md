---
title: FIELD_SEPERATOR
---

指定列分隔符，分隔符额外指定 X 表示十六进制的分隔符，长度应小于 255。可选参数。

示例：

```
./dmfldr USERID=SYSDBA/Dmsys_123@192.168.100.165:9999 FIELD_SEPERATOR='|' ROW_SEPERATOR=X '0A' DATA='/opt/data/D1.TXT' TABLE="sysdba"."tyjm" mode='in' SINGLE_FILE=true
```
