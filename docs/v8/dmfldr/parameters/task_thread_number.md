---
title: TASK_THREAD_NUMBER
---

指定 dmfldr 在数据载入时处理用户数据的线程数目，整数类型，取值范围为 1~128。默认情况下，dmfldr 将该参数值设为系统 CPU 的个数，但无论设定值是多少，dmfldr 至少会创建 2 个任务线程。在多核 CPU 环境下，增大 `TASK_THREAD_NUMBER` 值可以提升 dmfldr 装载性能。

:::tip 注意
在导出模式下，当 `TASK_THREAD_NUMBER` 设置为大于 16 而小于 128 时，dmfldr 不会报错，但会将 `TASK_THREAD_NUMBER` 自动置为 16。
:::
