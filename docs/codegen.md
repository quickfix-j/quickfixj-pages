---
id: codegen
title: Message Code Generation
sidebar_position: 4.9
---

# Customizing Message Code Generation

QuickFIX/J includes message libraries generated from standard FIX meta data XML files. However, there are several ways to customize code generation.

### Modifying the Data Dictionary
The simplest customization is to modify one or more data dictionaries (e.g., `FIX44.xml`) and rebuild QuickFIX/J. This allows you to add custom fields, define new messages not included in the standard specification, and change whether fields are required or optional.

### Advanced Customization (MessageCodeGenerator)
You can do more advanced customization using the `quickfix.codegen.MessageCodeGenerator` class. You can define code generation tasks (`quickfix.codegen.MessageCodeGenerator.Task`) that customize various aspects of the generation process.

| Property | Description |
| :--- | :--- |
| `specification` | Path to the XML file containing the FIX meta data (e.g., `/my/dir/CUSTOM_FIX.xml`). |
| `transformDirectory` | Path to the XSLT transforms used to generate the source code. |
| `outputBaseDirectory`| The base directory where generated source code will be placed. |
| `messagePackage` | The Java package for the generated messages (e.g., `my.message.fix42`). |
| `fieldPackage` | The Java package for the generated fields. |
| `orderedFields` | Generates message classes where regular body fields are ordered exactly as specified in the meta. Some exchanges require strict ordering. |
| `decimalGenerated` | Generates `BigDecimal` for price, quantity, and similar fields instead of `double`. |
| `utcTimestampPrecision`| The default `UtcTimestampPrecision` used during field code generation. |

To generate your own message library, create a program that uses `MessageCodeGenerator` to process your `Task`, or use the QFJ Maven/Ant scripts. You may also need to write a custom `MessageFactory` implementation and reference it in the session configuration.
