---
title: SEC_PRIV_MODE
---

权限管理模式。取值范围 0、1、2、3、4。0：TRADITION，表示传统模式；1：BMJ，表示专用机模式；2：EVAL，表示 EVAL 测评模式；3：ZB，表示 ZB 模式；4：ZBMM，表示 ZBMM 模式。缺省值为 0。可选参数。

数据库创建成功后，可通过修改 INI 参数 `SEC_PRIV_MODE` 的值对此参数的设置进行修改。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `SEC_PRIV_MODE` 参数名查看此参数当前的设置值，还可以通过使用系统函数 SF_GET_PARA_VALUE 获取此参数当前的设置值。
