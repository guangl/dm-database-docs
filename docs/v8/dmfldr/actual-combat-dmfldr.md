---
title: dmfldr 实战
---

# dmfldr 实战

本章介绍如何通过设置不同参数值使用 dmfldr 进行不同情况的数据装载，包括如何通过设置参数提高 dmfldr 的性能以及使用限制。所有操作以 Linux 操作系统为例，Windows 系统在目录分隔符与单引号转义处理上有区别。

## dmfldr 控制文件

控制文件 `CONTROL` 是启动 dmfldr 的必需参数，用于指定数据文件中数据的格式。控制文件的语法主要包含 `OPTIONS`、`LOAD DATA`、`INFILE`、`BADFILE`、`APPEND/REPLACE/INSERT` 等选项，具体包括：

- 行分隔符处理（Windows 默认 `0x0D0A`，非 Windows 默认 `0x0A`）；
- 列分隔符和封闭符设置；
- 单文件（file_option）与文件夹（directory_option）指定；
- LIST 选项用于存储多个数据文件路径；
- APPEND/REPLACE/INSERT 模式的含义；
- OPTIONS 中可指定的参数；
- 列定义选项（position、dtype_option、fmt_option 等）。

**例 1** 完整的 dmfldr 控制文件。

```
OPTIONS
(
	SKIP = 0
	ROWS = 50000
	DIRECT = TRUE
	INDEX_OPTION = 2
)
LOAD DATA
INFILE '/opt/data/test1.txt' STR X '0A'
BADFILE '/opt/data/test1.bad'
INTO TABLE test1
FIELDS '|'
(
F1,
F2 DATE FORMAT 'YYYY-MM-DD',
F3 NULL,
F4 TERMINATED BY WHITESPACE ENCLOSE BY '(',
F5 CONSTANT "test",
F6 "trim()"
)

LOAD DATA
INFILE '/opt/data/test2.txt' STR X '0A'
BADFILE '/opt/data/test2.bad'
INTO TABLE test2
FIELDS '|'
(
C1 TERMINATED BY ' ',
C2,
C3 "sysdate",
C4 "substr(:C2,1,2)"
)
```

**例 2** 使用自定义列函数（`DIRECT = FALSE`）。

```
LOAD DATA
INFILE 't1.dta'
INTO TABLE T1
FIELDS '|'
(
C1 "F2(:C1, F1(F1(:C2)), :C3)",
C2 ,
C3 "F3(F1(:C2), F1(:C3), F2(:C1, F1(:c2), :C3))"
)
```

## 装载 CSV 文件

CSV 文件本质上是以英文逗号 `,` 作为列分隔符、首行为列名的文本文件，字段中如包含逗号需要用引号括起。装载 CSV 文件时，可在控制文件中将列分隔符 `FIELDS` 指定为 `,`，用 `SKIP` 跳过首行表头，并对含逗号的字段使用 `ENCLOSE BY '"'` 指定封闭符。

建表：

```sql
DROP TABLE CSV_TEST;
CREATE TABLE CSV_TEST(ID INT, NAME VARCHAR(50), REMARK VARCHAR(100));
```

CSV 数据文件 `csv_test.csv`（首行为表头，`REMARK` 列中含逗号的内容用双引号括起）：

```
id,name,remark
1,Alice,"Sales, North"
2,Bob,"Engineering, Core"
3,Carol,"HR, Recruiting"
```

控制文件 `csv_test.ctl`：

```
LOAD DATA
INFILE '/opt/data/csv_test.csv'
INTO TABLE csv_test
SKIP 1
FIELDS ','
(
ID,
NAME,
REMARK ENCLOSE BY '"'
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/csv_test.ctl'
```

