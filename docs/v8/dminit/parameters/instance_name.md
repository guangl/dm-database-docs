---
title: INSTANCE_NAME
---

初始化数据库实例名称，缺省值为 DMSERVER。名称为字符串，长度不能超过 16 个字符。可选参数。实例名称只能由_、$、大写字母 A 至 Z、小写字母 a 至 z、数字 0 至 9 组成，且第一个字符不能是数字。例如：一个合格的实例名称为 Dmserver$1。

数据库创建成功后，可通过修改 INI 参数 `INSTANCE_NAME` 的值对此参数的设置进行修改。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `INSTANCE_NAME` 参数名获取当前的数据库实例名。
