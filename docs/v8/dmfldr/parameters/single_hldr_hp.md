---
title: SINGLE_HLDR_HP
---

是否使用单个 HLDR 装载 HUGE 水平分区表主表。取值 `TRUE` 或 `FALSE`，缺省值为 `FALSE`。`TRUE` 表示使用单个 HLDR 装载 HUGE 水平分区表主表。`FALSE` 表示装载涉及到的每个叶子子表都各使用一个 HLDR。HLDR 是服务器端装载 HUGE 表时用到的处理装置。`SINGLE_HLDR_HP` 的设置相当于指定了服务器装载 HUGE 水平分区主表时可以使用资源的模式。`TRUE` 的方式更节约空间，`FALSE` 的方式装载速度更快，用户需要根据自己得需要权衡哪种方式更适合自己。
