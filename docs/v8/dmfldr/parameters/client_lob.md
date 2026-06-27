---
title: CLIENT_LOB
---

指明 `LOB_DIRECTORY` 表示的目录是否是客户端本地目录，布尔类型，缺省值为 `FALSE`。`CLIENT_LOB` 仅在 `MODE` 为 `IN` 且 `DIRECT` 为 `TRUE` 时有效，指明在载入大字段对象数据时，`LOB_DIRECTORY` 参数指定的目录是否是客户端本地目录。若为 `TRUE`，表示目录为客户端本地目录，且此时待载入的大字段长度不得超过 2G，否则无法成功载入大字段；若为 `FALSE`，表示目录为达梦数据库服务器主库所在机器上的目录。
