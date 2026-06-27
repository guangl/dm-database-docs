---
title: USERID
---

`USERID` 用于指定数据库的连接信息。必选参数，且必须位于参数位置的第一个。

语法：

```
{{<username>[/<password>]} | /}[@<connect_identifier>][] [<os_auth>]
<connect_identifier> ::=<svc_name> | {<host>[:<port>]} | <unixsocket_file>
<option>::= #{ <extend_option>=<value>{,<extend_option>=<value>} }
<os_auth>::= AS {SYSDBA|SYSSSO|SYSAUDITOR|USERS|AUTO}
```

组件说明：

- `{<username>[/<password>]} | /`：用户名和密码。普通登录方式时用户名必写，密码为 dminit 初始化时系统强制要求设置的登录口令。本文档以"Dmsys_123"为示例密码，实际运行中需要用户自行替换。`/` 表示采用操作系统身份验证方式登录或利用 wallet 文件登录。
- `<svc_name>`：服务名。
- `<host>[:<port>]`：服务器 IP 地址和端口号。缺省情况下默认为本地服务器和端口号 localhost:5236。当服务器为本机时，host 参数可直接写 localhost。当连接其他服务器时，需写上 ip 地址和端口号，例如：`192.168.0.248:8888`。
- `<unixsocket_file>`：专门用于在 LINUX 系统中，当服务器与客户端之间使用 UNIXSOCKET（UNIX DOMAIN SOCKET - IPC）协议通信时，指定客户端连接的 socket 文件路径。

扩展选项示例：

```
./dmfldr SYSDBA/Dmsys_123@/home/test/foo.sock#{inet_type=UNIXSOCKET} control='/home/test/dmfldr_test.ctrl'
```

扩展选项（extend_option）：

| extend_option | value | 说明 |
| --- | --- | --- |
| mpp_type | GLOBAL / LOCAL | MPP 登录属性。GLOBAL 表示 MPP 环境下建立的会话为全局会话，对数据库的导入导出操作在所有节点进行；LOCAL 表示 MPP 环境下建立的会话为本地会话，对数据库的导入导出操作只在本地节点进行 |
| inet_type | TCP/UDP/IPC/UNIXSOCKET/RDMA | 网络通信协议类型。缺省为 TCP。使用 UDP 协议时，服务器需要设置 INI 参数 ENABLE_UDP 非 0；使用 IPC 协议时，会忽略 IP 地址和端口号，直接连接本机上 INI 参数 ENABLE_IPC=1 的服务器；使用 UNIXSOCKET 协议时，无需指定 IP 地址和端口号，但服务器需要配置 INI 参数 UNIX_SOCKET_PATHNAME 指定 socket 文件路径；使用 RDMA 协议时，需要安装并配置 RDMA 网卡 |
| ssl_path | 路径 | 通信加密的 SSL 数字证书路径，缺省为不使用加密。数字证书路径由用户自己创建 |
| ssl_pwd | 密码 | 通信加密的 SSL 数字证书密码。和 ssl_path 一起使用 |

完整扩展选项示例：

```
./dmfldr SYSDBA/Dmsys_123@192.168.1.64:5236#"{mpp_type=local,inet_type=tcp}" control='/home/test/dmfldr_test.ctrl' log='/home/test/log/fldr.log'
```

操作系统身份验证：`AS <SYSDBA|SYSSSO|SYSAUDITOR|USERS|AUTO>`。用户可以通过将操作系统用户加入到对应用户组来使用操作系统用户登录数据库。AUTO 表示按顺序自动匹配数据库用户类型。
