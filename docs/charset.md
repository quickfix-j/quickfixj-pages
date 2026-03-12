---
id: charset
title: Character Sets
sidebar_position: 4.8
---

# Configuring Character Sets

QuickFIX/J has limited support for configuring character sets to be used in decoding and encoding messages. 

By default, QuickFIX/J is configured to use the **ISO-8859-1** character set. 

This can be modified at the JVM level (not per session) by using the following method:

```java
org.quickfixj.CharsetSupport.setCharset("UTF-8");
```

*Note: The use of multibyte characters in FIX messages is not officially supported by the base FIX specification for many versions, although some users modify their code or configurations to allow it for specific counterparty requirements.*
