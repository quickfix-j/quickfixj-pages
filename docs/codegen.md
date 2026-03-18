---
id: codegen
title: Message Code Generation
sidebar_position: 4.9
---

# Customizing Message Code Generation

QuickFIX/J includes message libraries generated from standard FIX meta data XML files. However, there are several ways to customize code generation.

## For FIX Versions Prior to FIX Latest

### Option 1: Fork and Modify Data Dictionaries
You may fork the QuickFIX/J repository, modify one or more data dictionaries (e.g., `FIX44.xml`), and rebuild QFJ. This allows you to add custom fields, define new messages, and change whether fields are required or optional. This approach is good for prototyping but is not recommended long-term due to the need to maintain a fork.

### Option 2: Create an Independent Message Project (Recommended)
You may create an independent project to build only your QuickFIX/J Messages and Fields using the tools provided by the QuickFIX/J project. See the readme in the QuickFIX/J Messages module (`quickfixj-messages`) for further details. This allows you to manage dependencies on the QuickFIX/J core runtime independent of the custom Message and Field packages.

### Advanced: MessageCodeGenerator
You can do more advanced customization using the `quickfix.codegen.MessageCodeGenerator` class. You can define code generation tasks (`quickfix.codegen.MessageCodeGenerator.Task`) that customize various aspects of the generation process.

| Property | Description |
| :--- | :--- |
| `specification` | Path to the XML file containing the FIX meta data (e.g., `/my/dir/CUSTOM_FIX.xml`). |
| `transformDirectory` | Path to the XSLT transforms used to generate the source code. Usually references the standard QFJ XSLT templates, but you can supply modified templates. |
| `outputBaseDirectory`| The base directory where generated source code will be placed. |
| `overwrite` | Controls whether existing files are overwritten. Usually `true`. |
| `messagePackage` | The Java package for the generated messages (e.g., `my.message.fix42`). |
| `fieldPackage` | The Java package for the generated fields. |
| `orderedFields` | Generates message classes where regular body fields are ordered exactly as specified in the meta. Some exchanges require strict ordering. |
| `decimalGenerated` | Generates `BigDecimal` for price, quantity, and similar fields instead of `double`. |
| `utcTimestampPrecision`| The default `UtcTimestampPrecision` used during field code generation. |

The most complex customization is to modify the XSLT templates used to generate the message source code.

You can also build a QuickFIX/J Data Dictionary and generate code directly from a **FIX Orchestra** specification using the QuickFIX/J project tools. See the readme in the `quickfixj-messages` module for further details.

## For FIX Latest

It is recommended to create an independent project to build only your QuickFIX/J Messages and Fields using the tools provided by the QuickFIX/J project. See the readme in the QuickFIX/J Messages module (`quickfixj-messages`) for further details. This allows you to manage dependencies on the QuickFIX/J core runtime independent of the custom Message and Field packages.
