# Native runtime flavors

Hara L0 is evaluator- and platform-independent. A runtime may install native flavor providers,
but portable code does not acquire native semantics merely by using a core form.

## Provider contract

A namespace selects a provider explicitly with `(:flavor :name)`. Selection is local to that
namespace, is not inherited by required namespaces, and grants no authority. An embedding runtime
separately grants reflection/invocation, classpath mutation, and compilation/class-definition
capabilities.

Providers receive evaluated values at generic evaluator hooks: namespace clauses, native type and
qualified-symbol resolution, construction, member reads/writes/calls, indexed steps, and exception
matching. Providers must normalize failures into stable native-flavor errors while preserving the
original cause. Unsupported providers and denied capabilities must fail deterministically.

Executable Hara source uses `.hal`. Current projects use data manifests named
`project.edn` and `workspace.edn`. The executable `project.hal` descriptor and
`.hara` spelling are legacy migration inputs; `.hrl` and `.hara` are not
executable module extensions.

## JVM flavor

Select the JVM provider in a namespace and import each Java class that the
source uses:

```hara
(ns example.jvm
  (:flavor :jvm)
  (:import [java.lang String RuntimeException]
           [java.awt Point]))
```

Only imported simple class names resolve. A qualified symbol such as
`String/valueOf` resolves a static field or method. Use `(new String "value")`
to call a constructor.

The dot form traverses a value from left to right. A symbol reads a field. A
list calls a method. A one-item vector uses the JVM indexed-access extension:

```hara
(. point x)
(. point x (toString))
(. value child parent)
(. values [0])
```

Persistent Hara values keep their portable lookup and protocol behavior. They
do not fall through to Java reflection.

The host must grant reflection before the provider can read or call Java
members. Classpath and compiler operations require separate grants. Imported
Java exceptions can appear in `catch` forms. Reflection wrappers preserve the
original Java cause.

The public provider namespaces are `hara.native.jvm`,
`hara.native.jvm.reflect`, `hara.native.jvm.classpath`, and
`hara.native.jvm.compiler`. Selecting the JVM flavor does not refer these
namespaces into the current namespace.

## Rust and WASM flavor

The Rust runtime implements the portable evaluator for native and browser
targets. It uses provider interfaces for files, sockets, extensions, and other
host operations. Read the [Rust and WASM runtime mapping](rust-runtime.md) for
its value model, target profiles, provider interfaces, and conformance status.
