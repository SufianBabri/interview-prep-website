# JavaScript

## Functions

Functions are first-class objects, because they can have properties and methods just like any other
object.

What distinguishes them from other objects is that functions can be called. In brief, they are Function objects.

## Hoisting

JavaScript Hoisting refers to the process whereby the interpreter appears to move the declaration of functions,
variables or classes to the top of their scope, prior to execution of the code.

Hoisting allows functions to be safely used in code before they are declared.

:::info
_Variable_ and _class_ declarations are also hoisted, so they too can be referenced before they are declared.
:::

:::note
The term _hoisting_ is not used in any normative specification prose prior to [ECMAScript® 2015 Language
Specification](https://262.ecma-international.org/6.0/).
:::

### `var` hoisting

Only declaration gets hoisted, not initialization.

This means that initialization doesn't happen until the associated line of code is executed, even if the variable was
originally initialized then declared, or declared and initialized in the same line.

```js
console.log(num); // Returns 'undefined' from hoisted var declaration (not 6)
var num; // Declaration
num = 6; // Initialization
console.log(num); // Returns 6 after the line with initialization is executed.
```

:::info
The default initialization of the var is undefined.
:::

If we forget the declaration altogether (and only initialize the value) the variable isn't hoisted. Trying to read the
variable before it is initialized results in a ReferenceError exception.

```js
console.log(num); // Throws ReferenceError exception - the interpreter doesn't know about `num`.
num = 6; // Initialization
```

On the other hand, we can initialize a variable (without declaration) and access it later, and it will work fine:

```js
a = "Cran"; // Initialize a
b = "berry"; // Initialize b

console.log(`${a}${b}`); // 'Cranberry'
```

### `let` and `const` hoisting

Variables declared with let and const are also hoisted but, unlike var, are not initialized with a default value. An
exception will be thrown if a variable declared with let or const is read before it is initialized.

```js
console.log(num); // Throws ReferenceError exception as the variable value is uninitialized
let num = 6; // Initialization
```

### Function and class expression hoisting

Function expressions and class expressions are not hoisted.

```js
// function expression
const getRectArea = function (width, height) {
	return width * height;
};

// unnamed class expression
let Rectangle = class {
	constructor(height, width) {
		this.height = height;
		this.width = width;
	}
};

// named class expression
Rectangle = class Rectangle2 {
	constructor(height, width) {
		this.height = height;
		this.width = width;
	}
};
```

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

### The logical AND operator, &&

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
