---
title: 查看 dminit 参数
---

# 查看 dminit 参数

dminit 使用较为灵活，参数较多。用户可使用 `dminit HELP` 快速查看 dminit 版本信息和各参数信息。

在安全版本和非安全版本中，dminit help 看到的参数略有不同。下面展示的为安全版本中 help 信息。

```bash
./dminit help
dminit V8
db version: 0x7000d
License will expire on 2026-04-11
version: 05134284389-20250411-268655-10000
书写格式: ./dminit KEYWORD=<value> {KEYWORD=<value>}
          其中{}表示大括号内的关键词可为0~N个，N为正整数，{}本身无需出现在语句中
使用示例: ./dminit PATH=/public/dmdb/dmData PAGE_SIZE=16 SYSDBA_PWD=... SYSAUDITOR_PWD=... [SYSSSO_PWD=...]
-------------------------------------------------------------------------------
关键词（KEYWORD）      说明                       缺省值               是否必选项
-------------------------------------------------------------------------------
INI_FILE        初始化文件dm.ini存放的路径           无                      否
PATH            初始数据库存放的路径            dminit所在目录                否
CTL_PATH        控制文件路径                   PATH/DB_NAME/dm.ctl         否
LOG_PATH        日志文件路径                 PATH/DB_NAME/DB_NAME01.log    否
                                               PATH/DB_NAME/DB_NAME02.log
EXTENT_SIZE      数据文件使用的簇大小，可选值：16, 32, 64，单位：页      16       否
PAGE_SIZE        数据页大小，可选值：4, 8, 16, 32，单位：K             8         否
LOG_SIZE         日志文件大小，单位为：M，范围为：256M ~ 8G            4096       否
CASE_SENSITIVE   大小写敏感，可选值：Y/N，1/0                         Y          否
CHARSET/UNICODE_FLAG    字符集，可选值：0[GB18030]，1[UTF-8]，2[EUC-KR]    0     否
SEC_PRIV_MODE     权限管理模式，可选值：0[TRADITION]，1[BMJ]，2[EVAL]，3[BAIST]，4[ZBMM]
                                                                     0            否
SYSDBA_PWD           设置SYSDBA密码                   无              是
SYSAUDITOR_PWD       设置SYSAUDITOR密码               无              是
DB_NAME              数据库名                         DAMENG          否
INSTANCE_NAME        实例名                           DMSERVER        否
PORT_NUM             监听端口号                        5236            否
BUFFER               NORMAL缓冲区大小，单位M            8000            否
TIME_ZONE            设置时区                         +08:00           否
PAGE_CHECK           页检查模式，可选值：0/1/2/3         3                否
PAGE_HASH_NAME       设置页检查HASH算法                 无               否
EXTERNAL_CIPHER_NAME        设置默认加密算法            DES_CFB           否
EXTERNAL_HASH_NAME          设置默认HASH算法            MD5或SHA1         否
EXTERNAL_CRYPTO_NAME        设置根密钥加密引擎           无                 否
RLOG_ENCRYPT_NAME           设置日志文件加密算法，若未设置，则不加密     无        否
RLOG_POSTFIX_NAME     设置日志文件后缀名，长度不超过10。   log，例如DAMENG01.log    否
USBKEY_PIN              设置USBKEY PIN             dm_service.prikey            否
PAGE_ENC_SLICE_SIZE     设置页加密分片大小，可选值：0、512、4096，单位：Byte    4096   否
ENCRYPT_NAME            设置全库加密算法                          无            否
BLANK_PAD_MODE              设置空格填充模式，可选值：0/1           0             否
SYSTEM_MIRROR_PATH          SYSTEM数据文件镜像路径                无             否
MAIN_MIRROR_PATH            MAIN数据文件镜像                     无              否
ROLL_MIRROR_PATH            回滚文件镜像路径                      无              否
MAL_FLAG                    初始化时设置dm.ini中的MAL_INI          0              否
ARCH_FLAG                   初始化时设置dm.ini中的ARCH_INI         0              否
MPP_FLAG              Mpp系统内的库初始化时设置dm.ini中的mpp_ini     0              否
CONTROL               初始化配置文件（配置文件格式见系统管理员手册）    无              否
AUTO_OVERWRITE       是否覆盖所有同名文件 0:不覆盖 1:部分覆盖 2:完全覆盖       0       否
USE_NEW_HASH         是否使用改进的字符类型HASH算法                         1        否
ELOG_PATH           指定初始化过程中生成的日志文件所在路径
                                /home/test/sym/trunc/build/linux/linux_build/log/     否
AP_PORT_NUM        分布式环境下协同工作的监听端口                   0        否
HUGE_WITH_DELTA         是否仅支持创建事务型HUGE表 1:是 0:否        1            否
RLOG_GEN_FOR_HUGE       是否生成HUGE表REDO日志 1:是 0:否           1            否
PSEG_MGR_FLAG           是否仅使用管理段记录事务信息 1:是 0:否       0            否
CHAR_FIX_STORAGE       CHAR是否按定长存储，可选值：Y/N，1/0          N           否
SQL_LOG_FORBID          是否禁止打开SQL日志，可选值：Y/N，1/0        N           否
DPC_MODE    指定DPC集群中的实例角色 0:无 1:MP 2:BP 3:SP，取值1/2/3时也可以MP/BP/S代替
                                                                           0           否
USE_DB_NAME           路径是否拼接DB_NAME 1:是 0:否                  1            否
MAIN_DBF_PATH         MAIN数据文件存放路径                       PATH/DB_NAME     否
SYSTEM_DBF_PATH       SYSTEM数据文件存放路径                     PATH/DB_NAME     否
ROLL_DBF_PATH         ROLL数据文件存放路径                       PATH/DB_NAME     否
TEMP_DBF_PATH               TEMP数据文件存放路径           PATH/DB_NAME           否
RANDOM_CRYPTO               随机数算法所在加密引擎名        无                      否
AUTO_ADJ_PARA               是否开启INI参数自动调优 0:否 1:是       1               否
AUTO_ADJ_CPUS               指定数据库可用CPU核数进行INI参数自动调优，AUTO_ADJ_PARA打开才生效 可选值：0~64，0:默认使用当前机器所有核         0                     否
AUTO_ADJ_MEM                指定数据库可用内存大小进行INI参数自动调优，AUTO_ADJ_PARA打开才生效 单位：MB，0:默认使用当前机器80%的内存        0                    否
PAGE_CHKSUM_POLICY         是否对于数据页的每一个4K块生成校验码 0:否 1:是     1      否
HELP                        打印帮助信息                                  无      否
-------------------------------------------------------------------------------
```

建库完成后，在 DM 服务器运行期间，可以通过查询 `V$DM_INI` 动态视图查看建库参数的具体信息。
