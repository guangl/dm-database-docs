---
title: CHAR_FIX_STORAGE
---

定长字符（CHAR）是否按定长存储，取值范围为：Y/N，1/0。缺省为 N，可选参数。

Y/1：表示定长字符（CHAR）按定长存储，即不允许 CHAR 变化为 VARCHAR2 进行存储；

N/0：表示定长字符（CHAR）按变长存储，即允许 CHAR 变化为 VARCHAR2 进行存储。

此参数在数据库创建成功后无法修改，可通过使用系统函数获取此参数的设置值：select SF_GET_PARA_VALUE(2,'CHAR_FIX_STORAGE');。
