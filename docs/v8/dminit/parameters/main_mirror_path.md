---
title: MAIN_MIRROR_PATH
---

指定 main.dbf 文件的镜像绝对路径。默认为空。可选参数。

当 PAGE_CHECK 非 0 时，此参数才有意义。

此参数在数据库创建成功后无法修改，可通过查询 V$DATAFILE 的 MIRROR_PATH 列查看此参数的设置值。
