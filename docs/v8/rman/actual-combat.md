---
title: dmrman 实战
---

# dmrman 实战

本章以几个完整场景演示如何使用 dmrman 完成脱机备份与还原恢复，覆盖全库备份还原、增量备份链的建立与合并、表空间级还原恢复、归档备份还原与归档修复，以及加密压缩备份。各场景均假定数据库已正常关闭（脱机备份还原的前提条件），命令行交互均在 dmrman 的 `RMAN>` 提示符下完成；命令语法和参数细节请参考 [命令参考](./commands/index) 中对应的命令页面，本章不再重复列出完整语法。

## 全库脱机备份与还原恢复全流程

假设生产库路径为 `/opt/dmdbms/data/DAMENG/dm.ini`，需要对其做一次完全的脱机备份，并在另一台机器（或同一台机器的另一目录）上还原出一份可用的库，验证备份的可用性。

第一步，确保源库已经停止：

```bash
./DmServiceDAMENG stop
```

第二步，启动 dmrman 并执行全库备份：

```plaintext
$ ./dmrman
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' BACKUPSET '/home/dm_bak/db_full_20240601';
...
backup successfully!
```

备份完成后，建议先对备份集做一次校验，确认备份集完整可用，再继续后续操作：

```plaintext
RMAN>CHECK BACKUPSET '/home/dm_bak/db_full_20240601';
```

第三步，准备还原目标库。可以是一个已存在但已损坏的库目录，也可以用 dminit 新建一个空库占位：

```bash
./dminit path=/opt/dmdbms/data db_name=DAMENG_RESTORE sysdba_pwd=DMdba_123 sysauditor_pwd=DMauditor_123
```

第四步，执行还原，将备份集中的数据文件和配置文件还原到目标库：

```plaintext
RMAN>RESTORE DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' FROM BACKUPSET '/home/dm_bak/db_full_20240601';
```

此时数据库已经有了完整的数据文件，但还处于不一致状态，不能直接启动。第五步执行恢复，重做备份集中保存的 REDO 日志，使数据库达到备份结束时刻的一致状态：

```plaintext
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' FROM BACKUPSET '/home/dm_bak/db_full_20240601';
```

如果源库备份时使用了 `WITHOUT LOG`（不备份 REDO 日志），或者希望恢复到比备份结束点更新的状态（即备份之后产生的归档也要应用上），则改为从归档恢复，前提是源库归档完整：

```plaintext
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' WITH ARCHIVEDIR '/opt/dmdbms/data/DAMENG/arch';
```

第六步，无论采用哪种恢复方式，都需要执行数据库更新，将库调整为可正常工作的状态：

```plaintext
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' UPDATE DB_MAGIC;
RMAN>exit
```

最后启动还原出的数据库，验证是否能正常打开并提供服务：

```bash
./dmserver /opt/dmdbms/data/DAMENG_RESTORE/dm.ini
```

数据库正常启动且能够正常连接、查询数据，即说明本次全库脱机备份还原流程验证通过。整个流程的核心顺序是：停库 → `BACKUP DATABASE` → `RESTORE DATABASE` → `RECOVER DATABASE`（从备份集或从归档）→ `RECOVER DATABASE ... UPDATE DB_MAGIC` → 启动数据库，详见 [BACKUP DATABASE](./commands/backup-database)、[RESTORE DATABASE](./commands/restore-database)、[RECOVER DATABASE](./commands/recover-database)。

## 增量备份链的建立与合并还原

全量备份的还原速度最快，但每次全量备份占用的存储和时间都较多；纯粹依赖增量链逐级还原，则在链路过长时还原耗时会显著增加。生产环境常见的做法是按周做一次完全备份，每天做一次增量备份，发生故障时优先用最近的完全备份加上当天的增量直接还原；同时，为了进一步缩短恢复窗口，也可以参考 [MERGE DATABASE](./commands/merge-database) 的思路，把增量备份周期性地预先合并到一个备用库中。

以源库 `/opt/dmdbms/data/DAMENG/dm.ini`、归档目录 `/opt/dmdbms/data/DAMENG/arch` 为例，建立每周一次全备、每天一次增量的备份链：

```plaintext
-- 周日凌晨：完全备份
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' FULL BACKUPSET '/home/dm_bak/db_full_sun';

-- 周一至周六凌晨：在完全备份基础上做增量备份，基备份不在默认搜索目录时需要显式指定
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' INCREMENT WITH BACKUPDIR '/home/dm_bak' BACKUPSET '/home/dm_bak/db_incr_mon';
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' INCREMENT WITH BACKUPDIR '/home/dm_bak' BACKUPSET '/home/dm_bak/db_incr_tue';
```

依此类推，每天生成一个新的增量备份集，且都以前一天（或周日的完全备份）为基备份。也可以提前用 `CONFIGURE DEFAULT BACKUPDIR ADD '/home/dm_bak'` 配置好默认搜索目录，省去每次手工指定 `WITH BACKUPDIR`。

发生故障需要还原时，只需要用最新的增量备份集执行还原即可，dmrman 会自动沿着基备份链逐级回溯：

