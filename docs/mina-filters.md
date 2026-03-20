---
id: mina-filters
title: MINA Filters
sidebar_position: 4.95
---

# Using MINA Filters

Adding a custom Apache MINA IO Filter allows you to inspect and manipulate:

*   Network events such as connects and disconnects,
*   FIX messages after they are sent by the QuickFIX/J engine but before they are sent on the network, and
*   FIX messages after they are received from the network but before they are processed by the QuickFIX/J engine.

Use cases include event logging, performance measurement, authorization, overload control, and message transformation (e.g., encryption and decryption).

## Adding a Filter

To add a filter, insert it into the filter chain by supplying an `IoFilterChainBuilder` to the connector or acceptor via `setIoFilterChainBuilder()`.

```java
final BlacklistFilter blacklistFilter = new BlacklistFilter();
// ...

/*
 * setIoFilterChainBuilder is defined on the SessionConnector abstract class
 */
((SessionConnector) acceptor).setIoFilterChainBuilder(new IoFilterChainBuilder() {
    public void buildFilterChain(IoFilterChain chain) {
        chain.addBefore(FIXProtocolCodecFactory.FILTER_NAME, "BlacklistFilter", blacklistFilter);
    }
});
```

QuickFIX/J uses a `ProtocolCodecFilter` to transform between streamed byte data on the wire and `quickfix.Message` objects. You should add your filter **before** this codec filter to act on the raw byte stream, or **after** it to act on `quickfix.Message` objects.

The codec filter is identified by `FIXProtocolCodecFactory.FILTER_NAME`.

---

## Blacklist Filter

MINA includes a `BlacklistFilter` that closes incoming connections from blacklisted addresses. The following example adds it to an acceptor to block connections from localhost, inserting the filter **before** the codec filter so it acts on the raw byte stream.

```java
acceptor = new SocketAcceptor(application, messageStoreFactory, settings, logFactory, messageFactory);

/* create the filter and add an address to the blacklist */
final BlacklistFilter blacklistFilter = new BlacklistFilter();
blacklistFilter.block(InetAddress.getByName("localhost"));

/* add it to the acceptor */
((SessionConnector) acceptor).setIoFilterChainBuilder(new IoFilterChainBuilder() {
    public void buildFilterChain(IoFilterChain chain) {
        chain.addBefore(FIXProtocolCodecFactory.FILTER_NAME, "BlacklistFilter", blacklistFilter);
    }
});

acceptor.start();
```

When the Executor and Banzai example apps are started, the connection from localhost is rejected:

**Executor Log**
```
<20060913-10:54:22, FIX.4.2:EXEC->BANZAI, event> (Created session: FIX.4.2:EXEC->BANZAI)
INFO: Listening for connections at 0.0.0.0/0.0.0.0:9876
INFO: MINA session created: /127.0.0.1:4538
INFO: [/127.0.0.1:4538] Remote address in the blacklist; closing.
```

**Banzai Log**
```
<20060913-10:54:26, FIX.4.2:BANZAI->EXEC, event> (Created session: FIX.4.2:BANZAI->EXEC)
<20060913-10:54:26, FIX.4.2:BANZAI->EXEC, event> (Disconnecting)
```

---

## Whitelist Filter

A whitelist filter works on `quickfix.Message` objects and must therefore be added **after** `FIXProtocolCodecFactory.FILTER_NAME`. It is configured from `SessionSettings`, allowing per-session control of allowed hosts.

```java
acceptor = new SocketAcceptor(application, messageStoreFactory, settings, logFactory, messageFactory);

final WhitelistFilter whitelistFilter = new WhitelistFilter(settings);
((SessionConnector) acceptor).setIoFilterChainBuilder(new IoFilterChainBuilder() {
    public void buildFilterChain(IoFilterChain chain) {
        chain.addAfter(FIXProtocolCodecFactory.FILTER_NAME, "WhitelistFilter", whitelistFilter);
    }
});

acceptor.start();
```

Specify valid IP addresses with the `WhitelistHost` setting at the default or session level:

```properties
[DEFAULT]
...
WhitelistHost=www.quickfixj.org

[SESSION]
SenderCompID=EXEC
TargetCompID=BANZAI

[SESSION]
SenderCompID=EXEC
TargetCompID=SONOFBANZAI
WhitelistHost1=127.0.0.1
WhitelistHost2=192.168.0.1, 192.168.0.2

[SESSION]
SenderCompID=EXEC
TargetCompID=FREEFORALL
WhitelistHost=
```

On startup, the valid hosts are logged:

```
INFO: Authorised IPs for FIX.4.2:EXEC->FREEFORALL: [Any]
INFO: Authorised IPs for FIX.4.2:EXEC->BANZAI: [www.quickfixj.org/213.246.61.101]
INFO: Authorised IPs for FIX.4.2:EXEC->SONOFBANZAI: [/192.168.0.1, /127.0.0.1, /192.168.0.2]
```

New connections are validated against the authorised IPs once the first message is received and closed if they are not valid:

```
WARNING: [/127.0.0.1:2633] Closing FIX.4.2:EXEC->BANZAI connection from unauthorised address.
```
