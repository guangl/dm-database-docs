---
title: BDTA_SIZE
---

BDTA（Batch DaTA）的大小，整数类型，取值范围为 100~10000，缺省为 5000。BDTA 代表达梦数据库批量数据处理机制中一个批量，在内存、CPU 允许的条件下，增大 `BDTA_SIZE` 能加快装载速度；在网络是装载性能瓶颈时，增大 `BDTA_SIZE` 影响不大。此参数为可选参数，作用于 `MODE` 为 `IN` 的情况下，当 `MODE` 为 `OUT` 时无效。
