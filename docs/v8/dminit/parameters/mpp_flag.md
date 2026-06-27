---
title: MPP_FLAG
---

MPP 系统内的库初始化时设置 dm.ini 中的 `MPP_INI`。取值范围为 0 或 1。缺省值为 0。可选参数。

1 表示设置 `MPP_INI`=1，启用 MPP 系统。

0 表示设置 `MPP_INI`=0，不启用 MPP 系统。

数据库创建成功后，可通过修改 INI 参数 `MPP_INI` 重新设置 `MPP_INI`。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `MPP_INI` 参数名查看 `MPP_INI` 当前的设置值，还可以通过使用系统函数 SF_GET_PARA_VALUE 获取 `MPP_INI` 当前的设置值。