将表中的数据导出为带表头的 CSV 文件，只需将 `MODE` 改为 `OUT`，并加上 `COLNAME_HEADING=TRUE` 在导出文件首行写入列名：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/csv_test.ctl' mode='out' colname_heading=true
```

## 指定数据文件

指定数据文件有三种方式：在控制文件中指定、使用 `DATA` 参数指定、在 dmfldr.ini 配置文件中指定。

**例 1** 在控制文件中直接指定文件路径。

建表：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 INT,C3 DATE);
```

数据文件 `test.txt`：

```
1 1|2015-11-06
2 2|2015-11-05
3 3|2015-11-04
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1 TERMINATED BY ' ',
C2,
C3 DATE FORMAT 'yyyy-mm-dd'
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl'
```

**例 2** 使用 `DATA` 参数，并在控制文件中以通配符 `*` 代替具体路径，由命令行的 `DATA` 参数提供实际数据文件路径。

控制文件 `test.ctl` 中将 `INFILE` 指定为 `*`：

```
LOAD DATA
INFILE *
INTO TABLE test
FIELDS '|'
(
C1 TERMINATED BY ' ',
C2,
C3 DATE FORMAT 'yyyy-mm-dd'
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' data='/opt/data/test.txt'
```

## 数据转换与错误数据文件

dmfldr 对文本文件中字符串进行数据类型转换，支持所有达梦数据库列定义类型。常见出错情况包括编码转换失败、数据长度超限、数值出现非法字符、日期格式错误等。

`BADFILE` 参数设置错误文件路径，默认为 `fldr.bad`。`ERRORS` 参数设置最大容错个数（取值范围 0~4294967295，默认 100）。出现转换错误的数据行会被写入 `BADFILE` 指定的错误文件。

**例** 数据文件中第 4 行日期格式错误，导致该行被写入错误文件。

数据文件 `test.txt`：

```
1 1|2015-11-06
2 2|2015-11-05
3 3|2015-11-04
4 4|aaaa-bbb-ccc
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' badfile='/opt/data/test.bad'
```

错误文件 `test.bad` 内容：

```
dmfldr: 2015-11-09 16:56:52 SYSDBA->TEST 4|4 aaaa-bbb-ccc
```

## 服务器端错误数据处理

dmfldr 客户端向服务器发送数据时，服务器端在遇到约束冲突等情况时会回滚整批数据并记为错误，但不会记录到 `BADFILE` 中。`ERRORS` 统计的错误数包括客户端转换错误和服务器插入错误两部分。

## 大字段数据处理

### 大字段数据的导出

支持 TEXT、LONGVARCHAR、IMAGE、LONGVARBINARY、BLOB、CLOB 等类型的大字段导出。`LOB_FILE_NAME` 参数指定大字段文件名（默认 `dmfldr.lob`），`LOB_DIRECTORY` 指定存放目录。

建表并插入数据：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 BLOB,C3 CLOB);
INSERT INTO TEST VALUES(1,0XAB121032DE,'abcdefg');
INSERT INTO TEST VALUES(2,0XAB121032DE,'abcdefg');
COMMIT;
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2,
C3
)
```

导出命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' LOB_DIRECTORY='/opt/data/' mode='out'
```

### `DIRECT` 为 `TRUE` 时大字段数据的载入

当 `CLIENT_LOB` 为 `TRUE` 时，`LOB_DIRECTORY` 指向客户端本地目录，且待载入的大字段长度不得超过 2G；当 `CLIENT_LOB` 为 `FALSE` 时，大字段文件需要先传送到服务器主库所在机器上。大字段在数据文件中以"文件名：起始偏移：长度"的形式记录。

数据文件 `test.txt`：

```
1|testblob.txt:0:10|testclob.txt:0:10
2|testblob.txt:10:20|testclob.txt:10:20
3|testblob.txt:20:30|testclob.txt:20:30
```

**例 1** `CLIENT_LOB = TRUE`（大字段文件位于客户端本地目录）。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' LOB_DIRECTORY='/opt/data/' CLIENT_LOB=TRUE
```

**例 2** `CLIENT_LOB = FALSE`（大字段文件已传送到服务器主库所在机器）。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@192.168.100.122:5236 control='/opt/data/test.ctl' LOB_DIRECTORY='/opt/data/fldr/' CLIENT_LOB=FALSE
```

