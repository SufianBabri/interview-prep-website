# React.js

## Strict Mode

It's a tool for highlighting potential problems in an application. It activates additional checks and warnings for its
descendants.

:::note

Strict mode checks are run in development mode only; they do not impact the production build.

:::

You can enable strict mode for any part of your application. For example:

```js
import React from "react";

function ExampleApplication() {
	return (
		<div>
			<Header />
			<React.StrictMode>
				<div>
					<ComponentOne />
					<ComponentTwo />
				</div>
			</React.StrictMode>
			<Footer />
		</div>
	);
}
```

StrictMode currently helps with:

-   Identifying components with **unsafe lifecycles**
-   Warning about legacy **string ref API** usage
-   Warning about deprecated **findDOMNode** usage
-   Detecting **unexpected side effects**
-   Detecting **legacy context API**
-   Ensuring **reusable state**
