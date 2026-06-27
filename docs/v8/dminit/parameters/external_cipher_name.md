---
title: EXTERNAL_CIPHER_NAME、EXTERNAL_HASH_NAME、EXTERNAL_CRYPTO_NAME
---

第三方加密时使用。

`EXTERNAL_CIPHER_NAME`：设置默认加密算法，缺省为 DES_CFB。备份、还原、建表等凡是用到加密算法，但是又未指定加密算法的情况下，如果用户指定了第三方加密，则用此算法。可选参数。加密算法可通过 `SELECT CYT_NAME FROM V$CIPHERS WHERE CYT_TYPE<3;` 获得。该参数在数据库创建成功后无法修改。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `EXTERNAL_CIPHER_ID` 参数名查看设置的默认加密算法 ID，还可以通过使用系统函数获取设置的默认加密算法 ID：`select SF_GET_PARA_VALUE (2,'EXTERNAL_CIPHER_ID');`。

`EXTERNAL_HASH_NAME`：设置默认 HASH 算法，缺省为 MD5 或 SHA1（系统根据不同的场景自动选定）。用来生成加密数据的校验码。可选参数。加密算法可通过 `SELECT CYT_NAME FROM V$CIPHERS WHERE CYT_TYPE=4;` 获得。该参数在数据库创建成功后无法修改。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `EXTERNAL_HASH_ID` 参数名查看设置的默认 HASH 算法 ID，还可以通过使用系统函数获取设置的默认加密算法 ID：`select SF_GET_PARA_VALUE(2,'EXTERNAL_HASH_ID');`。

`EXTERNAL_CRYPTO_NAME`：设置服务器根密钥加密引擎，缺省为无加密引擎。加密引擎的使用，详细请参考《DM8 安全管理》一书加密引擎章节。可选参数。加密引擎可通过 `SELECT NAME FROM V$EXTERNAL_CIPHER_LIBS;` 获得。该参数在数据库创建成功后无法修改。可通过查询 `V$PARAMETER` 或 `V$DM_INI` 中的 `EXTERNAL_CRYPTO_NAME` 参数名查看设置的服务器根密钥加密引擎。

`EXTERNAL_CIPHER_NAME`、`EXTERNAL_HASH_NAME` 与 `EXTERNAL_CRYPTO_NAME` 无关，两者没有必然联系。
