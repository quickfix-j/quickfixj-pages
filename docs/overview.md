---
id: overview
title: Overview
sidebar_position: 1
---

# QuickFIX/J Overview

Welcome to the official documentation for **QuickFIX/J**, the premier open-source Java implementation of the FIX (Financial Information eXchange) Protocol.

## What is QuickFIX/J?

QuickFIX/J is a full-featured messaging engine for the FIX protocol, implemented entirely in Java. It is an open-source project based on the popular C++ QuickFIX engine, but refactored and optimized for the Java Virtual Machine.

From buy-side asset managers connecting to broker networks to sell-side exchanges managing thousands of inbound connections, QuickFIX/J serves as the reliable, low-latency backbone of countless trading architectures globally.

### Key Features

* **Full FIX Protocol Coverage:** Supports FIX versions 4.0 through 4.4, 5.0 / 5.0 SP1 / 5.0 SP2, and FIXLatest (including FIXT 1.1).
* **100% Java:** Leverages the power and portability of the JVM with no native dependencies (no JNI required).
* **High Performance & Scalability:** Engineered with multi-threading, optimized message parsing, and asynchronous NIO network communications via **Apache MINA**.
* **Metadata-Driven:** Employs an XML-based DataDictionary for metadata-driven parsing, validation, and type-safe Java code generation for messages and fields.
* **Protocol Customization:** Easily adapt to non-standard exchange specifications by defining new messages, fields, and constraints in the DataDictionary.
* **Pluggable Architecture:** Completely customizable interfaces for message stores (File, JDBC, Memory, Sleepycat) and logging (SLF4J, Log4j, File, Console).
* **JMX Management:** Embedded Java Management Extensions (JMX) MBeans provide real-time engine monitoring, session management, and configuration.
* **Failover & High Availability:** Built-in session scheduling, connection recovery, and failover capabilities for demanding production environments.

## The FIX Protocol

The Financial Information eXchange (FIX) protocol is an electronic communications protocol initiated in 1992 for international real-time exchange of information related to the securities transactions and markets. It has become the *de facto* standard for pre-trade and trade communication globally.

QuickFIX/J abstracts the complexities of session management, message routing, sequence number tracking, and connection recovery. This abstraction layer enables developers to focus purely on business logic—such as order routing and market data processing—rather than the intricacies of socket programming and protocol heartbeats.

## Getting Started

To start using QuickFIX/J, add the following dependencies to your `pom.xml`. QuickFIX/J provides separate artifacts for the core engine and the specific FIX version message definitions.

```xml
<!-- Core Engine -->
<dependency>
    <groupId>org.quickfixj</groupId>
    <artifactId>quickfixj-core</artifactId>
    <version>3.0.0</version>
</dependency>

<!-- FIX 4.4 Message Definitions (Add versions as needed) -->
<dependency>
    <groupId>org.quickfixj</groupId>
    <artifactId>quickfixj-messages-fix44</artifactId>
    <version>3.0.0</version>
</dependency>
```

For more details on the repository, source code, and release notes, visit our [GitHub Repository](https://github.com/quickfix-j/quickfixj).

## Community and Support

QuickFIX/J is an active open-source project maintained by the community.
* **Issues & Bug Tracking:** Please report bugs or feature requests on the [GitHub Issue Tracker](https://github.com/quickfix-j/quickfixj/issues).
* **Mailing List:** Join the community discussion on the SourceForge mailing list.
* **Stack Overflow:** Ask questions using the `quickfixj` tag.
