---
id: secure-communications
title: SSL / Secure Sockets
sidebar_position: 4.6
---

# Secure Communications using SSL

QuickFIX/J supports secure sockets via the Apache MINA SSL I/O filter.

The default usage of SSL is very simple. Add the following setting to your QFJ settings file:

```properties
SocketUseSSL=Y
```

This setting must be used for both acceptors and initiators.

### Specific SSL Certificates

If you need to use a specific SSL certificate, configure your session like below:

```properties
SocketUseSSL=Y
SocketKeyStore=[your key store path]
SocketKeyStorePassword=[your key store password]
```

### Client Authentication

If certificates require authentication, additional settings must be provided:

```properties
SocketTrustStore=[your trust store path]
SocketTrustStorePassword=[your trust store password]
```

Acceptor certificates are always authenticated by the initiator. Authenticating client certificates on the Acceptor side requires the following setting:

```properties
NeedClientAuth=Y
```

### Example Configurations

**Acceptor configuration with client certificate authentication:**

```properties
[DEFAULT]
ConnectionType=acceptor
SocketAcceptHost=localhost
SocketUseSSL=Y
CipherSuites=TLS_RSA_WITH_AES_128_CBC_SHA
EnabledProtocols=TLSv1.2
SocketKeyStore=acceptor.keystore
SocketKeyStorePassword=password
NeedClientAuth=Y

[SESSION]
BeginString=FIX.4.4
SocketAcceptPort=12341
TargetCompID=ZULU1
SenderCompID=ALFA1
SocketTrustStore=acceptor1.truststore
SocketTrustStorePassword=password
```

**Initiator configuration:**

```properties
[DEFAULT]
ConnectionType=initiator
SocketConnectProtocol=SOCKET
SocketConnectHost=localhost
SocketConnectPort=12341
SocketUseSSL=Y
CipherSuites=TLS_RSA_WITH_AES_128_CBC_SHA
EnabledProtocols=TLSv1.2
SocketKeyStore=initiator1.keystore
SocketKeyStorePassword=password
SocketTrustStore=initiator1.truststore
SocketTrustStorePassword=password

[SESSION]
BeginString=FIX.4.4
TargetCompID=ALFA1
SenderCompID=ZULU1
```
