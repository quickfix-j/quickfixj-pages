---
id: configuration
title: Configuration
sidebar_position: 3
---

# Configuration

QuickFIX/J is heavily metadata-driven and relies on a plain text configuration file to manage connection details, session settings, persistence, validation rules, and dictionary paths.

## Structure of the Settings File

The configuration file is divided into `[DEFAULT]` sections and specific `[SESSION]` sections.

* **[DEFAULT]**: Settings defined here apply to all sessions defined subsequently, unless explicitly overridden within a specific session block.
* **[SESSION]**: Settings unique to a specific connection instance.

## Example Initiator Configuration

```properties
[DEFAULT]
ConnectionType=initiator
HeartBtInt=30
ReconnectInterval=5

# Validation
UseDataDictionary=Y
DataDictionary=FIX44.xml
ValidateFieldsOutOfOrder=N
ValidateChecksum=Y

# Logging (using FileLog)
FileLogPath=log

# Persistence (using FileStore)
FileStorePath=data
PersistMessages=Y

[SESSION]
BeginString=FIX.4.4
SenderCompID=MY_FIRM
TargetCompID=EXCHANGE
SocketConnectHost=192.168.1.100
SocketConnectPort=9876
StartTime=00:00:00
EndTime=23:59:00
ResetOnLogon=N
```

## Example Acceptor Configuration

```properties
[DEFAULT]
ConnectionType=acceptor
StartTime=00:00:00
EndTime=23:59:00
FileLogPath=log
FileStorePath=data
UseDataDictionary=Y

[SESSION]
BeginString=FIX.4.4
SenderCompID=EXCHANGE
TargetCompID=CLIENT_A
SocketAcceptPort=9877
DataDictionary=FIX44_custom.xml

[SESSION]
BeginString=FIX.4.2
SenderCompID=EXCHANGE
TargetCompID=CLIENT_B
SocketAcceptPort=9878
DataDictionary=FIX42.xml
```

## Key Configuration Parameters

### Session & Connection

| Parameter | Description |
|-----------|-------------|
| `ConnectionType` | Defines the role: `initiator` (client that dials out) or `acceptor` (server that listens). |
| `BeginString` | The FIX version for the session (e.g., `FIX.4.2`, `FIX.4.4`, `FIXT.1.1`). |
| `SenderCompID` | Your firm's identifier (Tag 49). |
| `TargetCompID` | Your counterparty's identifier (Tag 56). |
| `SocketConnectHost` | (Initiator only) The IP or DNS name to connect to. |
| `SocketConnectPort` | (Initiator only) The port to connect to. |
| `SocketAcceptPort` | (Acceptor only) The port to bind and listen on. |
| `HeartBtInt` | Heartbeat interval in seconds. Defines how often `TestRequest` or `Heartbeat` messages are sent. |
| `StartTime` / `EndTime` | Defines the daily or weekly session schedule. Determines when sequence numbers are reset based on the active session boundary. |
| `ResetOnLogon` | If `Y`, forces sequence numbers to reset to 1 every time a Logon occurs. |

### Validation

| Parameter | Description |
|-----------|-------------|
| `UseDataDictionary` | Set to `Y` to enable structural validation of FIX messages. |
| `DataDictionary` | Path to the XML file describing the FIX version specification (e.g., `FIX44.xml`). |
| `ValidateFieldsOutOfOrder`| If `N` (default `Y`), allows fields to appear out of the strict order defined in the XML. |
| `ValidateChecksum` | If `Y`, validates the Checksum (Tag 10) at the end of the message. |
| `CheckLatency` | If `Y`, checks the `SendingTime` (Tag 52) against the local system clock and rejects messages exceeding `MaxLatency` (default 120s). |

### Storage & Logging

| Parameter | Description |
|-----------|-------------|
| `PersistMessages` | If `Y` (default), messages are saved to the store for potential recovery via `ResendRequest`. Set to `N` for market data feeds. |
| `FileStorePath` | Directory where `FileStore` saves `.seqnums` and `.body` files. |
| `FileLogPath` | Directory where `FileLog` saves raw FIX traffic (`.messages.log`) and engine events (`.event.log`). |
| `SLF4JLogPrependSessionID`| When using SLF4J, prepends the `SessionID` to log output for easier grep filtering. |

## Programmatic Configuration

While property files are the standard approach, you can also configure QuickFIX/J programmatically by constructing `SessionSettings` objects:

```java
import quickfix.SessionSettings;
import quickfix.SessionID;

SessionSettings settings = new SessionSettings();

// Set default parameters
settings.setString("ConnectionType", "initiator");
settings.setString("HeartBtInt", "30");

// Set session-specific parameters
SessionID sessionId = new SessionID("FIX.4.4", "SENDER", "TARGET");
settings.setString(sessionId, "SocketConnectHost", "127.0.0.1");
settings.setString(sessionId, "SocketConnectPort", "9876");
settings.setString(sessionId, "StartTime", "00:00:00");
settings.setString(sessionId, "EndTime", "23:59:00");
```
