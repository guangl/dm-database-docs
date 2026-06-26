---
title: 应用实例
---

# 应用实例

## 例 1：校验指定范围的索引

```bash
./dmdbchk PATH=/home/test/dmdbms/dm.ini START_INDEXID=33554433 END_INDEXID=33555531
```

报告示例输出：

```
[2015-12-31 16:57:29] dmdbchk V7.1.5.42-Build(2015.12.30-64335trunc)
[2015-12-31 16:57:30] DM DB CHECK START......
[2015-12-31 16:57:30] --------check dbf file size start---------
[2015-12-31 16:57:30] FILE=(ts_id=0, fil_id=0, path=D:\xx\DAMENG\SYSTEM.DBF)
[2015-12-31 16:57:30] FILE=(ts_id=1, fil_id=0, path=D:\xx\DAMENG\ROLL.DBF)
...
[2015-12-31 16:57:30] --------check indexes start---------------
[2015-12-31 16:57:30] INDEX=(id=33554433, name=SYSINDEXCOLUMNS, table_name=SYSCOLUMNS)
...
[2015-12-31 16:57:30] --------check iid start-------------------
[2015-12-31 16:57:30] DM DB CHECK END......
[2015-12-31 16:57:30] error count is 0
```

## 例 2：检测 Linux 系统信号量

```bash
./dmdbchk CHECK_SEMA=1
```

检测信号量使用情况，报告包含信号量 ID、状态及操作时间信息。

## 例 3：删除残留信号量

```bash
./dmdbchk CHECK_SEMA=2
```

检测并删除 Linux 系统中的残留信号量。报告示例：

```
[2018-11-05 14:54:47] get semid 40992768(key:0xcc020ab4) current value:0, delete it success!
[2018-11-05 14:54:47] total_cnt:3, active_cnt:0, need_del:3, real_del:3, del_err_cnt:0!
```

## 例 4：检测指定的数据页

```bash
./dmdbchk PATH=E:\break13\DAMENG\dm.ini PAGES_FILE=E:\break13\DAMENG\pages.txt
```

pages.txt 内容：

```
#需要校验的所有页号
page(5, 0, 49)
page(5, 0, 50)
page(5, 0, 51)
page(5, 0, 52)
page(500, 0, 52)
page(5, 0, 30), page(5, 0, 31), page(5, 0, 32)
```

报告输出示例：

```
[2024-12-27 14:28:42]dmdbchk V8
[2024-12-27 14:28:43]--------check pages file start---------
[2024-12-27 14:28:43][CHK] dbchk check_one_page error. page(5, 0, 49) data check error
[2024-12-27 14:28:43][CHK] dbchk check_one_page error. page(5, 0, 50) data check error
[2024-12-27 14:28:43][FAILED] fsm_check_page_validate page(500, 0, 52) is invalidate
[2024-12-27 14:28:43]--------check single dbf file end-----------
[2024-12-27 14:28:43]DM DB CHECK END......
[2024-12-27 14:28:43]
    Checked Files Total:        0
    Checked Indexes Total:      0
        Error Indexes Total:    0
    Checked Pages Total:        8
        Corrupted Pages Total:  0
        Data Error Pages Total: 3
        Invalidate Pages Total: 3
```
