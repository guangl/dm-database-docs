---
title: AUTO_ADJ_CPUS
---

指定数据库可用 CPU 核数进行 INI 参数自动调优，AUTO_ADJ_PARA 打开才生效。取值范围 0~64，缺省值为 0，默认根据当前所有 CPU 对于相关 INI 进行调优。可选参数。

CPU 相关的优化参数有：WORKER_THREADS、IO_THR_GROUPS、TASK_THREADS。

**表4.1 CPU核数相关INI调整策略表**

| CPU 核数 | <=8 | >8, <=64 | >64 |
| --- | --- | --- | --- |
| WORKER_THREADS | CPU 核数 | CPU 核数 | 64 |
| IO_THR_GROUPS | 8 | 16 | 32 |
| TASK_THREADS | 8 | 16 | 32 |
