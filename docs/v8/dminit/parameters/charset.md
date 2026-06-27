---
title: CHARSET/UNICODE_FLAG
---

字符集选项，可选参数。

- `0`：GB18030，支持 GB18030-2022 版本；
- `1`：UTF-8，支持 UNICODE 12.0 版本；
- `2`：韩文字符集 EUC-KR。

缺省值为 `0`。

此参数在数据库创建成功后无法修改，可通过系统函数 `SF_GET_UNICODE_FLAG()` 或 `UNICODE()` 查询设置的参数值。
