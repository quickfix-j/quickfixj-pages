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

### Supplying SSL Contexts from the Application

By default, QuickFIX/J loads the key and trust stores named in the settings from the file system or classpath. An application can instead supply the `SSLContext` itself through an `SSLContextProvider`, for example when the stores come from a secrets manager and should stay in memory. With stores provided as Base64-encoded environment variables:

```java
char[] password = System.getenv("FIX_KEYSTORE_PASSWORD").toCharArray();
KeyStore keyStore = KeyStore.getInstance("PKCS12");
keyStore.load(new ByteArrayInputStream(Base64.getMimeDecoder().decode(System.getenv("FIX_KEYSTORE_B64"))), password);
KeyStore trustStore = KeyStore.getInstance("PKCS12");
trustStore.load(new ByteArrayInputStream(Base64.getMimeDecoder().decode(System.getenv("FIX_TRUSTSTORE_B64"))),
        System.getenv("FIX_TRUSTSTORE_PASSWORD").toCharArray());

KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
kmf.init(keyStore, password);
TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
tmf.init(trustStore);
SSLContext sslContext = SSLContext.getInstance("TLS");
sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);

SocketInitiator initiator = SocketInitiator.newBuilder()
        // ... application, store factory, settings
        .withSSLContextProvider(sslConfig -> sslContext)
        .build();
```

Set the provider with `withSSLContextProvider` on the builders of `SocketInitiator`, `SocketAcceptor`, and their threaded variants. Without a provider, QuickFIX/J loads the configured stores as before. The provider receives the `SSLConfig` of the session or acceptor address, so it can return different contexts, such as a client certificate per counterparty, or delegate to `SSLContextFactory.getInstance(sslConfig)` for stores that should still be loaded from files.

- `SocketUseSSL=Y` is still required. The provider supplies only the context; protocols, cipher suites, `NeedClientAuth`, SNI, and endpoint identification are still applied from the settings, while store settings are not used.
- If the provider throws a `GeneralSecurityException` or returns `null`, the session (initiator) or listening address (acceptor) fails to initialize, subject to `ContinueInitializationOnError`. There is no implicit fallback to the default behavior.
- The provider is called whenever an SSL filter is set up: once per listening address when an acceptor starts, and once per session when an initiator starts (and again if its I/O connector is reset). Return a new context to pick up rotated credentials on the next start, or supply a key or trust manager that reloads its material to rotate without restarting.
- Contexts created by `SSLContextFactory` have their trust managers wrapped so that a `RuntimeException` thrown during certificate validation is reported as a `CertificateException`. A supplied context is used as is; wrap its trust managers with `X509TrustManagerWrapper.wrap(...)` to get the same behavior.

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
