---
title: AP_PORT_NUM
---

分布式环境下协同工作的监听端口。手动配置的取值范围为 1024~65534。缺省值为 0，表示未配置。可选参数。

数据库创建成功后，可通过修改 INI 参数 AP_PORT_NUM 的值对此参数的设置进行修改。可通过查询 V$PARAMETER 或 V$DM_INI 中的 AP_PORT_NUM 参数名查看此参数当前的设置值，还可以通过使用系统函数 SF_GET_PARA_VALUE 获取此参数当前的设置值。
