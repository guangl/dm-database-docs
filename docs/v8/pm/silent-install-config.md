---
title: 静默安装配置文件解析
---

# 静默安装配置文件解析

静默安装通过一份 XML 配置文件描述安装参数，避免人工交互。完整模板如下：

```xml
<?xml version="1.0"?>
<DATABASE>
	<!--安装数据库的语言配置，简体中文版: ZH，繁体中文版: CHT，英文版: EN，不区分大小写。不允许为空 -->
	<LANGUAGE>ZH</LANGUAGE>

	<!--安装程序的时区配置，缺省为+08:00，取值范围：-12:59 ~ +14:00 -->
	<TIME_ZONE>+08:00</TIME_ZONE>

	<!-- key 文件路径 -->
	<KEY></KEY>

	<!--安装程序组件类型，取值范围：0、1、2，0 表示安装全部，1 表示安装服务器，2 表示安装客户端。缺省为 0 -->
	<INSTALL_TYPE>0</INSTALL_TYPE>

	<!--安装路径，不允许为空。合法的安装路径允许字符的范围是小写字母(a-z)、大写字母(A-Z)、数字(0-9)、下划线(_)、空格( )和中文 -->
	<INSTALL_PATH></INSTALL_PATH>

	<!--是否初始化库，取值范围：Y/N、y/n，不允许为空 -->
	<INIT_DB></INIT_DB>

	<!--数据库实例参数 -->
	<DB_PARAMS>
		<!--初始数据库存放的路径，不允许为空 -->
		<PATH></PATH>

		<!--初始化数据库名字，缺省为 DAMENG，不超过 128 个字符 -->
		<DB_NAME>DAMENG</DB_NAME>

		<!--初始化数据库实例名字，缺省为 DMSERVER，不超过 128 个字符 -->
		<INSTANCE_NAME>DMSERVER</INSTANCE_NAME>

		<!--初始化时设置 dm.ini 中的 PORT_NUM，缺省为 5236，取值范围：1024~65534 -->
		<PORT_NUM>5236</PORT_NUM>

		<!--初始数据库控制文件的路径，文件路径长度最大为 256 -->
		<CTL_PATH></CTL_PATH>

		<!--初始化数据库日志文件的路径，文件路径长度最大为 256，LOG_PATH 值为空则使用缺省值，如果使用非默认值，LOG_PATH 中节点数不能少于 2 个 -->
		<LOG_PATHS>
			<LOG_PATH>
			</LOG_PATH>
		</LOG_PATHS>

		<!--数据文件使用的簇大小，取值范围：16 页、32 页、64 页，缺省为 16 页 -->
		<EXTENT_SIZE>16</EXTENT_SIZE>

		<!--数据文件使用的页大小，取值范围：4K、8K、16K、32K，缺省为 8K -->
		<PAGE_SIZE>8</PAGE_SIZE>

		<!--重做日志文件使用的大小，单位 MB，在 32 位版本下，取值范围为 256~2048 之间的整数，缺省值为 2048；在 64 位版本下，取值范围为 256 和 8192 之间的整数，缺省值为 4096 -->
		<LOG_SIZE>4096</LOG_SIZE>

		<!--大小写敏感。取值范围：Y/N y/n 1/0，缺省为 Y -->
		<CASE_SENSITIVE>Y</CASE_SENSITIVE>

		<!--字符集选项，缺省为 0。0 代表 GB18030，1 代表 UTF-8，2 代表韩文字符集 EUC-KR -->
		<CHARSET>0</CHARSET>

		<!--字符类型在计算 HASH 值时所采用的 HASH 算法类别。取值范围 0，1。0：原始 HASH 算法；1：改进的 HASH 算法。缺省为 1 -->
		<USE_NEW_HASH>1</USE_NEW_HASH>

		<!--初始化时设置 SYSDBA 的密码。1. 长度不能小于 8 且不能大于 48 2. 需要同时包含大写字母、小写字母和数字 -->
		<SYSDBA_PWD></SYSDBA_PWD>

		<!--初始化时设置 SYSAUDITOR 的密码。1. 长度不能小于 8 且不能大于 48 2. 需要同时包含大写字母、小写字母和数字 -->
		<SYSAUDITOR_PWD></SYSAUDITOR_PWD>

		<!--初始化时设置 SYSSSO 的密码。仅在安全版本下可见和可设置。1. 长度不能小于 8 且不能大于 48 2. 需要同时包含大写字母、小写字母和数字 -->
		<SYSSSO_PWD></SYSSSO_PWD>

		<!--初始化时设置 SYSDBO 的密码。仅在安全版本下可见和可设置。1. 长度不能小于 8 且不能大于 48 2. 需要同时包含大写字母、小写字母和数字 -->
		<SYSDBO_PWD></SYSDBO_PWD>

		<!--初始化时区，默认是东八区。格式为：正负号小时：分钟，取值范围：-12:59 ~ +14:00 -->
		<TIME_ZONE>+08:00</TIME_ZONE>

		<!--是否启用页面内容校验，取值范围：0，1，2，3。0：不启用；1：开启页校验并使用 CRC 校验；2：开启页校验并使用指定的 HASH 算法进行校验；3：开启页校验并使用快速 CRC 校验。缺省为 3 -->
		<PAGE_CHECK>3</PAGE_CHECK>

		<!--设置默认加密算法，不超过 128 个字符 -->
		<EXTERNAL_CIPHER_NAME></EXTERNAL_CIPHER_NAME>

		<!--设置默认 HASH 算法，不超过 128 个字符 -->
		<EXTERNAL_HASH_NAME></EXTERNAL_HASH_NAME>

		<!--设置根密钥加密引擎，不超过 128 个字符 -->
		<EXTERNAL_CRYPTO_NAME></EXTERNAL_CRYPTO_NAME>

		<!--全库加密密钥使用的算法名。算法可以是 DM 内部支持的加密算法，或者是第三方的加密算法。默认使用 "AES256_ECB" 算法加密，最长为 128 个字节 -->
		<ENCRYPT_NAME></ENCRYPT_NAME>

		<!--用于加密服务器根密钥，最长为 48 个字节 -->
		<USBKEY_PIN></USBKEY_PIN>

		<!--设置空格填充模式，取值范围：0，1，缺省为 0 -->
		<BLANK_PAD_MODE>0</BLANK_PAD_MODE>

		<!--指定 system.dbf 文件的镜像路径，缺省值为空 -->
		<SYSTEM_MIRROR_PATH></SYSTEM_MIRROR_PATH>

		<!--指定 main.dbf 文件的镜像路径，缺省值为空 -->
		<MAIN_MIRROR_PATH></MAIN_MIRROR_PATH>

		<!--指定 roll.dbf 文件的镜像路径，缺省值为空 -->
		<ROLL_MIRROR_PATH></ROLL_MIRROR_PATH>

		<!--是否是四权分立，取值范围：0，1。0：不使用；1：使用。缺省为 0。仅在安全版本下可见和可设置。 -->
		<PRIV_FLAG>0</PRIV_FLAG>

		<!--指定初始化过程中生成的日志文件所在路径。合法的路径，文件路径长度最大为 257（含结束符），不包括文件名 -->
		<ELOG_PATH></ELOG_PATH>
	</DB_PARAMS>

	<!--是否创建数据库实例的服务，取值范围：Y/N y/n，不允许为空，不初始化数据库将忽略此节点。非 root 用户不能创建数据库服务。 -->
	<CREATE_DB_SERVICE>Y</CREATE_DB_SERVICE>

	<!--是否启动数据库，取值范围：Y/N y/n，不允许为空，不创建数据库服务将忽略此节点。 -->
	<STARTUP_DB_SERVICE>N</STARTUP_DB_SERVICE>
</DATABASE>
```

