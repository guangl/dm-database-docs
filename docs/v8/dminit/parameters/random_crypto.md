---
title: RANDOM_CRYPTO
---

指定数据库中使用的随机数算法所在的加密引擎名。未指定或指定的加密引擎不存在，又或者指定的加密引擎中不存在随机数算法，则使用 OPENSSL 提供的软件随机数算法。支持的加密引擎名可以通过查询视图 `V$EXTERNAL_CIPHER_LIBS` 的 NAME 列获取。

数据库创建成功后，可通过修改 INI 参数 `RANDOM_CRYPTO` 的值对此参数的设置进行修改。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `RANDOM_CRYPTO` 参数名查看此参数的设置值。
