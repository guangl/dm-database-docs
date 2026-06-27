---
title: LOB_DIRECTORY
---

指明 dmfldr 使用的大字段数据存放的目录，字符串类型。

当 `MODE` 为 `OUT` 时，dmfldr 生成大字段对应的数据文件，文件名由 `LOB_FILE_NAME` 指定，并存放于 `LOB_DIRECTORY` 指定的目录，如果未指定 `LOB_DIRECTORY` 则存放于指定的导出数据文件同一目录。对于 `MODE` 为 `OUT` 的情况，此参数为可选参数。

当 `MODE` 为 `IN` 且 `DIRECT` 为 `TRUE` 时，此时数据载入若涉及到大字段对象，需要用户指定大字段数据文件。若 `CLIENT_LOB` 为 `TRUE`，`LOB_DIRECTORY` 应指定大字段数据文件所在的客户端本地目录；若 `CLIENT_LOB` 为 `FALSE`，此时此参数为必选参数，用户必须先把大字段数据文件传送到达梦数据库服务器主库所在的机器上，然后使用 `LOB_DIRECTORY` 指明大字段数据文件位于服务器主库所在机器上的目录。当 `MODE` 为 `IN` 且 `DIRECT` 为 `FALSE` 时，此参数无效。
