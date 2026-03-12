---
id: deep-tech-reference
title: Deep Tech Reference
sidebar_position: 7
---

# Deep Tech Reference

This section dives into the low-level mechanics of QuickFIX/J. It is meant for core contributors, infrastructure engineers, or developers pushing the engine to its limits in high-frequency or complex environments.

## Custom DataDictionaries

Exchanges rarely follow the vanilla FIX specification perfectly. They frequently add custom tags, require tags that are officially marked as optional, or define entirely proprietary message types.

To handle this, you must modify the XML `DataDictionary`. The dictionary defines the grammar of the protocol.

### Modifying the XML Dictionary
Locate the `FIX44.xml` (or relevant version) file in the QuickFIX/J jar, copy it to your local filesystem, and point your configuration `DataDictionary=my_custom_FIX44.xml` to it.

```xml
<!-- Example: Adding a custom tag to NewOrderSingle -->
<message name="NewOrderSingle" msgtype="D" msgcat="app">
    <field name="ClOrdID" required="Y"/>
    <field name="Account" required="N"/>
    
    <!-- Custom exchange tag 9001 -->
    <field name="ExchangeSpecificData" required="Y"/> 
</message>

<!-- You must also define the tag in the fields section -->
<fields>
    <field number="9001" name="ExchangeSpecificData" type="STRING"/>
</fields>
```

When you define `UseDataDictionary=Y`, QuickFIX/J validates incoming bytes against these rules. If a required tag (like `ExchangeSpecificData`) is missing, QuickFIX/J will automatically generate a `Reject` (MsgType 3) and prevent the malformed message from reaching your `Application`'s `fromApp` method.

## Message Store Internals & Performance

QuickFIX/J uses the `MessageStore` to guarantee delivery. When an application calls `Session.sendToTarget()`, the message is appended to the store *before* being flushed to the socket.

### MemoryStore vs. FileStore
* **MemoryStore**: Yields zero disk I/O overhead. Because state is lost on JVM restart, sequence numbers will revert to 1. This is best for internal testing, market data feeds, or connections that do not strictly enforce intraday sequencing.
* **FileStore**: Provides standard durability. To optimize for low-latency trading:
  * Ensure the storage directory is mounted on a high-speed NVMe SSD or a RAM disk (`tmpfs`).
  * If absolute durability is not critical on every tick, rely on the OS filesystem cache (as QuickFIX/J FileStore relies on standard `RandomAccessFile` appending).

## Threading Details (Apache MINA)

QuickFIX/J utilizes Apache MINA `IoAcceptor` and `IoConnector` for network transport.
By default, `SocketInitiator` and `SocketAcceptor` create a pool of NIO threads. 

**Tuning Options:**
* `SocketThreadPriority`: Modifies the JVM thread priority of socket reading threads.
* `SocketUseOio`: Reverts from non-blocking NIO to Old I/O (blocking sockets) if set to `Y`. Generally not recommended unless diagnosing specific network card offloading or kernel-level buffering issues.
* `SocketSendBufferSize` / `SocketReceiveBufferSize`: Tunes the underlying TCP socket buffer sizes.

## JMX Integration

QuickFIX/J provides a comprehensive MBean hierarchy allowing you to inspect session state, reset sequence numbers, and trigger manual logons/logouts without restarting the JVM.

### Registering the JMX Exporter

```java
import org.quickfixj.jmx.JmxExporter;

// After creating your Acceptor or Initiator
Initiator initiator = new SocketInitiator(...);
initiator.start();

JmxExporter exporter = new JmxExporter();
exporter.register(initiator);
```

Once registered, you can connect to your application via `JConsole`, `VisualVM`, or Datadog/Prometheus JMX agents to explore the `org.quickfixj` domain. You can monitor attributes like `IncomingSequenceNumber` and `OutgoingSequenceNumber` in real time.

## Dynamic Sessions

For gateway architectures where a server accepts connections from an unknown or dynamic list of clients, pre-configuring every session in the `[SESSION]` block is unfeasible.

QuickFIX/J provides `DynamicAcceptorSessionProvider`. 
When a new connection arrives and a Logon (35=A) is received, the Acceptor consults the provider. If the provider approves the `SenderCompID` and `TargetCompID`, QuickFIX/J dynamically instantiates a new `Session` in memory and fires `onCreate` in your Application.
