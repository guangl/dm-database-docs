---
title: INI_FILE
---

初始化文件 dm.ini 存放的路径，指定一个已经存在的 dm.ini 文件所在的绝对路径。作用是将现有 INI 文件，拷贝到新库，作为新库的 INI 文件直接使用。文件路径长度最大为 256 个字符。可选参数。

如果不指定该参数，那么 dminit 工具会直接生成一个新的 dm.ini 文件。如果指定了该参数但指定的 INI 文件不存在，那么 dminit 工具会报错无效的 INI 文件，同时生成一个新的 dm.ini 文件。

例  指定现有/home/test/dmdbms 库中 dm.ini，给新创建的/home/dest/dmdbms 库使用。

```plaintext
./dminit INI_FILE=/home/test/dmdbms/DAMENG/dm.ini PATH=/home/dest/dmdbms SYSDBA_PWD=DMdba_123 SYSAUDITOR_PWD=DMauditor_123
```
