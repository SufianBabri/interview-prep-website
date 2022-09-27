# JavaScript

## Spread operator

It allows an iterable to expand. It is useful in copying or updating an object.

For example, we can update a person object like this:

```js
const person = { name: "John", age: 30 };
const updated = { ...person, age: 32 };
console.log(updated); // { name: "John", age: 32 }
```

:::note

Spread operator makes a shallow copy of non-primitive data (e.g. array, object, etc).

```js
const person = {
	name: { first: "John", last: "Smith" }
};
const updated = { ...person };
updated.name.first = "Andy";

console.log(person); // { first: "Andy", last: "Smith" }
```

:::

## Truthy

A truthy value is a value that is considered true when encountered in a Boolean context.

:::info
All values **except** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN` are truthy.
:::

## The logical AND operator, &&

If the first object is truthy, the logical AND operator returns the second operand:

```js
const animal = true && "cat"
// animal = "cat"

const animal = [] && "cat"
// animal = "cat"
```

## Immutability in JavaScript

In JavaScript, like in most other languages, strings are immutable (can not change). For example:

```js
let name = "John";
let newName = name.toUpperCase(); // method returns a new string
```

Objects and arrays are mutable (changeable). For example:

```js
const book = {};
book.title = "some-title"; // title property is changed (i.e. object has mutated)
```
