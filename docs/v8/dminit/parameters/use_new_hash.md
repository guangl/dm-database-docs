---
title: USE_NEW_HASH
---

是否使用改进的字符类型 HASH 算法。字符类型在计算 HASH 值时所采用的 HASH 算法类别。0：原始 HASH 算法；1：改进的 HASH 算法。缺省值为 1。可选参数。

如果备份文件和数据库文件中该参数值不一致，则还原时会报错。

此参数在数据库创建成功后无法修改，可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `USE_NEW_HASH` 参数名查看此参数的设置值，还可以通过使用系统函数获取此参数的设置值：`select SF_GET_PARA_VALUE(2,'USE_NEW_HASH');`。
