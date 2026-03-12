---
id: repeating-groups
title: Repeating Groups
sidebar_position: 4.1
---

# Repeating Groups

The FIX Protocol heavily relies on repeating groups for data like market data entries, order legs, and allocations. QuickFIX/J provides type-safe nested classes to easily create, append, and read these repeating groups.

## Creating Messages with Repeating Groups

QuickFIX/J automatically manages the count field (the field indicating the number of groups, such as `NoMDEntries` in market data). You create a group instance from the inner class of the parent message, set its fields, and add it to the message.

**Example: Adding Market Data Entries**
```java
import quickfix.field.*;
import quickfix.fix42.MarketDataSnapshotFullRefresh;

// 1. Create the parent message
MarketDataSnapshotFullRefresh message = new MarketDataSnapshotFullRefresh(new Symbol("QF"));

// 2. Create a group instance (NoMDEntries is the count field)
MarketDataSnapshotFullRefresh.NoMDEntries group = new MarketDataSnapshotFullRefresh.NoMDEntries();

// 3. Populate and add the first group
group.set(new MDEntryType(MDEntryType.BID));
group.set(new MDEntryPx(12.32));
group.set(new MDEntrySize(100));
message.addGroup(group); // QuickFIX/J automatically sets NoMDEntries = 1

// 4. Populate and add the second group
group.set(new MDEntryType(MDEntryType.OFFER));
group.set(new MDEntryPx(12.45));
group.set(new MDEntrySize(200));
message.addGroup(group); // QuickFIX/J automatically sets NoMDEntries = 2
```

## Reading Messages with Repeating Groups

To read groups from an incoming message, you first retrieve the count field to determine how many entries exist, then iterate through them using `getGroup(index, group)`. 

> **Important:** Group indexing in QuickFIX/J is **1-based**.

**Example: Reading Market Data Entries**
```java
import quickfix.field.*;
import quickfix.fix42.MarketDataSnapshotFullRefresh;

public void onMessage(MarketDataSnapshotFullRefresh message, SessionID sessionID) throws quickfix.FieldNotFound {
    // 1. Get the number of entries
    NoMDEntries noMDEntries = new NoMDEntries();
    message.get(noMDEntries);
    int count = noMDEntries.getValue();
    
    System.out.println("Received " + count + " market data entries.");

    // 2. Initialize the group structure and field objects
    MarketDataSnapshotFullRefresh.NoMDEntries group = new MarketDataSnapshotFullRefresh.NoMDEntries();
    MDEntryType type = new MDEntryType();
    MDEntryPx px = new MDEntryPx();
    MDEntrySize size = new MDEntrySize();

    // 3. Iterate through the groups (1-based index)
    for (int i = 1; i <= count; i++) {
        message.getGroup(i, group); // Loads the group at index i
        
        group.get(type);
        group.get(px);
        
        // Check for optional fields inside the group
        if (group.isSetField(size)) {
            group.get(size);
        }

        System.out.println("Entry " + i + ": Type=" + type.getValue() + ", Px=" + px.getValue());
    }
}
```

### Key Points
* **Automatic Counting:** You do not need to manually instantiate and set the value of the count field (e.g., `new NoMDEntries(2)`). Calling `addGroup()` handles this automatically to ensure consistency.
* **1-Based Indexing:** When retrieving groups via `getGroup(int index, Group group)`, the first entry is at index `1`.
* **Type Safety:** Using the generated message and group classes provides type-safe setters and getters for FIX fields, reducing runtime errors.
