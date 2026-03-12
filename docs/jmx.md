---
id: jmx
title: JMX Management
sidebar_position: 4.7
---

# Managing QFJ Applications With JMX

QuickFIX/J provides FIX engine monitoring and control using standard Java JMX MBeans. This allows you to inspect session states, modify settings, and trigger commands (like logout) remotely without restarting your application.

### QFJ MBeans

The following MBeans are available:
*   `SocketAcceptorAdmin`
*   `SocketInitiatorAdmin`
*   `SessionAdmin`
*   `SessionSettingsAdmin`

### Adding JMX support

JMX support is an optional feature. It is enabled for each initiator or acceptor by using the `JmxExporter` utility class.

```java
Acceptor acceptor = new SocketAcceptor(application, messageStoreFactory, settings, logFactory, messageFactory);

JmxExporter jmxExporter = new JmxExporter();
ObjectName connectorObjectName = jmxExporter.register(acceptor);

acceptor.start();

// Later... if you need to unregister the connector MBean
jmxExporter.getMBeanServer().unregisterMBean(connectorObjectName);
```

By default, the exporter will try to use the platform MBean server. You can also create an exporter for a specific `MBeanServer` created by the application.

### Accessing JMX MBeans Remotely

To access JMX MBeans from a separate process (for example, a management console), a JMX connector must be used. The easiest way to expose and view the MBeans is to use the `JConsole` or `VisualVM` applications included in the JDK.

If you are connecting remotely, you must add standard JVM JMX arguments when running your QuickFIX/J application:
```bash
-Dcom.sun.management.jmxremote
-Dcom.sun.management.jmxremote.port=9010
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```

### JMX Notifications

The QFJ JMX `Session` MBean provides notifications related to state change events. The JMX notification type is `quickfix.Session`.

| Event Name | Description |
| :--- | :--- |
| `connect` | Socket connection associated with session |
| `disconnect` | Socket connection disassociated from session |
| `logon` | Session logged on |
| `logout` | Session logged out |
| `missedHeartBeat` | Missed heartbeat (possible dead connection) |
| `heartBeatTimeout`| Second heartbeat missed |
| `refresh` | Session state refreshed from session store |
| `reset` | Session state reset |
