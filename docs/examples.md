---
id: examples
title: Examples & Utilities
sidebar_position: 8
---

# Example Applications & Utilities

QuickFIX/J comes with several example applications located in the `quickfix/examples` directory. They are provided as tutorials on how to build applications with QuickFIX/J.

*   **Executor:** A very simple order execution simulator. It only supports limit orders and always fills them completely.
*   **Banzai:** A simple trading client UI. It can be used with the Executor to see a simple example of using QuickFIX/J on both the buy and sell side of an order execution.

## Determining your QFJ version

The QuickFIX/J version number can be determined by running the core JAR file from the command line:

```bash
java -jar quickfixj-core-2.3.1.jar

# Output:
# Version: 2.3.1
```
