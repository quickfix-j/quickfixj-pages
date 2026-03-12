---
id: tutorials
title: Tutorials
sidebar_position: 6
---

# Tutorials

Ready to get your hands dirty? Follow these step-by-step guides to build a working QuickFIX/J application.

## 1. Building a Simple FIX Client (Initiator)

In this tutorial, we will build a client that connects to a dummy broker. An Initiator dials out to an Acceptor.

### Step 1: Define the Configuration (`client.cfg`)

Create a file named `client.cfg` in your project root or `src/main/resources`.

```properties
[DEFAULT]
ConnectionType=initiator
HeartBtInt=30
ReconnectInterval=5
FileStorePath=target/data/client
FileLogPath=target/log/client
StartTime=00:00:00
EndTime=23:59:00
UseDataDictionary=Y
DataDictionary=FIX44.xml
ResetOnLogon=Y

[SESSION]
BeginString=FIX.4.4
SenderCompID=CLIENT1
TargetCompID=BROKER
SocketConnectHost=localhost
SocketConnectPort=9876
```

### Step 2: Implement the Application

Create your Application class. We will use `MessageCracker` to easily handle Execution Reports.

```java
import quickfix.*;
import quickfix.fix44.ExecutionReport;

public class ClientApplication extends MessageCracker implements Application {
    
    @Override
    public void onCreate(SessionID sessionId) {
        System.out.println("Session created: " + sessionId);
    }
    
    @Override
    public void onLogon(SessionID sessionId) {
        System.out.println("Successfully logged on to " + sessionId);
    }
    
    @Override
    public void onLogout(SessionID sessionId) {
        System.out.println("Logged out of " + sessionId);
    }
    
    @Override
    public void toAdmin(Message message, SessionID sessionId) {}
    
    @Override
    public void fromAdmin(Message message, SessionID sessionId) {}
    
    @Override
    public void toApp(Message message, SessionID sessionId) {}
    
    @Override
    public void fromApp(Message message, SessionID sessionId) 
            throws FieldNotFound, IncorrectDataFormat, IncorrectTagValue, UnsupportedMessageType {
        // Crack the message to route to strongly-typed handlers
        crack(message, sessionId);
    }
    
    // Strongly-typed handler for Execution Reports
    public void onMessage(ExecutionReport execution, SessionID sessionId) throws FieldNotFound {
        System.out.println("Received Execution Report for order: " + execution.getOrderID().getValue());
        System.out.println("Status: " + execution.getExecType().getValue());
    }
}
```

### Step 3: Bootstrapping the Engine

Set up the main method to parse the configuration, instantiate the components, and start the `SocketInitiator`.

```java
import quickfix.*;
import java.io.FileInputStream;

public class ClientMain {
    public static void main(String[] args) throws Exception {
        // 1. Load settings
        SessionSettings settings = new SessionSettings(new FileInputStream("client.cfg"));
        
        // 2. Instantiate application
        Application application = new ClientApplication();
        
        // 3. Define message store and log factories
        MessageStoreFactory storeFactory = new FileStoreFactory(settings);
        LogFactory logFactory = new FileLogFactory(settings);
        
        // 4. Default message factory
        MessageFactory messageFactory = new DefaultMessageFactory();

        // 5. Build and start the initiator
        Initiator initiator = new SocketInitiator(application, storeFactory, settings, logFactory, messageFactory);
        System.out.println("Starting QuickFIX/J Initiator...");
        initiator.start();

        // Keep running until user terminates
        System.out.println("Press Enter to quit");
        System.in.read();

        initiator.stop();
    }
}
```

## 2. Setting up a FIX Acceptor

The Acceptor waits for incoming connections from Initiators. It is typically used if you are building an exchange simulator or a routing gateway.

### Acceptor Configuration (`server.cfg`)

```properties
[DEFAULT]
ConnectionType=acceptor
StartTime=00:00:00
EndTime=23:59:00
FileStorePath=target/data/server
FileLogPath=target/log/server
UseDataDictionary=Y

[SESSION]
BeginString=FIX.4.4
SenderCompID=BROKER
TargetCompID=CLIENT1
SocketAcceptPort=9876
DataDictionary=FIX44.xml
```

### Acceptor Bootstrap

The code is nearly identical to the Initiator, but uses `SocketAcceptor` instead of `SocketInitiator`.

```java
import quickfix.*;
import java.io.FileInputStream;

public class ServerMain {
    public static void main(String[] args) throws Exception {
        SessionSettings settings = new SessionSettings(new FileInputStream("server.cfg"));
        Application application = new ServerApplication(); // Your custom logic
        MessageStoreFactory storeFactory = new FileStoreFactory(settings);
        LogFactory logFactory = new FileLogFactory(settings);
        MessageFactory messageFactory = new DefaultMessageFactory();

        Acceptor acceptor = new SocketAcceptor(application, storeFactory, settings, logFactory, messageFactory);
        System.out.println("Starting QuickFIX/J Acceptor on port 9876...");
        acceptor.start();

        System.in.read();
        acceptor.stop();
    }
}
```
