---
title: RLOG_ENCRYPT_NAME
---

设置联机日志文件和归档日志文件的加密算法，若未设置则不加密。

`RLOG_ENCRYPT_NAME` 支持使用第三方加密算法，但不支持工作模式为 WORK_MODE_CBC_NOPAD、WORK_MODE_ECB_NOPAD 或 WORK_MODE_EXTKEY 的加密算法，关于加密算法的工作模式可参考《DM8 安全管理》8.1.1 节。

此参数在数据库创建成功后无法修改，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `RLOG_ENC_ID` 参数名查看此参数设置的加密算法 ID，还可以通过使用系统函数获取此参数设置的加密算法 ID：`select SF_GET_PARA_VALUE(2,'RLOG_ENC_ID');`。
