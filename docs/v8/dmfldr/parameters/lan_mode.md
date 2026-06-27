---
title: LAN_MODE
---

指定当服务器环境为 MPP/DPC 环境时，dmfldr 导入/导出数据是否使用局域网，布尔类型，缺省为 `FALSE`。此参数只在 MPP/DPC 环境下有效。值为 `TRUE` 表示使用局域网，此时服务器的 MAL 系统必须配置了局域网 IP，否则 dmfldr 依然采用服务器对外服务的外网 IP；值为 `FALSE` 表示不使用局域网。
