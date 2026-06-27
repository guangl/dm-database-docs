---
title: AUTO_ADJ_MEM
---

指定数据库可用内存大小进行 INI 参数自动调优，AUTO_ADJ_PARA 打开才生效。最大取值为 8 位整数，单位：MB，缺省值为 0，默认使用当前机器 80% 的内存对于相关 INI 进行调优。可选参数。

内存相关的优化参数有：MEMORY_POOL、MEMORY_N_POOLS、MEMORY_TARGET、BUFFER、BUFFER_POOLS、RECYCLE、RECYCLE_POOLS、HJ_BUF_GLOBAL_SIZE、HJ_BUF_SIZE、HAGR_BUF_GLOBAL_SIZE、HAGR_BUF_SIZE、SORT_FLAG、SORT_BLK_SIZE、SORT_BUF_SIZE、SORT_BUF_GLOBAL_SIZE、RLOG_POOL_SIZE、CACHE_POOL_SIZE、DICT_BUF_SIZE、VM_POOL_TARGET、SESS_POOL_TARGET、MAX_SESSIONS。

请注意若指定或默认内存小于 4G，则不会进行内存相关参数调优，使用默认参数；若指定内存大于实际内存会输出警告，建库会成功，可能因 INI 参数优化导致未知问题，请谨慎设置此建库参数。当指定或默认内存值大于等于 4G 时，内存相关参数调整会根据指定或默认参数的 80% 为基准，按其一定比例和总大小进行优化，内存相关参数调整策略较复杂，具体请咨询达梦技术服务人员。
