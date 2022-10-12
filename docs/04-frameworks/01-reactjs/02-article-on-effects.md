# You Might Not Need an Effect

This is the summary of the original article posted at [React.js website](https://beta.reactjs.org/learn/you-might-not-need-an-effect).

## Updating state based on props or state

When something can be calculated from the existing props or state, don't put it in state. Instead, calculate it during rendering.
For instance, instead of doing:

```js
function Form() {
	const [firstName, setFirstName] = useState("Taylor");
	const [lastName, setLastName] = useState("Swift");

	// highlight-start
	// 🔴 Avoid: redundant state and unnecessary Effect
	const [fullName, setFullName] = useState("");
	useEffect(() => {
		setFullName(firstName + " " + lastName);
	}, [firstName, lastName]);
	// highlight-end
	// ...
}
```

Do this:

```js
function Form() {
	const [firstName, setFirstName] = useState("Taylor");
	const [lastName, setLastName] = useState("Swift");
	// highlight-start
	// ✅ Good: calculated during rendering
	const fullName = firstName + " " + lastName;
	// highlight-end
	// ...
}
```

## Caching expensive calculations

This component computes visibleTodos by taking the todos it receives by props and filtering them according to the filter prop. You might feel tempted to store the result in a state variable and update it in an Effect:

```js
function TodoList({ todos, filter }) {
	const [newTodo, setNewTodo] = useState("");

	// highlight-start
	// 🔴 Avoid: redundant state and unnecessary Effect
	const [visibleTodos, setVisibleTodos] = useState([]);
	useEffect(() => {
		setVisibleTodos(getFilteredTodos(todos, filter));
	}, [todos, filter]);
	// highlight-end

	// ...
}
```

Like in the earlier example, this is both unnecessary and inefficient. First, remove the state and the Effect:

```js
function TodoList({ todos, filter }) {
	const [newTodo, setNewTodo] = useState("");
	// highlight-start
	// ✅ This is fine if getFilteredTodos() is not slow.
	const visibleTodos = getFilteredTodos(todos, filter);
	// highlight-end
	// ...
}
```

In case `getFilteredTodos()` is slow, or you have a lot of todos, we can memoize this expensive calculation like so:

```js
// ✅ Does not re-run getFilteredTodos() unless todos or filter change
const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
```

## Resetting all state when a prop changes

Instead of resetting the state when the prop changes:

```js
export default function ProfilePage({ userId }) {
	const [comment, setComment] = useState("");

	// highlight-start
	// 🔴 Avoid: Resetting state on prop change in an Effect
	useEffect(() => {
		setComment("");
	}, [userId]);
	// highlight-end

	// ...
}
```

Use the `key` attribute to tell React that it's a conceptually different object:

```jsx
export default function ProfilePage({ userId }) {
	return (
		<Profile
			userId={userId}
			// highlight-start
			key={userId}
			// highlight-end
		/>
	);
}

function Profile({ userId }) {
	// highlight-start
	// ✅ This and any other state below will reset on key change automatically
	const [comment, setComment] = useState("");
	// highlight-start
	// ...
}
```

:::info
Normally, React preserves the state when the same component is rendered in the same spot.

By passing `userId` as a **key** to the `Profile` component, you're asking React to treat two Profile components with different `userId` as two different components that should not share any state. Whenever the key (which you've set to `userId`) changes, React will recreate the DOM and reset the state of the Profile component and all of its children.

As a result, the `comment` field will clear out automatically when navigating between profiles.
:::

## Adjusting some state when a prop changes

Sometimes, you might want to reset or adjust a part of the state on a prop change, but not all of it.

For example, if the items prop is changed, the selection state it reset:

```js
function List({ items }) {
	const [isReverse, setIsReverse] = useState(false);
	const [selection, setSelection] = useState(null);

	// highlight-start
	// 🔴 Avoid: Adjusting state on prop change in an Effect
	useEffect(() => {
		setSelection(null);
	}, [items]);
	// highlight-end
	// ...
}
```

