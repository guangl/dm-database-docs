---
title: MPP_CLIENT
---

指定当服务器环境为 MPP 环境时 dmfldr 的数据装载模式，布尔类型，缺省为 `TRUE`。当服务器环境为 MPP 环境时，若 `MPP_CLIENT` 为 `TRUE`，为客户端分发模式，数据在 dmfldr 客户端分发好后直接往指定站点发送数据；若 `MPP_CLIENT` 为 `FALSE`，为本地分发模式，dmfldr 客户端将数据全部发往连接的 MPP `EP` 站点。MPP 环境下要配置 dmmal.ini 文件中的 MAL_INST_HOST 和 MAL_INST_PORT 参数。此参数只有当服务器环境为 MPP 环境时才有效。