### `DIRECT` 为 `FALSE` 时大字段数据的载入

大字段数据直接存储在数据文件中，长度不超过 256KB。`BLOB_TYPE` 参数设置 BLOB 列内容为十六进制（`HEX`）或十六进制字符（`HEX_CHAR`），仅在 `DIRECT = FALSE` 时有效，默认为 `HEX_CHAR`。

数据文件 `test.txt`：

```
1|0x12d3c8a7|abcdefg
2|0x12a4cbac|hijlkmn
3|0x22d3c8b3|adefhjd
```

**例 1** `BLOB_TYPE = HEX_CHAR`。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' direct=false blob_type='hex_char'
```

**例 2** `BLOB_TYPE = HEX`。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' direct=false blob_type='hex'
```

## 日志文件及日志信息

`LOG` 参数设置日志文件路径，默认文件名为 `fldr.log`，存放于达梦数据库执行码目录同级的 `log` 目录下。日志文件记录装载过程中的工作信息、错误信息以及统计信息。

数据文件 `test.txt`：

```
1|1 2018-11-06
2|2 2018-11-05
3|3 2018-11-04
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2 TERMINATED BY ' ',
C3 DATE FORMAT 'yyyy-mm-dd'
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' log='/opt/data/test.log'
```

## 自增列装载

`DIRECT = FALSE` 时，dmfldr 将数据文件中的自增列值作为目标值插入。

`DIRECT = TRUE` 时，`SET_IDENTITY` 参数（缺省 `FALSE`）控制处理方式：

- `TRUE`：直接使用数据文件中的自增列值；
- `FALSE`：忽略数据文件中的自增列值，由服务器根据列定义自动生成。

建表并插入初始数据：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT IDENTITY(1,1),C2 VARCHAR);
INSERT INTO TEST(C2) VALUES('AAA');
INSERT INTO TEST(C2) VALUES('BBB');
COMMIT;
```

数据文件 `test.txt`：

```
2|aaa
3|bbb
4|ccc
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2
)
```

**例 1** `SET_IDENTITY = FALSE`，忽略数据文件中的自增列值，由服务器自动生成。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' direct=true set_identity=false
```

**例 2** `SET_IDENTITY = TRUE`，直接使用数据文件中的自增列值。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' direct=true set_identity=true
```

## 数据排序

`SORTED` 参数设置数据是否已按聚集索引排序（缺省 `FALSE`）。设置为 `TRUE` 时，用户必须保证数据已排序，且新装载数据的索引值要大于表中现有数据的索引值，服务器将按顺序进行插入。仅在 `MODE` 为 `IN` 且 `DIRECT` 为 `TRUE` 时有效。

建表：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT CLUSTER PRIMARY KEY,C2 VARCHAR);
```

数据文件 `test.txt`：

```
2|aaa
3|bbb
4|ccc
5|ddd
1|zzz
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' sorted=true
```

## 空值处理

`NULL_MODE` 参数控制空值处理方式：

- `TRUE`：载入时 NULL 字符串处理为 NULL，导出时空值处理为 NULL 字符串；
- `FALSE`：载入时 NULL 字符串处理为字符串，导出时空值处理为空串。

建表：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 VARCHAR);
```

数据文件 `test.txt`：

```
1|aaa
2|NULL
3|null
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2
)
```

**例 1** `NULL_MODE = TRUE`。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' null_mode=true
```

