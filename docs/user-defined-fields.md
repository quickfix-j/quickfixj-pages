---
id: user-defined-fields
title: User Defined Fields
sidebar_position: 4.2
---

# User Defined Fields (UDFs)

In the FIX protocol, tag numbers 5000 and above are reserved for User Defined Fields (UDFs) by individual exchanges or counterparties. QuickFIX/J provides mechanisms to handle these fields both dynamically and in a type-safe manner.

## 1. Type-Safe Approach (Recommended)

To maintain compile-time safety, you can define your own field classes by extending the appropriate QuickFIX/J base field type (e.g., `StringField`, `DoubleField`, `IntField`, `CharField`).

**Example: Defining Custom Fields**
```java
// MyStringField.java
import quickfix.StringField;

public class MyStringField extends StringField {
    public static final int FIELD = 6123;
    
    public MyStringField() { 
        super(FIELD); 
    }
    
    public MyStringField(String data) { 
        super(FIELD, data); 
    }
}

// MyPriceField.java
import quickfix.DoubleField;

public class MyPriceField extends DoubleField {
    public static final int FIELD = 8756;
    
    public MyPriceField() { 
        super(FIELD); 
    }
    
    public MyPriceField(double data) { 
        super(FIELD, data); 
    }
}
```

**Example: Using Custom Fields**
```java
import quickfix.fix44.NewOrderSingle;

NewOrderSingle message = new NewOrderSingle(...);

// Setting custom fields
message.setField(new MyStringField("CustomValue"));
message.setField(new MyPriceField(14.54));

// Getting custom fields
MyStringField stringField = new MyStringField();
if (message.isSetField(stringField)) {
    message.getField(stringField);
    System.out.println(stringField.getValue());
}
```

## 2. Non-Type-Safe Approach (Dynamic)

If you don't want to create separate classes for every custom field, you can set and get fields directly by instantiating the base field classes with the required tag number.

```java
import quickfix.StringField;
import quickfix.DoubleField;
import quickfix.fix44.NewOrderSingle;

NewOrderSingle message = new NewOrderSingle(...);

// Setting a field dynamically
message.setField(new StringField(6123, "CustomValue"));
message.setField(new DoubleField(8756, 14.54));

// Getting a field dynamically
if (message.isSetField(6123)) {
    StringField field = message.getField(new StringField(6123));
    System.out.println(field.getValue());
}
```

## 3. Data Dictionary Configuration

To ensure the QuickFIX/J engine accepts these fields during message validation (when `UseDataDictionary=Y`), you **must** add them to your XML Data Dictionary file (e.g., `FIX44.xml`).

First, define the field types in the `<fields>` section:
```xml
<fields>
  <!-- Standard fields... -->
  <field number="6123" name="MyStringField" type="STRING" />
  <field number="8756" name="MyPriceField" type="PRICE" />
</fields>
```

Then, add them to the relevant messages in the `<messages>` section:
```xml
<messages>
  <message name="NewOrderSingle" msgtype="D" msgcat="app">
    <!-- Standard fields... -->
    <field name="MyStringField" required="N" />
    <field name="MyPriceField" required="N" />
  </message>
</messages>
```

If you do not update the Data Dictionary and `UseDataDictionary=Y` is enabled, the QuickFIX/J engine will reject incoming messages containing these custom tags with a "Tag not defined for this message type" error.