## 顶层节点

| 节点 | 说明 |
| --- | --- |
| `LANGUAGE` | 安装语言：`ZH`（简体中文）、`CHT`（繁体中文）、`EN`（英文），不区分大小写，不允许为空 |
| `TIME_ZONE` | 安装程序的时区，缺省为 `+08:00`，取值范围 `-12:59` ~ `+14:00` |
| `KEY` | Key 文件路径 |
| `INSTALL_TYPE` | 安装组件类型：`0` 全部、`1` 服务器、`2` 客户端，缺省为 `0` |
| `INSTALL_PATH` | 安装路径，不允许为空，只能包含小写字母、大写字母、数字、下划线、空格和中文 |
| `INIT_DB` | 是否初始化数据库：`Y`/`N`（不区分大小写），不允许为空 |
| `DB_PARAMS` | 数据库实例参数，详见下表 |
| `CREATE_DB_SERVICE` | 是否创建数据库服务：`Y`/`N`，不允许为空；不初始化数据库时忽略此节点，非 `root` 用户无法创建数据库服务 |
| `STARTUP_DB_SERVICE` | 是否启动数据库：`Y`/`N`，不允许为空；不创建数据库服务时忽略此节点 |

## DB_PARAMS 子节点

| 节点 | 说明 |
| --- | --- |
| `PATH` | 数据库存放路径，不允许为空 |
| `DB_NAME` | 数据库名，缺省为 `DAMENG`，不超过 128 个字符 |
| `INSTANCE_NAME` | 数据库实例名，缺省为 `DMSERVER`，不超过 128 个字符 |
| `PORT_NUM` | 即 `dm.ini` 中的 `PORT_NUM`，缺省为 `5236`，取值范围 `1024`~`65534` |
| `CTL_PATH` | 控制文件路径，长度上限 256 |
| `LOG_PATHS` / `LOG_PATH` | 日志文件路径，长度上限 256；为空则使用缺省值，使用非默认值时节点数不能少于 2 个 |
| `EXTENT_SIZE` | 簇大小：`16`、`32`、`64` 页，缺省为 `16` 页 |
| `PAGE_SIZE` | 页大小：`4K`、`8K`、`16K`、`32K`，缺省为 `8K` |
| `LOG_SIZE` | 重做日志文件大小（MB）：32 位版本取值 `256`~`2048`（缺省 `2048`），64 位版本取值 `256`~`8192`（缺省 `4096`） |
| `CASE_SENSITIVE` | 大小写敏感：`Y`/`N`/`1`/`0`，缺省为 `Y` |
| `CHARSET` | 字符集：`0` GB18030、`1` UTF-8、`2` 韩文字符集 EUC-KR，缺省为 `0` |
| `USE_NEW_HASH` | HASH 算法类别：`0` 原始算法、`1` 改进算法，缺省为 `1` |
| `SYSDBA_PWD` | `SYSDBA` 密码，长度 8~48 位，必须同时包含大写字母、小写字母和数字 |
| `SYSAUDITOR_PWD` | `SYSAUDITOR` 密码，要求同上 |
| `SYSSSO_PWD` | `SYSSSO` 密码，仅安全版可见可设置，要求同上 |
| `SYSDBO_PWD` | `SYSDBO` 密码，仅安全版可见可设置，要求同上 |
| `TIME_ZONE` | 数据库初始化时区，默认东八区，格式为"正负号小时:分钟"，取值范围 `-12:59` ~ `+14:00` |
| `PAGE_CHECK` | 页面内容校验：`0` 不启用、`1` CRC 校验、`2` 指定 HASH 算法校验、`3` 快速 CRC 校验，缺省为 `3` |
| `EXTERNAL_CIPHER_NAME` | 默认加密算法名，不超过 128 个字符 |
| `EXTERNAL_HASH_NAME` | 默认 HASH 算法名，不超过 128 个字符 |
| `EXTERNAL_CRYPTO_NAME` | 根密钥加密引擎名，不超过 128 个字符 |
| `ENCRYPT_NAME` | 全库加密密钥使用的算法名，默认 `AES256_ECB`，最长 128 字节 |
| `USBKEY_PIN` | 用于加密服务器根密钥，最长 48 字节 |
| `BLANK_PAD_MODE` | 空格填充模式：`0`/`1`，缺省为 `0` |
| `SYSTEM_MIRROR_PATH` | `system.dbf` 镜像路径，缺省为空 |
| `MAIN_MIRROR_PATH` | `main.dbf` 镜像路径，缺省为空 |
| `ROLL_MIRROR_PATH` | `roll.dbf` 镜像路径，缺省为空 |
| `PRIV_FLAG` | 是否启用四权分立：`0` 不使用、`1` 使用，缺省为 `0`，仅安全版可见可设置 |
| `ELOG_PATH` | 初始化过程中生成的日志文件路径，长度上限 257（含结束符），不包含文件名 |