**例 2** `NULL_MODE = FALSE`。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' null_mode=false
```

## 类类型装载

支持 CLASS 类型数据装载，需指定 `ENABLE_CLASS_TYPE = TRUE`，并通过 `LOB_DIRECTORY` 指定大字段文件目录。装载流程一般为：创建类头/类体、导出类类型数据、再使用 dmfldr 导入数据。

创建类与表，并插入数据：

```sql
CREATE CLASS mycls
AS
TYPE rec_type IS RECORD (c1 INT, c2 INT);
id INT;
r rec_type;
FUNCTION f1(a INT, b INT) RETURN rec_type;
FUNCTION mycls(id INT , r_c1 INT, r_c2 INT) RETURN mycls;
END;
/

CREATE OR REPLACE CLASS BODY mycls
AS
FUNCTION f1(a INT, b INT) RETURN rec_type
AS
BEGIN
	r.c1 = a;
	r.c2 = b;
	RETURN r;
END;
FUNCTION mycls(id INT, r_c1 INT, r_c2 INT) RETURN mycls
AS
BEGIN
	this.id = id;
	r.c1 = r_c1;
	r.c2 = r_c2;
	RETURN this;
END;
END;
/

DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 mycls);
INSERT INTO TEST VALUES(1,mycls(1,1,1));
INSERT INTO TEST VALUES(2,mycls(2,2,2));
COMMIT;
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2
)
```

导出命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' mode='out' lob_directory='/opt/data'
```

将导出的大字段数据装载进另一张同样使用 `mycls` 类型的表 `test2`：

```sql
CREATE TABLE TEST2(C1 MYCLS,C2 MYCLS);
```

数据文件 `test2.txt`：

```
dmfldr.lob:70:70|dmfldr.lob:0:70
dmfldr.lob:0:70|dmfldr.lob:70:70
```

控制文件 `test2.ctl`：

```
LOAD DATA
INFILE '/opt/data/test2.txt'
INTO TABLE test2
FIELDS '|'
(
C1,
C2
)
```

导入命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test2.ctl' lob_directory='/opt/data/' enable_class_type=true
```

## 条件过滤

通过控制文件中的 `WHEN <field_conditions>` 子句进行数据过滤。支持的比较操作符包括 `=`、`!=`、`<>`，并可通过 AND 连接多个条件。条件中可使用 `BLANKS/WHITESPACE` 表示空格，使用 `(p1:p2)` 表示位置范围。

建表：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 INT);
```

数据文件 `test.txt`：

```
12
23
32
48
91
```

