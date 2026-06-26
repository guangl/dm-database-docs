---
title: 使用 dmdbchk
---

# 使用 dmdbchk

dmdbchk 工具从命令行启动。找到 dmdbchk 所在安装目录 `/dmdbms/bin`，输入 dmdbchk 和参数后回车。

内存占用与 INI 参数 BUFFER 有关。如需调整内存占用，可适当调小这些参数，完成校验后需调整回原值。

:::warning 重要
dmdbchk 校验数据库需要经过初始化且正常关闭的数据库，否则报错退出。
:::

基本用法示例：

```bash
./dmdbchk PATH=/home/test/dmdbms/dm.ini
```

若 dm.ini 在 dmdbchk 当前目录：

```bash
./dmdbchk PATH=dm.ini
```
