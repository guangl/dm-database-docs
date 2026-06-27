---
title: PAGE_CHECK、PAGE_HASH_NAME
---

`PAGE_CHECK` 为页检查模式。取值范围 0、1、2、3。0：禁用页校验；1：开启页校验并使用 CRC 校验；2：开启页校验并使用指定的 HASH 算法进行校验；3：开启页校验并使用快速 CRC 校验。缺省值为 3。可选参数。

`PAGE_CHECK` 为 0 时不进行页校验；非 0 表示数据页刷盘时会为数据页计算一个校验和值写入数据页头，下次从磁盘加载数据页时校验数据页内容是否正确。

当校验到数据页内容损坏时，分为以下几种情况进行处理：

- 若数据文件（或回滚文件）有镜像文件（涉及到的建库参数有 system_mirror_path、main_mirror_path 和 roll_mirror_path，或在创建表空间时指定镜像文件），系统会自动读取镜像文件中的数据继续提供服务；

- 若没有镜像文件，且 INI 参数 `PTX_ROLLBACK` 为 0：根据 INI 参数 `PAGE_CHECK_POLICY` 的取值确定处理策略，`PAGE_CHECK_POLICY` 为 0 时忽略损坏，`PAGE_CHECK_POLICY` 为 1 时系统主动 HALT；

- 若没有镜像文件，且 INI 参数 `PTX_ROLLBACK` 为 1：
对于大部分数据页损坏的情况，系统会进行报错处理；

对于无法报错处理的少部分情况（包括损坏的数据页是文件 0 号页、系统表空间数据页、文件系统 INODE 页或者描述页等），根据 INI 参数 `PAGE_CHECK_POLICY` 的取值确定处理策略，`PAGE_CHECK_POLICY` 为 0 时忽略损坏，`PAGE_CHECK_POLICY` 为 1 时系统主动 HALT；

`PAGE_HASH_NAME` 用于设置页检查 HASH 算法。当且仅当 `PAGE_CHECK`=2 时，使用 `PAGE_HASH_NAME` 来指定用于页检查的 HASH 算法。HASH 算法可通过 `SELECT CYT_NAME FROM V$CIPHERS WHERE CYT_TYPE=4;`语法获取。

`PAGE_CHECK` 在数据库创建成功后无法修改。可通过使用系统函数获取设置的页检查模式：`select SF_GET_PARA_VALUE(2, 'ENABLE_PAGE_CHECK');`。

`PAGE_HASH_NAME` 在数据库创建成功后无法修改。可通过 `V$PARAMETER` 中的 NAME='`PAGE_CHECK_ID`'查看设置的页检查 HASH 算法 ID，进而通过算法 ID 获取算法名：`SELECT CYT_NAME FROM V$CIPHERS WHERE CYT_ID=(SELECT VALUE FROM V$PARAMETER WHERE NAME= 'PAGE_CHECK_ID');`，另外也可以通过 `V$DM_INI` 中的 PARA_NAME='`PAGE_CHECK_ID`'，或通过使用系统函数获取设置的页检查 HASH 算法 ID：`select SF_GET_PARA_VALUE(2,'PAGE_CHECK_ID');`。
