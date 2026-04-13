---
id: installation
title: Installation & Testing
sidebar_position: 2.5
---

# Installation & Testing

## Runtime Dependencies

### Java Virtual Machine:
JVM compatible with Java 1.8 or higher (Java 11 or 21 LTS recommended for modern deployments).

### Required run-time libraries:
*   `quickfixj-core.jar`
*   `quickfixj-messages-fix40.jar` through `quickfixj-messages-fixlatest.jar`
    *Or simply use `quickfixj-all.jar` which includes core and all message JARs.*
*   `mina-core-2.2.x.jar` (Socket handling via Java NIO)
*   `slf4j-api.jar` (SLF4J library for JDK logging)

### Optional run-time libraries:
*   `log4j.jar`
*   `HikariCP.jar` (Required for JDBC connection pooling, since QFJ 3.0.0)
*   `sleepycat-je.jar` (Needed if the SleepyCat JE message store is used)

## Building QuickFIX/J

These instructions are for developers who don't want to use the prebuilt binaries or intend to modify and rebuild the QuickFIX/J code.

The repository includes a Maven wrapper (`./mvnw`), so you do not need to install Maven separately. Building from source requires Java 8+.

1. **Checkout the Code:** Clone the repository.
   ```bash
   git clone https://github.com/quickfix-j/quickfixj.git
   cd quickfixj
   ```
2. **Run Maven:** Run `./mvnw package` to build the QuickFIX/J and examples jar files. This generates all the FIX message-related code using XML data dictionaries.
   ```bash
   ./mvnw clean package
   ```
3. **BigDecimal Option:** To use `java.math.BigDecimal` instead of `double` for fields like price and quantity, pass the `-Dgenerator.decimal` option:
   ```bash
   ./mvnw clean package -Dgenerator.decimal=true
   ```

## Generating the database for JDBC based store and log

Everything needed to generate your database is in the `src/main/resources/config/sql` subdirectories.

For MySQL, there are `create_mysql.sh` and `create_mysql.bat` scripts. These try to generate the database using the `root` account with no password. If you need a different account/password, edit the script. Similar scripts are provided for MSSQL, PostgreSQL, and Oracle.

**Special notes for Oracle:**
Oracle treats empty strings as null values. Null values are not allowed for primary key fields (`beginstring`, `sendercompid`, `targetcompid`, `session_qualifier`, `msgseqnum`). Therefore, `session_qualifier` has been set to a non-empty string for Oracle scripts. Also, for string fields, the `VARCHAR2` data type should always be used.

## Testing QuickFIX/J

The development of QuickFIX/J has been driven by a suite of functional acceptance tests and unit tests.

*   **Unit Tests:** Written in JUnit. Run them via `mvn test`.
*   **Functional Acceptance Tests:** Scripted FIX messages pumped into a running FIX server, based on the official FIX Session-level Test Cases and Expected Behaviors document.
