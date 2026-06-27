---
title: SINGLE_FILE
---

指定当服务器环境为 MPP/DPC 环境时，dmfldr 的导出数据文件是否为单个文件，布尔类型，缺省为 `FALSE`。此参数只在 MPP/DPC 环境下且 `MODE` 为 `OUT` 时有效。参数值为 `TRUE` 表示仅生成一个数据导出文件，MPP/DPC 各个站点的数据将导出到同一个数据文件；值为 `FALSE` 表示可以生成多个数据文件，每一个 MPP/DPC 站点都有专门的数据文件接收该站点的数据。
