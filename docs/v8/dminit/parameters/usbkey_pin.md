---
title: USBKEY_PIN
---

USBKEY PIN 是登录第三方设备 UKEY 的密码。供使用 UKEY 的用户使用。UKEY 用于服务器端存储加密根密钥的证书，缺省使用磁盘物理文件 dm_service.prikey 存储根密钥密钥的密文。

在 DM 的加密机制中，增加移动 UKEY 的使用，更能确保 SVR_KEY 的安全性，数据安全性也得到进一步提升。

USBKEY PIN 为字符串，不能超过 48 个字节。可选参数。

此参数在数据库创建成功后无法修改。
