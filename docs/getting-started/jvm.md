# Get started with the JVM

Use the JVM path when a Hara program needs Java libraries, Java classes, Maven
builds, or the Truffle runtime. Hara remains Hara: JVM access is an explicit
native flavor provided by the host, not a change to the portable language.

## What this path gives you

The JVM host is useful for three related jobs:

- running Hara on the Truffle implementation;
- calling deliberately imported Java classes from Hara source;
- contributing to the Java runtime and running its conformance tests.

Portable forms, persistent values, protocols, functions, atoms, iterators,
promises, bytes, and strings keep their Hara behavior. Java reflection and
class loading stay behind explicit provider and capability boundaries.

## Install the prerequisites

Contributor builds require JDK 21 and Maven. Check both tools before building:

```shell
java -version
mvn -version
```

The output should show a JDK 21 runtime and a working Maven installation. A JRE
alone is not enough for compiler and build tasks.

## Build the Truffle runtime

From the Hara repository root, run:

```shell
mvn -f java/pom.xml -Ptruffle package
```

The build produces:

```text
java/target/hara-truffle.jar
```

Use the checked-in launcher from the repository root for the normal CLI and
REPL workflow:

```shell
./hara
```

Evaluate a form without entering the REPL:

```shell
./hara eval '(+ 19 23)'
```

Expected result:

```text
42
```

## Select the JVM flavor

A namespace opts into the JVM provider with `(:flavor :jvm)` and imports every
Java class it uses:

```hara
(ns example.jvm
  (:flavor :jvm)
  (:import [java.lang String RuntimeException]
           [java.awt Point]))
```

Flavor selection belongs to that namespace. A required namespace does not
inherit the caller's flavor, and selecting a flavor does not itself grant
reflection, classpath mutation, compilation, or class-definition authority.
The embedding host controls those capabilities separately.

## Construct and call Java values

Only imported simple class names resolve. Construct a Java object with `new`:

```hara
(def point (new Point 10 20))
```

A qualified symbol such as `String/valueOf` resolves a static field or method:

```hara
(String/valueOf 42)
```

The dot form walks a value from left to right. A symbol reads a field and a list
calls a method:

```hara
(. point x)
(. point (toString))
```

The JVM provider also supports its indexed-access extension with a one-item
vector:

```hara
(. values [0])
```

Keep the distinction clear: ordinary Hara vectors, maps, sets, lists, and other
persistent values continue to use Hara lookup and protocol behavior. They do
not silently fall through to Java reflection.

## Handle Java failures

Imported Java exception classes can appear in Hara `catch` forms. Reflection
wrappers preserve the original Java cause so host failures remain inspectable.
Unsupported classes, missing imports, denied reflection, and invalid member
operations should fail deterministically rather than guessing another meaning.

When a call fails, check the boundary in this order:

1. Is the namespace using `(:flavor :jvm)`?
2. Is the class explicitly imported?
3. Is the member name correct for the value or class?
4. Has the host granted the required reflection or compiler capability?
5. Is the code accidentally treating a persistent Hara value as a Java value?

## Work with Java libraries

A Hara JVM project can declare Maven libraries directly in `project.edn`. The
shape deliberately follows Leiningen's coordinate-and-version vectors while
keeping JVM libraries separate from portable Hara packages:

```clojure
{:hara/type :project
 :hara/version "1.0.0"
 :project/id example.jvm-app
 :project/version "0.1.0"
 :project/source-paths ["src"]
 :project/test-paths ["test"]
 :project/extension-paths []
 :project/main example.app
 :project/dependencies {}
 :project/capabilities #{:jvm/reflection}

 :jvm/dependencies
 [[org.apache.commons/commons-lang3 "3.12.0"]
  [org.chipsalliance/chisel_2.13 "6.7.0"]]
 :jvm/source-paths ["src-java"]
 :jvm/target-path "target/classes"}
```

Versions are exact Maven versions, not ranges. `:jvm/reflection` grants the
project's explicitly selected JVM namespaces permission to import and call
host classes. Merely declaring a dependency does not grant reflection.

Run the normal project commands—no project `pom.xml` is required:

```shell
hara project sync
hara project run
hara project test
hara --offline repl
```

`sync` resolves the direct and transitive graph from Maven Central into the
standard local Maven cache. `run`, `test`, and a REPL started in the project
resolve the same graph automatically, compile every `.java` file under
`:jvm/source-paths` with the JDK 21 compiler, and add both the artifacts and
`:jvm/target-path` to a project-scoped classloader. Use
`hara project sync --offline`, `hara --offline project run`, or
`hara --offline repl` to require already-cached artifacts.

A practical project boundary is:

```text
my-jvm-project/
  project.edn
  workspace.edn
  src/
    example/
      app.hal
  src-java/
    example/
      NativeBridge.java
```

Use Hara namespaces to express the program. Keep host-specific interop and any
Java/Scala adaptation in a small boundary namespace and Java bridge so the rest
of the project remains portable and testable on another runtime.

For example:

```hara
(ns example.clock.jvm
  (:flavor :jvm)
  (:import [java.time Instant]))

(defn now-string []
  (. (Instant/now) (toString)))
```

Code outside `example.clock.jvm` can call `now-string` without needing to know
how the host obtained the value.

This is a focused Lein-style project path, not an implementation of every
Leiningen feature. The current contract supports Maven Central,
`group/artifact` plus exact version coordinates, Java source compilation, the
standard local cache, and offline reuse. Custom repositories, classifiers,
dependency exclusions, profiles, and publishing remain future additions.

## Run the JVM tests

Run the Java test suite:

```shell
mvn -q -f java/pom.xml test
```

Run the focused Truffle L0 conformance test:

```shell
mvn -q -f java/pom.xml -Ptruffle \
  -Dtest=hara.truffle.HaraL0ConformanceTest test
```

Use the broader developer guide for test slices, native-image builds, tracing,
and contributor troubleshooting.

## Decide whether the JVM is the right host

Choose the JVM when Java interop is part of the product or when you are working
on the Truffle implementation. Choose the Rust CLI for a small native runtime
without a JVM dependency. Choose WebAssembly for browser embedding. The source
language remains the same, but each host exposes a different set of explicit
providers.

## Continue

Read [Native runtime flavors](../reference/native-flavors.md) for the provider
contract, [Java and Rust APIs](../javadocs.md) for host-facing APIs, and the
[developer guide](../development.md) for build and test workflows.