A better approach is to update the state in the render function:

```js
function List({ items }) {
	const [isReverse, setIsReverse] = useState(false);
	const [selection, setSelection] = useState(null);

	// highlight-start
	// Better: Adjust the state while rendering
	const [prevItems, setPrevItems] = useState(items);
	if (items !== prevItems) {
		setPrevItems(items);
		setSelection(null);
	}
	// highlight-end
	// ...
}
```

:::tip
When you update a component during rendering, React throws away the returned JSX and immediately retries rendering.

To avoid very slow cascading retries, React only lets you update the _same_ component's state during a render. If you update another component's state during a render, you'll see an error. A condition like `items !== prevItems` is necessary to avoid loops.
:::

An even better approach is to calculate everything during rendering.

```js
function List({ items }) {
	const [isReverse, setIsReverse] = useState(false);
	// highlight-start
	const [selectedId, setSelectedId] = useState(null);
	// ✅ Best: Calculate everything during rendering
	const selection = items.find(item => item.id === selectedId) ?? null;
	// highlight-end
	// ...
}
```

Now there is no need to “adjust” the state at all.

:::tip
No matter how you do it, adjusting state based on props or other state makes your data flow more difficult to understand and debug.

Always check whether you can [reset all state with a key](#resetting-all-state-when-a-prop-changes) or [calculate everything during rendering](#adjusting-some-state-when-a-prop-changes) instead.
:::

## Sharing logic between event handlers

Let's say you have a product page with two buttons (Buy and Checkout) that both let you buy that product. You want to show a notification whenever the user puts the product in the cart. Adding the showNotification() call to both buttons' click handlers feels repetitive, so you might be tempted to place this logic in an Effect:

```js
function ProductPage({ product, addToCart }) {
	// highlight-start
	// 🔴 Avoid: Event-specific logic inside an Effect
	useEffect(() => {
		if (product.isInCart) {
			showNotification(`Added ${product.name} to the shopping cart!`);
		}
	}, [product]);
	// highlight-end

	function handleBuyClick() {
		addToCart(product);
	}

	function handleCheckoutClick() {
		addToCart(product);
		navigateTo("/checkout");
	}
	// ...
}
```

This Effect is unnecessary. It will also most likely cause bugs. For example, let's say that your app “remembers” the shopping cart between the page reloads. If you add a product to the cart once and refresh the page, the notification will appear again. It will keep appearing every time you refresh that product's page.

So you should invoke this logic from the event handlers, like so:

```js
function ProductPage({ product, addToCart }) {
	// highlight-start
	// ✅ Good: Event-specific logic is called from event handlers
	function buyProduct() {
		addToCart(product);
		showNotification(`Added ${product.name} to the shopping cart!`);
	}
	// highlight-end

	function handleBuyClick() {
		// highlight-next-line
		buyProduct();
	}

	function handleCheckoutClick() {
		// highlight-next-line
		buyProduct();
		navigateTo("/checkout");
	}
	// ...
}
```

## Sending a POST request

This is again similar to the previous point, logic of event-handlers shouldn't go in useEffect.

```js
function Form() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	// highlight-start
	// ✅ Good: This logic should run because the component was displayed
	useEffect(() => {
		post("/analytics/event", { eventName: "visit_form" });
	}, []);
	// highlight-end

	// highlight-start
	// 🔴 Avoid: Event-specific logic inside an Effect
	const [jsonToSubmit, setJsonToSubmit] = useState(null);
	useEffect(() => {
		if (jsonToSubmit !== null) {
			post("/api/register", jsonToSubmit);
		}
	}, [jsonToSubmit]);
	// highlight-end

	function handleSubmit(e) {
		e.preventDefault();
		setJsonToSubmit({ firstName, lastName });
	}
	// ...
}
```

:::tip
When you choose whether to put some logic into an event handler or an Effect, the main question you need to answer is _what kind of logic_ it is from the user's perspective.

If this logic is caused by a particular interaction, keep it in the event handler. If it's caused by the user seeing the component on the screen, keep it in the Effect.
:::

## Chains of computations

Avoid chaining Effects such as this:

```js
function Game() {
	const [card, setCard] = useState(null);
	const [goldCardCount, setGoldCardCount] = useState(0);
	const [round, setRound] = useState(1);
	const [isGameOver, setIsGameOver] = useState(false);

	// highlight-start
	// 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
	useEffect(() => {
		if (card !== null && card.gold) {
			setGoldCardCount(c => c + 1);
		}
	}, [card]);

	useEffect(() => {
		if (goldCardCount > 3) {
			setRound(r => r + 1);
			setGoldCardCount(0);
		}
	}, [goldCardCount]);

	useEffect(() => {
		if (round > 5) {
			setIsGameOver(true);
		}
	}, [round]);

	useEffect(() => {
		alert("Good game!");
	}, [isGameOver]);
	// highlight-end

	function handlePlaceCard(nextCard) {
		if (isGameOver) {
			throw Error("Game already ended.");
		} else {
			setCard(nextCard);
		}
	}
	// ...
}
```

Re-write as:

```js
function Game() {
	const [card, setCard] = useState(null);
	const [goldCardCount, setGoldCardCount] = useState(0);
	const [round, setRound] = useState(1);

	// highlight-start
	// ✅ Calculate what you can during rendering
	const isGameOver = round > 5;
	// highlight-end

	function handlePlaceCard(nextCard) {
		if (isGameOver) {
			throw Error("Game already ended.");
		}

		// highlight-start
		// ✅ Calculate all the next state in the event handler
		setCard(nextCard);
		if (nextCard.gold) {
			if (goldCardCount <= 3) {
				setGoldCardCount(goldCardCount + 1);
			} else {
				setGoldCardCount(0);
				setRound(round + 1);
				if (round === 5) {
					alert("Good game!");
				}
			}
		}
		// highlight-end
	}
	// ...
}
```

## Initializing the application

Sometimes you'd want to execute code only once, i.e. when the app loads. You might place it in your top-level component like so:

```js
function App() {
	// highlight-start
	// 🔴 Avoid: Effects with logic that should only ever run once
	useEffect(() => {
		loadDataFromLocalStorage();
		checkAuthToken();
	}, []);
	// highlight-end
	// ...
}
```

Generally this will only cause an issue in development ([StrictMode](#strict-mode) forces every component to mount twice).

If some logic must run once per app load, it should be ensured that it hasn't run before, like so:

```js
// highlight-next-line
let didInit = false;

function App() {
	useEffect(() => {
		// highlight-start
		if (!didInit) {
			didInit = true;
			// highlight-end
			// ✅ Only runs once per app load
			loadDataFromLocalStorage();
			checkAuthToken();
			// highlight-next-line
		}
	}, []);
	// ...
}
```

You can also run it during module initialization and before the app renders:

```js
// highlight-next-line
if (typeof window !== "undefined") {
	// Check if we're running in the browser.
	// ✅ Only runs once per app load
	checkAuthToken();
	loadDataFromLocalStorage();
	// highlight-next-line
}

function App() {
	// ...
}
```

:::caution Important
Your components should be resilient to being remounted. This includes your top-level App component.
:::

:::info
Code at the top level runs once when your component is imported—even if it doesn't end up being rendered.

To avoid slowdown or surprising behavior when importing arbitrary components, don't overuse this pattern.

Keep app-wide initialization logic to root component modules like App.js or in your application's entry point module.
:::

## Passing data to the parent

This Child component fetches some data and then passes it to the Parent component in an Effect:

```jsx
function Parent() {
	const [data, setData] = useState(null);
	// ...
	return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
	const data = useSomeAPI();
	// highlight-start
	// 🔴 Avoid: Passing data to the parent in an Effect
	useEffect(() => {
		if (data) {
			onFetched(data);
		}
	}, [onFetched, data]);
	// highlight-end
	// ...
}
```

To make it simpler and keep the data flow predictable: the data should flow down from the parent to the child.

```jsx
function Parent() {
	const data = useSomeAPI();
	// ...
	// highlight-start
	// ✅ Good: Passing data down to the child
	return <Child data={data} />;
	// highlight-end
}

function Child({ data }) {
	// ...
}
```

:::info
In React, data flows from the parent components to their children.

When you see something wrong on the screen, you can trace where the information comes from by going up the component chain until you find which component passes the wrong prop or has the wrong state.

When child components update the state of their parent components in Effects, the data flow becomes very difficult to trace. Since both the child and the parent component need the same data, let the parent component fetch that data, and pass it down to the child instead
:::

## Subscribing to an external store

For listening to changes to a data outside React state (e.g. third-party or built-in browser API), your components may need to subscribe like so:

```js
function useOnlineStatus() {
	// highlight-start
	// Not ideal: Manual store subscription in an Effect
	const [isOnline, setIsOnline] = useState(true);
	useEffect(() => {
		function updateState() {
			setIsOnline(navigator.onLine);
		}

		updateState();

		window.addEventListener("online", updateState);
		window.addEventListener("offline", updateState);
		return () => {
			window.removeEventListener("online", updateState);
			window.removeEventListener("offline", updateState);
		};
	}, []);
	// highlight-end
	return isOnline;
}

function ChatIndicator() {
	const isOnline = useOnlineStatus();
	// ...
}
```

Instead of using useEffect, React's `useSyncExternalStore` hook can be used:

```js
function subscribe(callback) {
	window.addEventListener("online", callback);
	window.addEventListener("offline", callback);
	return () => {
		window.removeEventListener("online", callback);
		window.removeEventListener("offline", callback);
	};
}

function useOnlineStatus() {
	// highlight-start
	// ✅ Good: Subscribing to an external store with a built-in Hook
	return useSyncExternalStore(
		subscribe, // React won't resubscribe for as long as you pass the same function
		() => navigator.onLine, // How to get the value on the client
		() => true // How to get the value on the server
	);
	// highlight-end
}

function ChatIndicator() {
	const isOnline = useOnlineStatus();
	// ...
}
```

## Fetching data

It is quite common to implement data fetching like this:

```js
function SearchResults({ query }) {
	const [results, setResults] = useState([]);
	const [page, setPage] = useState(1);

	// highlight-start
	useEffect(() => {
		// 🔴 Avoid: Fetching without cleanup logic
		fetchResults(query, page).then(json => {
			setResults(json);
		});
	}, [query, page]);
	// highlight-end

	function handleNextPageClick() {
		setPage(page + 1);
	}
	// ...
}
```

The code above has a bug due to missing clean up function. As the user is typing "hello", the result of "hell" may come after "hello" causing race condition.

To fix this issue, we can write the code like this:

```js
function SearchResults({ query }) {
	const [results, setResults] = useState([]);
	const [page, setPage] = useState(1);
	useEffect(() => {
		// highlight-next-line
		let ignore = false;
		fetchResults(query, page).then(json => {
			// highlight-next-line
			if (!ignore) {
				setResults(json);
				// highlight-next-line
			}
		});
		// highlight-start
		return () => {
			ignore = true;
		};
		// highlight-end
	}, [query, page]);

	function handleNextPageClick() {
		setPage(page + 1);
	}
	// ...
}
```

:::tip
The fewer raw useEffect calls you have in your components, the easier you will find to maintain your application.
:::

## Recap

-   If you can calculate something during render, you don't need an Effect.
-   To cache expensive calculations, add useMemo instead of useEffect.
-   To reset the state of an entire component tree, pass a different key to it.
-   To reset a particular bit of state in response to a prop change, set it during rendering.
-   Code that needs to run because a component was displayed should be in Effects, the rest should be in events.
-   If you need to update the state of several components, it's better to do it during a single event.
-   Whenever you try to synchronize state variables in different components, consider lifting state up.
-   You can fetch data with Effects, but you need to implement cleanup to avoid race conditions.
