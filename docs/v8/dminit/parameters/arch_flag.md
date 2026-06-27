---
title: ARCH_FLAG
---

初始化时设置 dm.ini 中的 ARCH_INI 值。取值范围为 0 或 1。缺省值为 0。可选参数。

1 表示设置 ARCH_INI=1，启用归档。同时，需要配置 dmarch.ini 文件。

0 表示设置 ARCH_INI=0，不启用归档。

数据库创建成功后，可通过修改 INI 参数 ARCH_INI 重新设置 ARCH_INI。可通过查询 V$PARAMETER 或 V$DM_INI 中的 ARCH_INI 参数名查看 ARCH_INI 当前的设置值，还可以通过使用系统函数 SF_GET_PARA_VALUE 获取 ARCH_INI 当前的设置值。
