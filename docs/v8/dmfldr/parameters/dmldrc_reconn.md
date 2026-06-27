---
title: RECONN（dmldrc）
---

指定自动重连次数，范围为 0~2147483647。缺省为 0，表示不进行自动重连。

与 dmfldr 不同的是，dmldrc 不支持断点重连，dmldrc 重连成功后总是重新装载全部数据。重连失败时根据 `COMMIT_OPTION` 采取相应的处理策略：若 `COMMIT_OPTION`=0，则未提交数据全部回滚；若 `COMMIT_OPTION`=1，则所有数据全部回滚。由于 dmldrc 最终重连成功时会重新装载全部数据，因此当 `COMMIT_OPTION`=0 时，如果发生重连，可能会出现数据重复装载的情况。
