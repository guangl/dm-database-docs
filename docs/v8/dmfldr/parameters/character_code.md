---
title: CHARACTER_CODE
---

数据文件中数据的编码格式和参数文件的编码格式（控制文件，sqlfile），字符串类型。默认与当前机器编码格式一致。`CHARACTER_CODE` 的可选项有 GBK、GB18030、UTF-8、SINGLE_BYTE 和 EUC-KR 五种：

- GBK 和 GB18030 对应中文编码；
- UTF-8 对应 UTF-8 国际编码；
- SINGLE_BYTE 对应单字节字符编码；
- EUC-KR 对应韩文字符集。

在 `MODE` 为 `IN` 的情况下，指定编码格式为 SINGLE_BYTE 时，dmfldr 将不做字符完整性检查，按单字节顺序读取每个字符。指定编码格式为 GBK、GB18030 或 UTF-8 时，dmfldr 将对每一个字符做字符的完整性检查，确保数据的正确性。

用户在使用 dmfldr 时可以根据不同的数据文件调整编码的格式确保装载的正确性，同时如果可以确保数据文件中的数据为单字节字符，则指定 SINGLE_BYTE 的载入效率将优于指定其他字符集的情况。当 `MODE` 为非 `IN` 时，不支持 SINGLE_BYTE。
