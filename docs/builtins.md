# Complete Symbol List

## BuiltinBasic (basic)

### `atom`
Creates a standard atom with the given value.
```hara
(atom ...)
```

### `atom:basic`
```hara
(atom:basic ...)
```

### `compare`
```hara
(compare ...)
```

### `counter`
```hara
(counter ...)
```

### `deref`
Dereferences the given reference object.
```hara
(deref ...)
```

### `flag`
```hara
(flag ...)
```

### `hash`
```hara
(hash ...)
```

### `keyword`
```hara
(keyword ...)
```

### `meta`
```hara
(meta ...)
```

### `realize`
```hara
(realize ...)
```

### `realized?`
```hara
(realized? ...)
```

### `reset!`
Sets the value of atom to new value without regard for the current value. Returns the new value.
```hara
(reset! ...)
```

### `symbol`
```hara
(symbol ...)
```

### `type`
```hara
(type ...)
```

### `volatile`
```hara
(volatile ...)
```

### `with-meta`
```hara
(with-meta ...)
```

## BuiltinCheck (check)

### `boolean?`
```hara
(boolean? ...)
```

### `false?`
```hara
(false? ...)
```

### `nil?`
```hara
(nil? ...)
```

### `true?`
```hara
(true? ...)
```

### `zero?`
```hara
(zero? ...)
```

## BuiltinRef (ref)

### `compare-and-set!`
```hara
(compare-and-set! ...)
```

### `swap!`
```hara
(swap! ...)
```

### `vreset!`
```hara
(vreset! ...)
```

### `vswap!`
```hara
(vswap! ...)
```

## BuiltinCollection (coll)

### `assoc`
```hara
(assoc ...)
```

### `concat`
```hara
(concat ...)
```

### `conj`
```hara
(conj ...)
```

### `cons`
```hara
(cons ...)
```

### `count`
```hara
(count ...)
```

### `dissoc`
```hara
(dissoc ...)
```

### `empty`
```hara
(empty ...)
```

### `first`
```hara
(first ...)
```

### `get`
```hara
(get ...)
```

### `into`
```hara
(into ...)
```

### `keys`
```hara
(keys ...)
```

### `last`
```hara
(last ...)
```

### `merge`
```hara
(merge ...)
```

### `next`
```hara
(next ...)
```

### `nth`
```hara
(nth ...)
```

### `peek`
```hara
(peek ...)
```

### `pop`
```hara
(pop ...)
```

### `rest`
```hara
(rest ...)
```

Returns a non-empty lazy `Seq` containing the values after the first, or `nil`
when no values remain. Hara has no separate `next` operation.

### `seq`
```hara
(seq ...)
```

Returns a non-empty lazy `Seq` over the source, or `nil` when the source is
empty. Every value satisfying `seq?` is guaranteed to have a first item.

### `vals`
```hara
(vals ...)
```

### `zipmap`
```hara
(zipmap ...)
```

## BuiltinInterop (interop)

### `class`
```hara
(class ...)
```

### `new`
```hara
(new ...)
```

## BuiltinLambda (lambda)

### `F`
```hara
(F ...)
```

### `T`
```hara
(T ...)
```

### `apply`
```hara
(apply ...)
```

### `call`
```hara
(call ...)
```

### `comp`
```hara
(comp ...)
```

### `group-by`
```hara
(group-by ...)
```

### `identity`
```hara
(identity ...)
```

### `juxt`
```hara
(juxt ...)
```

### `keep`
```hara
(keep ...)
```

### `map`
```hara
(map ...)
```

### `map:apply`
```hara
(map:apply ...)
```

### `map:entries`
```hara
(map:entries ...)
```

### `map:juxt`
```hara
(map:juxt ...)
```

### `map:keys`
```hara
(map:keys ...)
```

### `map:vals`
```hara
(map:vals ...)
```

### `mapcat`
```hara
(mapcat ...)
```

### `partial`
```hara
(partial ...)
```

### `partition:pair`
```hara
(partition:pair ...)
```

### `pipe`
```hara
(pipe ...)
```

### `reduce`
```hara
(reduce ...)
```

### `reduce-in`
```hara
(reduce-in ...)
```

## BuiltinOps (ops)

### `*`
```hara
(* ...)
```

### `+`
```hara
(+ ...)
```

### `-`
```hara
(- ...)
```

### `/`
```hara
(/ ...)
```

### `<`
```hara
(< ...)
```

### `<=`
```hara
(<= ...)
```

### `=`
```hara
(= ...)
```

### `>`
```hara
(> ...)
```

### `>=`
```hara
(>= ...)
```

### `dec`
```hara
(dec ...)
```

### `inc`
```hara
(inc ...)
```

### `max`
```hara
(max ...)
```

### `min`
```hara
(min ...)
```

### `mod`
```hara
(mod ...)
```

### `quot`
```hara
(quot ...)
```

### `rem`
```hara
(rem ...)
```

## BuiltinRuntime (rt)

### `eval`
```hara
(eval ...)
```

### `load`
```hara
(load ...)
```

### `sys:add-paths`
```hara
(sys:add-paths ...)
```

### `sys:remove-paths`
```hara
(sys:remove-paths ...)
```

## BuiltinStruct (struct)

### `hash-map`
```hara
(hash-map ...)
```

### `hash-set`
```hara
(hash-set ...)
```

### `list`
```hara
(list ...)
```

### `vector`
```hara
(vector ...)
```

## BuiltinTime (time)

### `now`
```hara
(now ...)
```

## BuiltinNamespace (ns)

### `ns:aliases`
```hara
(ns:aliases ...)
```

### `ns:create`
```hara
(ns:create ...)
```

### `ns:find`
```hara
(ns:find ...)
```

### `ns:imports`
```hara
(ns:imports ...)
```

### `ns:list`
```hara
(ns:list ...)
```

### `ns:map`
```hara
(ns:map ...)
```

### `ns:name`
```hara
(ns:name ...)
```

## BuiltinUtil (util)

### `pr-str`
```hara
(pr-str ...)
```

### `println`
```hara
(println ...)
```

## Macro (macro)

### `.`
```hara
(. ...)
```

### `and`
```hara
(and ...)
```

### `case`
```hara
(case ...)
```

### `cond`
```hara
(cond ...)
```

### `def`
```hara
(def ...)
```

### `do`
```hara
(do ...)
```

### `fn`
```hara
(fn ...)
```

### `for`
```hara
(for ...)
```

### `if`
```hara
(if ...)
```

### `let`
```hara
(let ...)
```

### `loop`
```hara
(loop ...)
```

### `or`
```hara
(or ...)
```

### `quote`
```hara
(quote ...)
```

### `recur`
```hara
(recur ...)
```

### `throw`
```hara
(throw ...)
```

### `try`
```hara
(try ...)
```

### `var`
```hara
(var ...)
```
