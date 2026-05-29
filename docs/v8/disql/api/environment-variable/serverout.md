---
title: SERVEROUT[PUT]
---

在块中有打印信息时，是否打印，以及打印的格式。

设置之后，可以使用 `DBMS_OUTPUT` 包打印或者使用 `PRINT` 打印。

## 语法

![语法图](./railroad/serverout.svg)

## 参数

* `ON` - 打印；
* `OFF` - 不打印；
* `SIZE` - 输出缓冲区大小，单位字节；
* `WORD_WRAPPED` - 按照单词分隔；
* `TRUNCATED` - 单词被截断；
* `FORMAT` - 按照服务器返回的显示，不做格式化；
