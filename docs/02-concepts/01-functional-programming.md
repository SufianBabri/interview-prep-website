# Functional Programming

In computer science, functional programming is a programming paradigm where programs are constructed by applying and
composing functions.

## Higher-Order Functions

A higher-order function does either one or both of the following:

-   Takes a function as an argument
-   Returns a function

:::info

`Array.map()` and `Array.filter()` are both examples of a Higher-Order functions.

:::

## Currying

It simply means evaluating functions with multiple arguments and decomposing them into a sequence of functions with a
single argument.

Currying is a transformation of functions that translates a function from callable as f(a, b, c) into callable as f(a)(
b)(c).

:::info
For a given function `add` below

```js
const add = (a, b) => a + b;
```

can be re-written as curry like following:

```js
const add = a => b => a + b;
```

:::

## Pure Function

A function which returns the same result for the same argument.

Benefits of Pure Functions:

-   Self-documenting (they only rely on the arguments passed)
-   Easily testable (we don't need to set global state before calling them)
-   Concurrency (don't rely on global variables)
-   Cacheable (for the same argument, they give the same result)

## Immutability

An **immutable** object is an object that can't be modified after it's created. Conversely, a **mutable** object is any
object which can be modified after it's created.

Benefits of immutability:

-   Predictability (if we pass an object to a function, we are sure that that object will not get changed)
-   Faster change detection (to update a property, a new object needs to be created. This means that it can be easily
    detected using object comparison)
-   Concurrency (if we know that the function doesn't mutate data, we can safely call it in parallel)

Drawbacks of immutability:

-   Performance (if dealing with large number of objects, it can impact performance)
-   Memory overhead (caused by copying objects. Immutability libraries optimize this somewhat)