```plaintext
RMAN>RESTORE DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' FROM BACKUPSET '/home/dm_bak/db_incr_tue' WITH BACKUPDIR '/home/dm_bak';
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' FROM BACKUPSET '/home/dm_bak/db_incr_tue' WITH BACKUPDIR '/home/dm_bak';
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' UPDATE DB_MAGIC;
```

如果链路较长（例如已经积累了一周的增量），逐级还原耗时会增加。此时可以采用周期性合并的方案：预先用完全备份还原出一个常驻的合并目标库，并保持其处于"已还原、未恢复"的状态，之后每天用当天新生成的增量备份集对其执行 `MERGE`，而不进行恢复：

```plaintext
RMAN>RESTORE DATABASE TO '/opt/dmdbms/data/db_for_merge' FROM BACKUPSET '/home/dm_bak/db_full_sun';
RMAN>MERGE DATABASE '/opt/dmdbms/data/db_for_merge/dm.ini' FROM BACKUPSET '/home/dm_bak/db_incr_mon';
RMAN>MERGE DATABASE '/opt/dmdbms/data/db_for_merge/dm.ini' FROM BACKUPSET '/home/dm_bak/db_incr_tue';
```

一旦源库故障，合并目标库已经包含了截至最近一次合并的所有数据变化，只需重演故障前最后一小段时间窗口内的归档日志，即可将其恢复到接近最新的状态，再更新数据库魔数完成恢复：

```plaintext
RMAN>RECOVER DATABASE '/opt/dmdbms/data/db_for_merge/dm.ini' WITH ARCHIVEDIR '/opt/dmdbms/data/DAMENG/arch';
RMAN>RECOVER DATABASE '/opt/dmdbms/data/db_for_merge/dm.ini' UPDATE DB_MAGIC;
```

注意用于定期合并的增量备份集不能是累积增量（`CUMULATIVE`）备份集，否则合并时基备份范围可能不满足要求；累积增量备份集只能直接用于常规的 `RESTORE` + `RECOVER` 还原，不能进入合并流程。完整的参数说明和限制参见 [MERGE DATABASE](./commands/merge-database)。

## 表空间脱机还原恢复

实际运维中，故障往往不会波及整个数据库，更常见的情况是某个表空间的数据文件因磁盘损坏、误删除等原因丢失，而数据库其余部分（包括 `SYSTEM` 表空间）依然完好。这种情况下没有必要执行代价较高的库级还原，使用 dmrman 对受损表空间做单独的脱机还原恢复即可。

假设业务表空间 `MAIN` 的某个数据文件损坏，数据库其余部分正常。先确保数据库已停止运行：

```bash
./DmServiceDAMENG stop
```

如果此前已经对 `MAIN` 表空间做过脱机或联机的表空间级备份，可以直接使用该备份集还原；如果没有专门的表空间备份，也可以用一份库备份集中的对应表空间数据来还原。以一份此前生成的表空间备份集 `/home/dm_bak/ts_main_full` 为例：

```plaintext
$ ./dmrman
RMAN>CHECK BACKUPSET '/home/dm_bak/ts_main_full';
RMAN>RESTORE DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' TABLESPACE MAIN FROM BACKUPSET '/home/dm_bak/ts_main_full';
```

还原完成后，`MAIN` 表空间状态会被置为 `RES_OFFLINE`，表示数据文件已经重建但数据尚不完整，需要立即执行恢复，重做 REDO 日志使其恢复到一致状态：

```plaintext
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' TABLESPACE MAIN;
```

如果表空间备份时使用了 `WITHOUT LOG`，或者需要利用归档日志重演到故障发生前的最新状态，则改为指定归档目录恢复：

```plaintext
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' TABLESPACE MAIN WITH ARCHIVEDIR '/opt/dmdbms/data/DAMENG/arch';
RMAN>exit
```

恢复完成后，`MAIN` 表空间会被置为 `ONLINE` 状态。启动数据库，确认实例能正常打开，且该表空间下的表可以正常查询写入：

```bash
./dmserver /opt/dmdbms/data/DAMENG/dm.ini
```

表空间级还原恢复不需要重建整个数据库的其他文件，只针对受损表空间操作，因此恢复速度远快于库级还原。需要注意的是，`SYSTEM` 表空间一旦损坏不能使用表空间级还原，必须执行库级还原；处于 `RES_OFFLINE` 或 `CORRUPT` 状态的表空间也不允许只还原其中部分数据文件。详细约束参见 [RESTORE TABLESPACE](./commands/restore-tablespace) 和 [RECOVER TABLESPACE](./commands/recover-tablespace)。

## 归档备份与还原、归档修复实战

归档日志是数据库故障恢复链路中至关重要的一环：库备份集本身往往只覆盖到备份结束时刻，备份之后产生的所有数据变化都需要依赖归档日志才能重演恢复。下面演示一个组合场景：先对归档做一次备份，再模拟本地归档目录损坏需要还原归档，最后演示数据库异常退出导致归档不完整时如何先修复再继续操作。

### 场景一：归档备份与还原

