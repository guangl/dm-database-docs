---
title: PAGES[IZE]
---

设置一页有多少行数。

## 语法

![语法图](./railroad/pages.svg)

## 参数

* `n` - 取值范围：0~5000；

> [!warning]
> 如果设为 0，则所有的输出内容为一页。


## 与 `ISQL_MODE` 共同效果

* 当 `ISQL_MODE` 不等于 2 时，不显示列标题；
* 当 `ISQL_MODE = 1` 时，如果 `PAGESIZE < NEWPAGE + 2`，则不显示列标题；
* 当 `ISQL_MODE = 2` 时，`PAGESIZE` 取任意值，都显示列标题 ；仅首页显示列标题；
