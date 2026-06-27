---
title: SYSAUDITOR_PWD
---

初始化时设置 `SYSAUDITOR` 的密码，不允许缺省。密码为字符串，必须同时包含大写字母、小写字母、数字，不允许与用户名重名，密码长度须大于或等于 INI 参数 `PWD_MIN_LEN` 所设定的值且小于 48，关于参数 `PWD_MIN_LEN` 的详细说明请参考《DM8 系统管理员手册》。

如果密码中包含特殊字符，则需要按照规定的书写规范进行书写，详细请参考 [DM8_DIsql 使用手册](/disql/introduction)。

数据库创建成功后，`SYSAUDITOR` 可通过修改用户密码语句修改自己的密码。
