---
title: ENABLE_CLASS_TYPE
---

指定是否以 BLOB 方式载入或导出 CLASS 类型列数据，布尔类型，默认为 `FALSE`。仅在 `DIRECT = TRUE` 时有效，若 `DIRECT = FALSE`，不支持导入 CLASS 类型数据。CLASS 类型是达梦数据库服务器内部实现的数据类型，实际以 BLOB 类型存储。如果通过交互式工具或达梦数据库提供的接口等正常途径创建的 CLASS 类型数据，内部会转换成 BLOB 存储。而通过 dmfldr 直接导 CLASS 数据，没有进行转换，有可能出现载入的大对象数据无法转换成对应的 CLASS 类型。因此，当将 `ENABLE_CLASS_TYPE` 设为 `TRUE` 时，用户要保证对应的 BLOB 数据能正确转换成对应的 CLASS 类型。
