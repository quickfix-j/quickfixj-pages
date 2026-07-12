---
id: session-state-listener
title: Session State Listener
sidebar_position: 3.5
---

# Session State Listener

`SessionStateListener` is a lightweight interface you can register on any `Session`
to be notified of low-level state transitions — without being part of your main
`Application` implementation. It is ideal for monitoring, metrics, alerting, and
audit logging that must run independently from business logic.

Because every method has a `default` (no-op) implementation, you only need to
override the callbacks that are relevant to your use case.

## Interface Definition

```java
package quickfix;

public interface SessionStateListener {

    /** Called when a TCP connection has been established. */
    default void onConnect(SessionID sessionID) {}

    /** Called when an exception occurs during connection establishment. */
    default void onConnectException(SessionID sessionID, Exception exception) {}

    /** Called when the TCP connection has been disconnected. */
    default void onDisconnect(SessionID sessionID) {}

    /** Called when the FIX session has been logged on (35=A exchanged). */
    default void onLogon(SessionID sessionID) {}

    /** Called when the FIX session has been logged out (35=5 or connection drop). */
    default void onLogout(SessionID sessionID) {}

    /** Called when the message store is reset. */
    default void onReset(SessionID sessionID) {}

    /** Called when the message store is refreshed on Logon. */
    default void onRefresh(SessionID sessionID) {}

    /** Called when a TestRequest (35=1) is sent out due to a missed Heartbeat. */
    default void onMissedHeartBeat(SessionID sessionID) {}

    /** Called when a Heartbeat timeout has been detected. */
    default void onHeartBeatTimeout(SessionID sessionID) {}

    /**
     * Called when a ResendRequest (35=2) has been sent.
     *
     * @param beginSeqNo      first sequence number requested
     * @param endSeqNo        last sequence number requested
     * @param currentEndSeqNo last sequence number of the current chunk
     *                        (relevant when chunked ResendRequests are configured)
     */
    default void onResendRequestSent(SessionID sessionID, int beginSeqNo, int endSeqNo, int currentEndSeqNo) {}

    /**
     * Called when a SequenceReset (35=4) has been received.
     *
     * @param newSeqNo     the NewSeqNo value from the SequenceReset
     * @param gapFillFlag  the GapFillFlag value from the SequenceReset
     */
    default void onSequenceResetReceived(SessionID sessionID, int newSeqNo, boolean gapFillFlag) {}

    /**
     * Called when an inbound ResendRequest has been fully satisfied.
     *
     * @param beginSeqNo  first sequence number that was requested
     * @param endSeqNo    last sequence number that was requested
     */
    default void onResendRequestSatisfied(SessionID sessionID, int beginSeqNo, int endSeqNo) {}

    /**
     * Called when a PossDupFlag=Y message is discarded before reaching
     * {@code fromApp} because it failed sequence number or OrigSendingTime
     * validation. The supplied {@code message} is read-only — do not mutate it.
     */
    default void onPossDupMessageDiscarded(SessionID sessionID, Message message) {}
}
```

## Registering a Listener

Obtain a reference to the `Session` object and call `addStateListener`. The `onCreate`
callback of your `Application` implementation is a convenient place to do this:

```java
import quickfix.*;

public class MyApplication implements Application {

    @Override
    public void onCreate(SessionID sessionId) {
        Session session = Session.lookupSession(sessionId);
        if (session != null) {
            session.addStateListener(new MySessionStateListener());
        }
    }

    // ... other Application callbacks
}
```

## Example Implementation

```java
import quickfix.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MySessionStateListener implements SessionStateListener {

    private static final Logger log = LoggerFactory.getLogger(MySessionStateListener.class);

    @Override
    public void onConnect(SessionID sessionID) {
        log.info("[{}] TCP connection established", sessionID);
    }

    @Override
    public void onConnectException(SessionID sessionID, Exception exception) {
        log.error("[{}] Connection error: {}", sessionID, exception.getMessage());
    }

    @Override
    public void onDisconnect(SessionID sessionID) {
        log.warn("[{}] TCP connection lost", sessionID);
    }

    @Override
    public void onLogon(SessionID sessionID) {
        log.info("[{}] Session logged on", sessionID);
        // e.g. update a health-check flag, publish a metric
    }

    @Override
    public void onLogout(SessionID sessionID) {
        log.info("[{}] Session logged out", sessionID);
    }

    @Override
    public void onMissedHeartBeat(SessionID sessionID) {
        log.warn("[{}] Missed heartbeat — TestRequest sent", sessionID);
    }

    @Override
    public void onHeartBeatTimeout(SessionID sessionID) {
        log.error("[{}] Heartbeat timeout — connection will be dropped", sessionID);
    }

    @Override
    public void onResendRequestSent(SessionID sessionID, int beginSeqNo, int endSeqNo, int currentEndSeqNo) {
        log.info("[{}] ResendRequest sent: {}-{} (chunk end: {})",
                sessionID, beginSeqNo, endSeqNo, currentEndSeqNo);
    }

    @Override
    public void onSequenceResetReceived(SessionID sessionID, int newSeqNo, boolean gapFillFlag) {
        log.info("[{}] SequenceReset received: newSeqNo={}, gapFill={}",
                sessionID, newSeqNo, gapFillFlag);
    }

    @Override
    public void onResendRequestSatisfied(SessionID sessionID, int beginSeqNo, int endSeqNo) {
        log.info("[{}] ResendRequest satisfied: {}-{}", sessionID, beginSeqNo, endSeqNo);
    }

    @Override
    public void onPossDupMessageDiscarded(SessionID sessionID, Message message) {
        // message is read-only — do not mutate it
        log.warn("[{}] PossDup message discarded (seq/OrigSendingTime validation failed)", sessionID);
    }

    @Override
    public void onReset(SessionID sessionID) {
        log.info("[{}] Session state reset", sessionID);
    }

    @Override
    public void onRefresh(SessionID sessionID) {
        log.info("[{}] Session state refreshed from store", sessionID);
    }
}
```

## Multiple Listeners

You can register more than one listener on the same session. All registered listeners
are called sequentially in registration order:

```java
session.addStateListener(new MetricsListener());
session.addStateListener(new AlertingListener());
session.addStateListener(new AuditLogListener());
```

## Comparison: `Application` Callbacks vs. `SessionStateListener`

| Concern | `Application` | `SessionStateListener` |
| :--- | :--- | :--- |
| Business message routing | ✅ `fromApp` / `toApp` | ❌ |
| Admin message interception | ✅ `toAdmin` / `fromAdmin` | ❌ |
| Connection & session lifecycle | ✅ `onLogon` / `onLogout` | ✅ All lifecycle events |
| Heartbeat & timeout events | ❌ | ✅ |
| ResendRequest & SequenceReset tracking | ❌ | ✅ |
| PossDup discard notification | ❌ | ✅ |
| Multiple observers per session | ❌ One `Application` per connector | ✅ Many listeners via `addStateListener` |

Use `SessionStateListener` when you need to add cross-cutting concerns (metrics,
circuit-breakers, alerting) without coupling them to your `Application` implementation.

## JMX vs. `SessionStateListener`

The [JMX integration](./jmx) also surfaces session-state events as JMX notifications
(`connect`, `disconnect`, `logon`, etc.). Use JMX when you need remote or
operations-tooling access. Use `SessionStateListener` when you need programmatic,
in-process hooks — for example, to update a health indicator or push metrics to Micrometer.
