---
title: PAGE_ENC_SLICE_SIZE
---

使用数据页按扇区大小进行分片加解密时，指定数据页加解密的分片大小。可配置大小取值范围为 0、512 或 4096，单位为 byte，缺省值为 4096。其中，0 表示不按分片进行加解密，即按照页大小进行加解密, 后续查询参数时, 将显示为页大小。可选参数。

此参数在数据库创建成功后无法修改，可通过查询 V$PARAMETER 或 V$DM_INI 中的 PAGE_ENC_SLICE_SIZE 参数名查看此参数的设置值，还可以通过使用系统函数获取此参数的设置值：select SF_GET_PARA_VALUE(2,'PAGE_ENC_SLICE_SIZE');。