控制文件 `test.ctl`，过滤掉第一列为 `2` 的数据行：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
WHEN C1 != '2'
(
C1 position (1:1),
C2 position (2:2)
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl'
```

## 多表装载

在单个控制文件中指定多个 `INTO TABLE` 子句，可以同时向多个表装载数据。需要注意：第二个及之后的 `INTO TABLE` 子句中所有列必须指定 `POSITION` 选项；不支持目标表相同或拥有相同主表的情况。

建表：

```sql
DROP TABLE TEST1;
DROP TABLE TEST2;
CREATE TABLE TEST1(C1 INT,C2 INT);
CREATE TABLE TEST2(C1 INT,C2 INT);
```

数据文件 `test.txt`：

```
1,2
2,3
3,2
4,8
9,1
```

控制文件 `test.ctl`，将同一份数据按不同条件分别装载进 `test1`、`test2`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test1
WHEN C1 != '1'
FIELDS ','
(
c1 position (1:1),
c2 position (3:3)
)
INTO TABLE test2
WHEN (3:3) = '2' AND c1 != '3'
FIELDS ','
(
c1 position (1:1),
c2 position (3:3)
)
```

命令：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl'
```

## 个性化设置

- `SKIP`：跳过数据文件起始的逻辑行数（默认 0）；
- `LOAD`：装载的最大行数（默认装载文件中的所有行）；
- `ROWS`：每次提交的行数（默认 50000）。

建表：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 VARCHAR);
```

数据文件 `test.txt`（共 10 行）：

```
1|aaa
2|bbb
3|ccc
4|ddd
5|eee
6|fff
7|ggg
8|hhh
9|iii
10|jjj
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2
)
```

命令：跳过前 3 行，最多装载 5 行。

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' skip=3 load=5
```

合理设置以上参数可以满足分批装载、跳过表头等多种实际场景的需求。

## 主备切换时的数据继续载入

在达梦数据库守护主备环境下，dmfldr 支持主备切换后自动继续装载。`USERID` 需使用主备服务名方式配置，并在 `dm_svc.conf` 中配置好对应的服务名。

`dm_svc.conf` 配置示例：

```
dw=(192.168.0.101:5236, 192.168.0.102:5236)
```

启动命令，`USERID` 中使用服务名 `dw` 代替具体的 `host:port`：

```
dmfldr USERID=SYSDBA/Dmsys_123@dw CONTROL='c:\fldr.ctl'
```

限制：仅支持单机主备（不支持 MPP 主备），不支持分区表装载。

## MPP 本地分发

`MPP_CLIENT` 参数设置数据分发方式（仅在 MPP 环境下有效）：

- `TRUE`：客户端分发模式，数据在客户端分发好后直接发往指定站点；
- `FALSE`：本地分发模式，dmfldr 客户端将数据全部发往所连接的 MPP `EP` 站点。

建表：

```sql
DROP TABLE TEST;
CREATE TABLE TEST(C1 INT,C2 INT);
```

数据文件 `test.txt`：

```
1|1
2|2
3|3
4|4
5|5
6|6
7|7
8|8
9|9
10|10
```

控制文件 `test.ctl`：

```
LOAD DATA
INFILE '/opt/data/test.txt'
INTO TABLE test
FIELDS '|'
(
C1,
C2
)
```

命令，设置 `MPP_CLIENT = FALSE` 使用本地分发模式：

```bash
./dmfldr userid=SYSDBA/Dmsys_123@localhost:5236 control='/opt/data/test.ctl' mpp_client=false
```

装载完成后，可通过 `SF_GET_EP_SEQNO` 查询指定节点上的数据，例如查询站点号为 0 的节点数据：

```sql
SELECT * FROM TEST WHERE SF_GET_EP_SEQNO(ROWID)=0;
```

## 提升 dmfldr 性能

可以通过以下参数优化 dmfldr 的装载/导出性能：

- `BUFFER_NODE_SIZE`：读取文件缓冲区页大小；
- `READ_ROWS`：限制单次处理的最大行数；
- `SEND_NODE_NUMBER`：发送节点的个数；
- `TASK_THREAD_NUMBER`：处理用户数据的线程数（默认等于 CPU 个数）；
- `BLDR_NUM`：水平分区表装载时服务器 BLDR 的最大个数（默认 64）；
- `BDTA_SIZE`：批量数据处理的批大小（默认 5000）；
- `INDEX_OPTION`：二级索引的处理方式（1/2/3，默认 1）。

用户应结合自身硬件资源（CPU、内存、网络带宽）综合调整以上参数，以达到最优的装载/导出性能。

## dmfldr 使用限制

- 不支持临时表、外部表、系统表的装载；
- 不支持位图索引、全文索引表的装载；
- 不支持向 DCP 代理进行装载；
- DPC 环境下不支持全局索引表的装载；
- 仅支持 `INDEX_OPTION = 2` 情况下的函数索引表装载。

dmfldr 在装载数据时对各类约束的处理方式如下：

| 约束 | 数据不满足时 | 数据插入与否 | 约束是否有效 |
| --- | --- | --- | --- |
| 非空约束（NOT NULL） | 报错 | 不插入 | 有效 |
| 聚集索引（CLUSTER PRIMARY KEY） | 报错 | 不插入 | 有效 |
| 唯一约束（UNIQUE、PRIMARY KEY） | 不报错 | 插入 | 有效 |
| 引用约束（FOREIGN KEY） | 不报错 | 插入 | 有效 |
| CHECK 约束（CHECK） | 不报错 | 插入 | 有效 |

使用前应结合实际表结构和约束情况进行充分测试。
