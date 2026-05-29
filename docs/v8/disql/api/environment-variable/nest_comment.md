---
title: NEST_COMMENT
---

是否支持多层注释嵌套。

> [!note]
> 需要服务器 ini 参数 `NESTED_C_STYLE_COMMENT = 1` 支持 c 风格注释，否则将带有嵌套注释的 SQL 发给服务器可能报语法错误。

`disql` 中支持注释，注释必须由 `/*` 开始和 `*/` 结束。
注释内容还可以嵌套其他的注释，嵌套的注释也同样需由 `/*` 开始和 `*/` 结束。

## 语法

![语法图](./railroad/nest_comment.svg)

## 参数

* `ON` - 支持多层注释；
* `OFF` - 只支持一层注释；
