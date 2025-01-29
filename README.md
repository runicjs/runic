# Runic

Runic is a vanilla JS state management library. It's primary goal is to be
simple, lightweight, and fast, and have a minimal API surface area that is
easy to understand and ergonomic to use.

## Features

- Simple API with a plain JavaScript approach to state updates
- Updates powered by [Immer](https://immerjs.github.io/immer/) to avoid excessive boilerplate
- Full TypeScript support with strong type inference
- Minimal bundle size with zero dependencies beyond Immer
- Efficient updates through granular change detection and selective re-rendering
- Support for atomic multi-store updates to maintain data consistency
- No Providers, no actions, no reducers, minimal boilerplate

## Roadmap

**repo**

- [ ] Turn this into a monorepo with separate packages.

**runic**

- [x] Implement `createStore`
- [ ] Write tests
- [ ] Implement `createRunic`

**runic-react**

- [x] Implement `useStore`
- [ ] Write tests
- [ ] Implement TodoMVC using runic
- [ ] Verify that there are no unnecessary rerenders
- [ ] Implement a larger app with more complex state using runic
- [ ] IDEA: `useComposite`

## Usage

### Basic Store Creation and Updates

```js
import { createStore } from 'runic';

// Create a store with initial state
const counterStore = createStore({ count: 0 });

// Get the current state
console.log('Current count:', counterStore.getState().count);

// Subscribe to changes
const unsubscribe = counterStore.subscribe((state) => {
  console.log('New count:', state.count);
});

// Update state (changes are made immutably via Immer)
counterStore.update((state) => {
  state.count += 1;
});

// No more state updates.
unsubscribe();

// Overwrite the entire state
const storedState = JSON.parse(localStorage.getItem('counter-store'));
counterStore.setState(storedState);

// Reset the store to the initial state
counterStore.reset();
```

### TypeScript Support

```ts
type Todo = { id: number; text: string; done: boolean };
type Todos = Array<Todo>;

const todosStore = createStore<Todos>([]);

// Write simple functions to update your stores.
function addTodo(newTodo: Todo) {
  todosStore.update((todos) => {
    todos.push(newTodo);
  });
}

addTodo({ id: 1, text: 'Learn Runic', done: false });
```

### Multi-Store Updates

```ts
import { updateStores } from 'runic';

// Create as many stores as you want.
const userStore = createStore<User>({ credits: 100 });
const inventoryStore = createStore<Inventory>(['potion']);

// Update multiple stores at once.
updateStores([userStore, inventoryStore], ([user, inventory]) => {
  user.credits -= 50;
  inventory.push('sword');
});
```

### React

> **Todo**
> Move this to the runic-react package

```tsx
import { createStore } from '@/runic';
import { useStore } from '@/runic-react';

type Counter = {
  count: number;
};

export const counterStore = createStore<Counter>({
  count: 0,
});

export const increment = () => {
  counterStore.update((counter) => {
    counter.count++;
  });
};

export const decrement = () => {
  counterStore.update((counter) => {
    counter.count--;
  });
};

function Counter() {
  // Only re-renders when count changes
  const count = useStore(counterStore, (counter) => counter.count);

  // "Computed" value
  const doubled = useStore(counterStore, (counter) => counter.count * 2);

  return (
    <div>
      <div>
        {count} * 2 = {doubled}
      </div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### Derived Values

> **Warning**
> Not implemented yet

```ts
import { derived } from 'runic';

const todoStore = createStore({
  items: [
    { id: 1, text: 'First task', done: false },
    { id: 2, text: 'Second task', done: true },
  ],
});

// Create a derived value that updates when source changes
const incompleteTodos = derived<IncompleteTodos>([todosStore], ([todos]) => todos.items.filter((item) => !item.done));

incompleteTodos.subscribe((todos) => {
  console.log('Incomplete tasks:', todos.length);
});
```

## Development

```bash
$ npm i
$ npm run dev
# open http://localhost:5173/
```
