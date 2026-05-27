---
title: LINESIZE
---

设置屏幕上一行显示宽度。

## 语法

## 参数

* `<screen_length>` - 屏幕宽度；
* `n` - 宽度；

## 与 `ISQL_MODE` 共同效果

* 当 `ISQL_MODE` 取值为 0、1 或 3 时，`LINESIZE` 取值范围为1~32767；
* 当 `ISQL_MODE` 取值为 2 时，`LINESIZE` 取值范围为0~32767
    * 取值为 0 时，表示一行数据在同一行显示；