假设源库 `/opt/dmdbms/data/DAMENG/dm.ini` 运行在归档模式下，先对归档日志做一次完整备份（归档备份要求数据库处于联机 `OPEN` 状态）：

```plaintext
SQL>BACKUP ARCHIVE LOG ALL BACKUPNAME ARCH_ALL_BAK_01 BACKUPSET '/home/dm_bak/arch_all_20240601';
```

校验归档备份集，再将其还原到另一台目标库的归档目录下，用于配合后续的库恢复：

```plaintext
$ ./dmrman
RMAN>CHECK BACKUPSET '/home/dm_bak/arch_all_20240601';
RMAN>RESTORE ARCHIVE LOG FROM BACKUPSET '/home/dm_bak/arch_all_20240601' TO DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' OVERWRITE 2;
```

还原完成后，目标库的归档目录中就有了完整的归档日志文件，可以直接配合 `RECOVER DATABASE ... WITH ARCHIVEDIR` 使用，将还原出的库恢复到比库备份结束点更新的状态。

### 场景二：归档修复

如果源库是异常退出（如断电、进程被强杀）而不是正常关闭，本地归档很可能存在缺失：联机日志中尚未刷入归档文件的那部分 REDO 日志会丢失，此时如果不先修复，直接备份或恢复都可能失败或恢复不到最新状态。

确认数据库已停止运行后，先执行归档修复：

```plaintext
RMAN>REPAIR ARCHIVELOG DATABASE '/opt/dmdbms/data/DAMENG/dm.ini';
```

归档修复会把联机日志中尚未归档的部分补齐到本地归档目录中，确保本地归档完整连续。修复完成后，才能正常执行脱机备份：

```plaintext
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' BACKUPSET '/home/dm_bak/db_full_after_repair';
```

如果归档修复的目的是为了配合还原恢复（还原目标库与故障库是同一个库），则修复完成后直接继续执行还原与恢复：

```plaintext
RMAN>RESTORE DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' FROM BACKUPSET '/home/dm_bak/db_full_after_repair';
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' WITH ARCHIVEDIR '/opt/dmdbms/data/DAMENG/arch';
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' UPDATE DB_MAGIC;
```

如果恢复过程中仍然报告归档不足，说明本地归档目录中缺失的归档日志已经无法通过修复补齐，需要设法从其他渠道（如备库的归档目录）找到对应 LSN 范围的归档日志，补齐到本地归档目录后再重新执行恢复。归档备份还原与归档修复的完整参数说明参见 [RESTORE ARCHIVE LOG](./commands/restore-archive-log) 和 [REPAIR ARCHIVE LOG](./commands/repair-archive)。

## 加密压缩备份示例

对于需要长期保存或异地传输的备份集，通常会同时启用加密和压缩：加密防止备份介质丢失导致数据泄露，压缩节省存储空间和传输带宽。

对源库 `/opt/dmdbms/data/DAMENG/dm.ini` 执行一次带密码、完全数据加密，并启用压缩的全库备份：

```plaintext
$ ./dmrman
RMAN>BACKUP DATABASE '/opt/dmdbms/data/DAMENG/dm.ini' BACKUPSET '/home/dm_bak/db_full_enc_comp'
IDENTIFIED BY "Dmbak_123" WITH ENCRYPTION 2 ENCRYPT WITH AES256_CFB COMPRESSED LEVEL 6;
...
backup successfully!
```

`IDENTIFIED BY` 设置备份口令，密码规则遵从 INI 参数 `PWD_POLICY` 和 `PWD_MIN_LEN`，建议用双引号括起避免特殊字符导致语法解析失败；`WITH ENCRYPTION 2` 表示对数据内容做完全加密（而非仅设置口令的简单加密）；`ENCRYPT WITH AES256_CFB` 指定加密算法（此为默认算法，可省略）；`COMPRESSED LEVEL 6` 在保证一定压缩速度的前提下获得较高的压缩比。

还原该备份集时，必须提供与备份时一致的密码和加密算法，否则还原会失败：

```plaintext
RMAN>CHECK BACKUPSET '/home/dm_bak/db_full_enc_comp' IDENTIFIED BY "Dmbak_123" ENCRYPT WITH AES256_CFB;
RMAN>RESTORE DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' FROM BACKUPSET '/home/dm_bak/db_full_enc_comp' IDENTIFIED BY "Dmbak_123" ENCRYPT WITH AES256_CFB;
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' FROM BACKUPSET '/home/dm_bak/db_full_enc_comp' IDENTIFIED BY "Dmbak_123" ENCRYPT WITH AES256_CFB;
RMAN>RECOVER DATABASE '/opt/dmdbms/data/DAMENG_RESTORE/dm.ini' UPDATE DB_MAGIC;
```

压缩和加密都会增加备份与还原过程中的 CPU 开销，压缩级别越高、加密强度越大，速度越慢。生产环境中应结合数据敏感程度、存储成本和备份窗口时长综合选择是否启用、以及具体的压缩级别。完整参数说明参见 [BACKUP DATABASE](./commands/backup-database)、[CHECK BACKUPSET](./commands/check-backupset) 和 [RESTORE DATABASE](./commands/restore-database)。
